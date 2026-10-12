import json
from datetime import datetime, timezone
from typing import List, Optional
import httpx
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.chat import ChatMessage
from app.models.record import Record
from app.models.user import User
from app.schemas.assistant import ChatRequest, ChatResponse


class AssistantService:
    @staticmethod
    def process_chat(
        db: Session,
        current_user: Optional[User],
        request: ChatRequest,
    ) -> ChatResponse:
        user_msg = request.message.strip()
        conv_id = request.conversation_id or "default"

        # Save user message to database if user is logged in
        if current_user:
            user_chat_record = ChatMessage(
                user_id=current_user.id,
                conversation_id=conv_id,
                role="user",
                content=user_msg,
            )
            db.add(user_chat_record)
            db.commit()

        # Gather user's real workspace data context
        user_records: List[Record] = []
        if current_user:
            q = db.query(Record)
            if current_user.role != "admin":
                q = q.filter(Record.owner_id == current_user.id)
            user_records = q.all()

        total_count = len(user_records)
        in_progress_records = [r for r in user_records if r.status == "In Progress"]
        open_records = [r for r in user_records if r.status == "Open"]
        completed_records = [r for r in user_records if r.status == "Completed"]
        high_priority = [r for r in user_records if r.priority in ("High", "Urgent") and r.status != "Completed"]

        # Check if external AI provider is configured and available
        if settings.AI_PROVIDER and settings.AI_API_KEY:
            try:
                external_reply = AssistantService._call_external_ai(
                    user_msg=user_msg,
                    records=user_records,
                    user_name=current_user.full_name if current_user else "Guest",
                )
                if external_reply:
                    # Save assistant reply
                    if current_user:
                        asst_chat_record = ChatMessage(
                            user_id=current_user.id,
                            conversation_id=conv_id,
                            role="assistant",
                            content=external_reply,
                        )
                        db.add(asst_chat_record)
                        db.commit()

                    return ChatResponse(
                        reply=external_reply,
                        role="assistant",
                        conversation_id=conv_id,
                        is_live_model=True,
                        model_name=f"{settings.AI_PROVIDER} ({settings.AI_MODEL_NAME})",
                        suggestions=[
                            "Which records need attention?",
                            "Help me create a record.",
                            "Explain the current dashboard.",
                        ],
                    )
            except Exception as e:
                # Log and fallback gracefully to deterministic workspace engine
                pass

        # Local deterministic rule-based workspace intelligence engine
        reply, suggestions = AssistantService._rule_based_response(
            msg=user_msg,
            user=current_user,
            total_count=total_count,
            in_progress=in_progress_records,
            open_recs=open_records,
            completed=completed_records,
            high_priority=high_priority,
        )

        # Save assistant message
        if current_user:
            asst_chat_record = ChatMessage(
                user_id=current_user.id,
                conversation_id=conv_id,
                role="assistant",
                content=reply,
            )
            db.add(asst_chat_record)
            db.commit()

        return ChatResponse(
            reply=reply,
            role="assistant",
            conversation_id=conv_id,
            is_live_model=False,
            model_name="ATLAS Rule-Based Assistant (Local Engine)",
            suggestions=suggestions,
        )

    @staticmethod
    def _rule_based_response(
        msg: str,
        user: Optional[User],
        total_count: int,
        in_progress: List[Record],
        open_recs: List[Record],
        completed: List[Record],
        high_priority: List[Record],
    ) -> (str, List[str]):
        lower = msg.lower()

        if not user:
            return (
                "👋 Hello! I am your ATLAS AI Assistant. You are currently viewing the login screen. "
                "You can sign in with your account or use the demo credentials (`demo@atlasworkspace.io` / `AtlasDemo2026!`) "
                "to explore the full records dashboard, multi-step creation flow, and analytics.",
                ["How do I log in?", "What is ATLAS Workspace?", "Help me get started"],
            )

        name = user.full_name

        # Query: Summarize workspace / Overview
        if any(w in lower for w in ["summarize", "overview", "summary", "status", "workspace"]):
            completion_rate = (
                round((len(completed) / total_count) * 100, 1) if total_count > 0 else 0
            )
            top_urgent = [f"• {r.title} ({r.category}, {r.priority})" for r in high_priority[:3]]
            urgent_str = "\n".join(top_urgent) if top_urgent else "• None! All critical records are up to date."

            reply = (
                f"📊 **Workspace Summary for {name}**\n\n"
                f"- **Total Records:** {total_count}\n"
                f"- **Active In Progress:** {len(in_progress)}\n"
                f"- **Open Backlog:** {len(open_recs)}\n"
                f"- **Completed:** {len(completed)} ({completion_rate}% rate)\n\n"
                f"🔥 **High Priority / Needs Attention:**\n{urgent_str}\n\n"
                f"You can view these directly under the **Records** tab or create a new item via **Create Record**."
            )
            suggestions = [
                "Which records need attention?",
                "How many records are still in progress?",
                "Explain the current dashboard.",
            ]
            return reply, suggestions

        # Query: Needs attention / High priority / Urgent
        if any(w in lower for w in ["attention", "urgent", "high priority", "critical", "blocking"]):
            if not high_priority:
                reply = (
                    f"🎉 Great news, {name}! You currently have no incomplete high or urgent priority records. "
                    f"All critical tasks are either completed or scheduled smoothly."
                )
            else:
                items_str = "\n".join(
                    [f"1. **{r.title}** — {r.category} | Priority: `{r.priority}` | Status: `{r.status}`" for r in high_priority[:5]]
                )
                reply = (
                    f"⚠️ **Records Requiring Immediate Attention ({len(high_priority)} found):**\n\n"
                    f"{items_str}\n\n"
                    f"Recommendation: Review these records first on your **Records Management** table."
                )
            suggestions = [
                "Summarize my workspace.",
                "How many records are still in progress?",
                "Help me create a record.",
            ]
            return reply, suggestions

        # Query: In progress count / details
        if "in progress" in lower or "progress" in lower or "active" in lower:
            if not in_progress:
                reply = f"You currently have **0 records in progress**. There are {len(open_recs)} open records waiting in your backlog."
            else:
                items_str = "\n".join([f"• **{r.title}** ({r.category})" for r in in_progress[:5]])
                reply = (
                    f"⚡ You currently have **{len(in_progress)} records in progress**:\n\n"
                    f"{items_str}\n\n"
                    f"Track their status or mark checklists complete directly on the Records page."
                )
            suggestions = [
                "Which records need attention?",
                "Summarize my workspace.",
                "Explain the current dashboard.",
            ]
            return reply, suggestions

        # Query: Help create a record
        if any(w in lower for w in ["create", "new record", "add record", "submit"]):
            reply = (
                "📝 **Creating a Record in ATLAS Workspace:**\n\n"
                "1. Click **Create Record** in the sidebar or top banner.\n"
                "2. **Step 1 - Basic Information:** Enter Title, Description, Category, Owner, and Optional Due Date.\n"
                "3. **Step 2 - Classification:** Select Priority (Low, Medium, High, Urgent), Status (Draft, Open, In Progress, Completed), add custom Tags, and define Checklist tasks.\n"
                "4. **Step 3 - Review & Submit:** Verify your live preview on the right contextual panel and click **Submit Record**.\n\n"
                "Your new record will immediately sync to PostgreSQL/database and populate your dashboard charts."
            )
            suggestions = [
                "Summarize my workspace.",
                "Explain the current dashboard.",
                "Which records need attention?",
            ]
            return reply, suggestions

        # Query: Explain dashboard
        if any(w in lower for w in ["explain", "dashboard", "metric", "chart"]):
            reply = (
                "📈 **ATLAS Dashboard Breakdown:**\n\n"
                "• **Top 4 Metric Cards:** Live counts of Total Records, Active Tasks, Completed Items, and Overall Completion Rate.\n"
                "• **Overview Activity Chart:** Interactive area chart illustrating records created vs completed over time.\n"
                "• **Status Breakdown Donut:** Proportional visual breakdown across Open, In Progress, Completed, Draft, and Archived states.\n"
                "• **Recent Activity Stream:** Real-time audit log of your team's creations, updates, and exports."
            )
            suggestions = [
                "Summarize my workspace.",
                "Which records need attention?",
                "Help me create a record.",
            ]
            return reply, suggestions

        # Default friendly conversational fallback
        reply = (
            f"Hello {name}! I am ATLAS Assistant. I have live access to your workspace database containing "
            f"**{total_count} records** ({len(in_progress)} active in progress, {len(high_priority)} high priority).\n\n"
            f"You can ask me to summarize your records, identify urgent items, check activity, or guide you through creating records."
        )
        suggestions = [
            "Summarize my workspace.",
            "Which records need attention?",
            "How many records are still in progress?",
            "Explain the current dashboard.",
        ]
        return reply, suggestions

    @staticmethod
    def _call_external_ai(user_msg: str, records: List[Record], user_name: str) -> Optional[str]:
        # Minimal context payload
        context_items = [
            {"id": r.id, "title": r.title, "category": r.category, "priority": r.priority, "status": r.status}
            for r in records[:20]
        ]
        prompt = (
            f"You are the ATLAS Workspace AI Assistant. The user is {user_name}.\n"
            f"Authorized workspace records context: {json.dumps(context_items)}\n"
            f"User question: {user_msg}\n"
            f"Answer helpfully, concisely, and factually based on this workspace data."
        )

        if settings.AI_PROVIDER.lower() == "gemini":
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.AI_MODEL_NAME}:generateContent?key={settings.AI_API_KEY}"
            payload = {"contents": [{"parts": [{"text": prompt}]}]}
            with httpx.Client(timeout=10.0) as client:
                res = client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            return parts[0].get("text", "")
        return None
