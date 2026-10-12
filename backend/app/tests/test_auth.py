from app.core.security import verify_password


def test_register_success(client):
    payload = {
        "email": "newuser@atlasworkspace.io",
        "password": "StrongPassword2026!",
        "full_name": "New Registered User",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "newuser@atlasworkspace.io"
    assert data["user"]["full_name"] == "New Registered User"


def test_register_duplicate_email(client, test_user):
    payload = {
        "email": "testuser@atlasworkspace.io",
        "password": "AnyPassword123!",
        "full_name": "Duplicate Attempt",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_login_success(client, test_user):
    payload = {
        "email": "testuser@atlasworkspace.io",
        "password": "TestPassword123!",
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "testuser@atlasworkspace.io"


def test_login_wrong_password(client, test_user):
    payload = {
        "email": "testuser@atlasworkspace.io",
        "password": "WrongPassword999!",
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]


def test_login_unknown_user(client):
    payload = {
        "email": "nobody@atlasworkspace.io",
        "password": "Password123!",
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 401


def test_password_hashing(test_user):
    assert test_user.password_hash != "TestPassword123!"
    assert verify_password("TestPassword123!", test_user.password_hash) is True
    assert verify_password("WrongPassword!", test_user.password_hash) is False


def test_get_me_authenticated(client, test_user_token):
    headers = {"Authorization": f"Bearer {test_user_token}"}
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == "testuser@atlasworkspace.io"


def test_get_me_unauthenticated(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
