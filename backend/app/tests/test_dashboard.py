def test_dashboard_overview(client, test_user_token):
    headers = {"Authorization": f"Bearer {test_user_token}"}

    # Create test records with different statuses
    client.post(
        "/api/v1/records",
        json={"title": "Task 1", "status": "In Progress"},
        headers=headers,
    )
    client.post(
        "/api/v1/records",
        json={"title": "Task 2", "status": "Completed"},
        headers=headers,
    )
    client.post(
        "/api/v1/records",
        json={"title": "Task 3", "status": "Open"},
        headers=headers,
    )

    res = client.get("/api/v1/dashboard/overview", headers=headers)
    assert res.status_code == 200
    data = res.json()

    assert data["summary"]["total_records"] == 3
    assert data["summary"]["active_tasks"] == 2  # In Progress + Open
    assert data["summary"]["completed_items"] == 1
    assert data["summary"]["completion_rate"] == 33.3
    assert len(data["status_breakdown"]) > 0
    assert len(data["activity_timeline"]) == 7
    assert len(data["recent_activities"]) >= 3
