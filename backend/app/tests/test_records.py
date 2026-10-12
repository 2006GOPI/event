def test_create_record(client, test_user_token):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    payload = {
        "title": "Build Authentication Flow",
        "description": "Implement JWT and role checks.",
        "category": "Engineering",
        "priority": "High",
        "status": "In Progress",
        "tags": ["Security", "API"],
        "checklist": [{"id": "1", "text": "Tokens", "completed": True}],
    }
    response = client.post("/api/v1/records", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Build Authentication Flow"
    assert data["status"] == "In Progress"
    assert len(data["checklist"]) == 1


def test_create_record_validation_error(client, test_user_token):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    # Missing title
    payload = {
        "description": "No title provided",
        "category": "Engineering",
    }
    response = client.post("/api/v1/records", json=payload, headers=headers)
    assert response.status_code == 422


def test_get_records_list_and_search(client, test_user_token):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    # Create two records
    client.post(
        "/api/v1/records",
        json={"title": "Alpha Project", "category": "Strategy", "priority": "High", "status": "Open"},
        headers=headers,
    )
    client.post(
        "/api/v1/records",
        json={"title": "Beta System", "category": "Engineering", "priority": "Low", "status": "Completed"},
        headers=headers,
    )

    # List all
    res = client.get("/api/v1/records", headers=headers)
    assert res.status_code == 200
    assert res.json()["total"] == 2

    # Search for Alpha
    res_search = client.get("/api/v1/records?search=Alpha", headers=headers)
    assert res_search.json()["total"] == 1
    assert res_search.json()["items"][0]["title"] == "Alpha Project"

    # Filter by status
    res_status = client.get("/api/v1/records?status=Completed", headers=headers)
    assert res_status.json()["total"] == 1
    assert res_status.json()["items"][0]["title"] == "Beta System"


def test_update_record(client, test_user_token):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    create_res = client.post(
        "/api/v1/records",
        json={"title": "Initial Title", "status": "Open"},
        headers=headers,
    )
    rec_id = create_res.json()["id"]

    patch_res = client.patch(
        f"/api/v1/records/{rec_id}",
        json={"title": "Updated Title", "status": "In Progress"},
        headers=headers,
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["title"] == "Updated Title"
    assert patch_res.json()["status"] == "In Progress"


def test_delete_record(client, test_user_token):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    create_res = client.post(
        "/api/v1/records",
        json={"title": "To Delete", "status": "Open"},
        headers=headers,
    )
    rec_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/records/{rec_id}", headers=headers)
    assert del_res.status_code == 200

    # Ensure it no longer exists
    get_res = client.get(f"/api/v1/records/{rec_id}", headers=headers)
    assert get_res.status_code == 404


def test_ownership_enforcement(client, test_user_token, second_user_token):
    # User 1 creates record
    h1 = {"Authorization": f"Bearer {test_user_token}"}
    create_res = client.post(
        "/api/v1/records",
        json={"title": "User 1 Private Record", "status": "Open"},
        headers=h1,
    )
    rec_id = create_res.json()["id"]

    # User 2 tries to access User 1's record
    h2 = {"Authorization": f"Bearer {second_user_token}"}
    get_res = client.get(f"/api/v1/records/{rec_id}", headers=h2)
    assert get_res.status_code == 403

    # User 2 tries to edit User 1's record
    patch_res = client.patch(f"/api/v1/records/{rec_id}", json={"title": "Hacked Title"}, headers=h2)
    assert patch_res.status_code == 403

    # User 2 tries to delete User 1's record
    del_res = client.delete(f"/api/v1/records/{rec_id}", headers=h2)
    assert del_res.status_code == 403


def test_export_csv(client, test_user_token):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    client.post(
        "/api/v1/records",
        json={"title": "Exportable Record", "category": "Operations", "priority": "Medium", "status": "Open"},
        headers=headers,
    )

    res = client.get("/api/v1/records/export", headers=headers)
    assert res.status_code == 200
    assert "text/csv" in res.headers["content-type"]
    assert "Exportable Record" in res.text
