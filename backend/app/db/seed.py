import sys
from datetime import datetime, timedelta, timezone
from app.core.config import settings
from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models.activity import Activity
from app.models.chat import ChatMessage
from app.models.record import Record
from app.models.user import User


def seed_database():
    print("[*] Initializing database schema...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if demo user already exists
        demo_user = db.query(User).filter(User.email == settings.DEMO_USER_EMAIL).first()
        if demo_user:
            print(f"[i] Demo user {settings.DEMO_USER_EMAIL} already exists. Cleaning existing records for fresh seed...")
            db.query(ChatMessage).filter(ChatMessage.user_id == demo_user.id).delete()
            db.query(Activity).filter(Activity.user_id == demo_user.id).delete()
            db.query(Record).filter(Record.owner_id == demo_user.id).delete()
            db.delete(demo_user)
            db.commit()

        print("[+] Creating demo users...")
        hashed_pw = get_password_hash(settings.DEMO_USER_PASSWORD)
        demo_user = User(
            email=settings.DEMO_USER_EMAIL,
            password_hash=hashed_pw,
            full_name=settings.DEMO_USER_NAME,
            role="admin",
            is_active=True,
        )
        db.add(demo_user)

        sarah_user = User(
            email="sarah.chen@atlasworkspace.io",
            password_hash=hashed_pw,
            full_name="Sarah Chen",
            role="member",
            is_active=True,
        )
        db.add(sarah_user)
        db.commit()
        db.refresh(demo_user)
        db.refresh(sarah_user)

        now = datetime.now(timezone.utc)

        print("[+] Creating sample deterministic records...")
        sample_records_data = [
            {
                "title": "Cloud Infrastructure Migration Q4",
                "description": "Migrate core microservices from legacy clusters to optimized high-availability Kubernetes on Azure.",
                "category": "Engineering",
                "priority": "Urgent",
                "status": "In Progress",
                "tags": ["DevOps", "Cloud", "Kubernetes"],
                "due_date": now + timedelta(days=14),
                "created_at": now - timedelta(days=6),
                "updated_at": now - timedelta(hours=2),
                "checklist": [
                    {"id": "1", "text": "Audit existing compute sizing", "completed": True},
                    {"id": "2", "text": "Provision staging VPC and subnets", "completed": True},
                    {"id": "3", "text": "Execute zero-downtime database cutover", "completed": False},
                    {"id": "4", "text": "Run automated load validation suite", "completed": False},
                ],
            },
            {
                "title": "Enterprise SSO & SAML 2.0 Integration",
                "description": "Implement Okta and Microsoft Entra ID enterprise authentication for Tier-1 corporate clients.",
                "category": "Engineering",
                "priority": "High",
                "status": "In Progress",
                "tags": ["Security", "Auth", "SSO"],
                "due_date": now + timedelta(days=7),
                "created_at": now - timedelta(days=5),
                "updated_at": now - timedelta(hours=5),
                "checklist": [
                    {"id": "1", "text": "Implement SP-initiated SAML flow", "completed": True},
                    {"id": "2", "text": "SCIM user provisioning endpoint", "completed": False},
                    {"id": "3", "text": "Security penetration review", "completed": False},
                ],
            },
            {
                "title": "Q3 Financial Growth & Runway Audit",
                "description": "Comprehensive analysis of SaaS ARR growth, customer acquisition cost, and gross margin optimization.",
                "category": "Finance",
                "priority": "Medium",
                "status": "Completed",
                "tags": ["Finance", "Auditing", "Reporting"],
                "due_date": now - timedelta(days=2),
                "created_at": now - timedelta(days=10),
                "updated_at": now - timedelta(days=1),
                "checklist": [
                    {"id": "1", "text": "Reconcile Stripe billing ledger", "completed": True},
                    {"id": "2", "text": "Deliver board investor deck summary", "completed": True},
                ],
            },
            {
                "title": "Design System Modernization & Tokens",
                "description": "Unify component library with soft mint accents, standardized focus rings, and responsive typography.",
                "category": "Design",
                "priority": "High",
                "status": "Completed",
                "tags": ["Design System", "Figma", "UI/UX"],
                "due_date": now - timedelta(days=1),
                "created_at": now - timedelta(days=8),
                "updated_at": now - timedelta(days=2),
                "checklist": [
                    {"id": "1", "text": "Publish Figma color token palette", "completed": True},
                    {"id": "2", "text": "Update Tailwind CSS utility classes", "completed": True},
                    {"id": "3", "text": "Accessibility WCAG AAA contrast check", "completed": True},
                ],
            },
            {
                "title": "SOC 2 Type II Compliance Readiness",
                "description": "Conduct internal security readiness assessment, access control reviews, and encryption verification.",
                "category": "Legal",
                "priority": "Urgent",
                "status": "Open",
                "tags": ["Compliance", "Security", "SOC2"],
                "due_date": now + timedelta(days=21),
                "created_at": now - timedelta(days=4),
                "updated_at": now - timedelta(days=3),
                "checklist": [
                    {"id": "1", "text": "Vendor risk assessment inventory", "completed": True},
                    {"id": "2", "text": "Continuous posture logging audit", "completed": False},
                    {"id": "3", "text": "Auditor evidence collection", "completed": False},
                ],
            },
            {
                "title": "Customer Feedback & NPS Analytics Loop",
                "description": "Analyze recurring workflow bottlenecks from customer success tickets and compile product insights.",
                "category": "Product",
                "priority": "Medium",
                "status": "Open",
                "tags": ["Product", "Customer Success", "Analytics"],
                "due_date": now + timedelta(days=10),
                "created_at": now - timedelta(days=3),
                "updated_at": now - timedelta(days=1),
                "checklist": [
                    {"id": "1", "text": "Export 500 CSAT response records", "completed": True},
                    {"id": "2", "text": "Cluster common UX pain points", "completed": False},
                ],
            },
            {
                "title": "Automated PDF & CSV Report Generator",
                "description": "Build high-throughput streaming background job to export customized workspace audit reports.",
                "category": "Engineering",
                "priority": "Low",
                "status": "In Progress",
                "tags": ["Reporting", "Backend", "FastAPI"],
                "due_date": now + timedelta(days=12),
                "created_at": now - timedelta(days=2),
                "updated_at": now - timedelta(hours=8),
                "checklist": [
                    {"id": "1", "text": "Define schema for export payloads", "completed": True},
                    {"id": "2", "text": "Streaming HTTP response handler", "completed": True},
                ],
            },
            {
                "title": "Operational Incident Post-Mortem Guidelines",
                "description": "Standardize team retrospectives, blameless RCA templates, and action item tracking.",
                "category": "Operations",
                "priority": "Low",
                "status": "Completed",
                "tags": ["Operations", "SRE", "Best Practices"],
                "due_date": now - timedelta(days=5),
                "created_at": now - timedelta(days=9),
                "updated_at": now - timedelta(days=4),
                "checklist": [
                    {"id": "1", "text": "Draft blameless post-mortem template", "completed": True},
                    {"id": "2", "text": "Distribute to engineering teams", "completed": True},
                ],
            },
            {
                "title": "AI Copilot Semantic Context Enhancement",
                "description": "Expand prompt embeddings and authorization-aware database retrieval for contextual assistant responses.",
                "category": "Strategy",
                "priority": "High",
                "status": "Draft",
                "tags": ["AI", "GenAI", "Assistant"],
                "due_date": now + timedelta(days=30),
                "created_at": now - timedelta(days=1),
                "updated_at": now - timedelta(hours=3),
                "checklist": [
                    {"id": "1", "text": "Draft system prompt instructions", "completed": True},
                    {"id": "2", "text": "Benchmark response token latency", "completed": False},
                ],
            },
            {
                "title": "Mobile Responsive Navigation Polish",
                "description": "Refine drawer touch targets and table overflow behaviors for smaller smartphone viewports.",
                "category": "Design",
                "priority": "Medium",
                "status": "In Progress",
                "tags": ["Mobile", "Tailwind", "Responsive"],
                "due_date": now + timedelta(days=4),
                "created_at": now - timedelta(days=2),
                "updated_at": now - timedelta(minutes=45),
                "checklist": [
                    {"id": "1", "text": "Test 390px iPhone viewport drawer", "completed": True},
                    {"id": "2", "text": "Verify horizontal scroll container on tables", "completed": False},
                ],
            },
        ]

        created_records = []
        for rec_data in sample_records_data:
            rec = Record(
                title=rec_data["title"],
                description=rec_data["description"],
                category=rec_data["category"],
                priority=rec_data["priority"],
                status=rec_data["status"],
                tags=rec_data["tags"],
                due_date=rec_data["due_date"],
                checklist=rec_data["checklist"],
                owner_id=demo_user.id,
                created_at=rec_data["created_at"],
                updated_at=rec_data["updated_at"],
            )
            db.add(rec)
            created_records.append(rec)

        db.commit()

        print("[+] Creating sample activity logs...")
        activities_data = [
            ("login", f"User {demo_user.full_name} signed in.", now - timedelta(days=6)),
            ("create", "Created record 'Cloud Infrastructure Migration Q4'.", now - timedelta(days=6)),
            ("status_change", "Updated 'Cloud Infrastructure Migration Q4' to In Progress.", now - timedelta(days=4)),
            ("create", "Created record 'Design System Modernization & Tokens'.", now - timedelta(days=8)),
            ("status_change", "Marked 'Design System Modernization & Tokens' as Completed.", now - timedelta(days=2)),
            ("create", "Created record 'Enterprise SSO & SAML 2.0 Integration'.", now - timedelta(days=5)),
            ("create", "Created record 'SOC 2 Type II Compliance Readiness'.", now - timedelta(days=4)),
            ("status_change", "Marked 'Q3 Financial Growth & Runway Audit' as Completed.", now - timedelta(days=1)),
            ("export", "Exported 10 records as CSV file.", now - timedelta(hours=4)),
            ("update", "Updated checklist on 'Cloud Infrastructure Migration Q4'.", now - timedelta(hours=2)),
        ]

        for action_type, desc, act_time in activities_data:
            act = Activity(
                user_id=demo_user.id,
                action_type=action_type,
                description=desc,
                action_metadata={"seeded": True},
                created_at=act_time,
            )
            db.add(act)

        print("[+] Creating starter assistant chat messages...")
        chat_msgs = [
            ("user", "Summarize my workspace.", now - timedelta(hours=3)),
            (
                "assistant",
                "📊 **Workspace Summary for Alex Mercer**\n\n- **Total Records:** 10\n- **Active In Progress:** 4\n- **Open Backlog:** 2\n- **Completed:** 3 (30.0% completion rate)\n\n🔥 **High Priority / Needs Attention:**\n• Cloud Infrastructure Migration Q4 (Engineering, Urgent)\n• Enterprise SSO & SAML 2.0 Integration (Engineering, High)\n• SOC 2 Type II Compliance Readiness (Legal, Urgent)",
                now - timedelta(hours=3, minutes=-1),
            ),
        ]
        for role, content, msg_time in chat_msgs:
            c = ChatMessage(
                user_id=demo_user.id,
                conversation_id="default",
                role=role,
                content=content,
                created_at=msg_time,
            )
            db.add(c)

        db.commit()

        print("[SUCCESS] Database seeding completed successfully!")
        print(f"    Demo Account: {settings.DEMO_USER_EMAIL}")
        print(f"    Password:     {settings.DEMO_USER_PASSWORD}")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
