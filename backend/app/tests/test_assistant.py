def test_assistant_unauthenticated(client):
    res = client.post(
        "/api/v1/assistant/chat",
        json={"message": "Hello, how do I get started?", "conversation_id": "test_conv"},
    )
    assert res.status_code == 200
    data = res.json()
    assert "login" in data["reply"].lower() or "atlas" in data["reply"].lower()
    assert data["is_live_model"] is False
    assert len(data["suggestions"]) > 0


def test_assistant_authenticated_summary(client, test_user_token):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    # Add a critical record
    client.post(
        "/api/v1/records",
        json={"title": "Fix Critical Security Bug", "priority": "Urgent", "status": "In Progress"},
        headers=headers,
    )

    # Ask for workspace summary
    res = client.post(
        "/api/v1/assistant/chat",
        json={"message": "Summarize my workspace.", "conversation_id": "conv_1"},
        headers=headers,
    )
    assert res.status_code == 200
    data = res.json()
    assert "Fix Critical Security Bug" in data["reply"] or "Workspace Summary" in data["reply"]

    # Ask for urgent records
    res_urgent = client.post(
        "/api/v1/assistant/chat",
        json={"message": "Which records need attention?", "conversation_id": "conv_1"},
        headers=headers,
    )
    assert res_urgent.status_code == 200
    assert "Fix Critical Security Bug" in res_urgent.json()["reply"]

    # Check chat history
    res_hist = client.get("/api/v1/assistant/history?conversation_id=conv_1", headers=headers)
    assert res_hist.status_code == 200
    assert len(res_hist.json()) >= 4  # 2 user messages + 2 assistant responses
