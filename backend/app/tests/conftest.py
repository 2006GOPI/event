import os
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.record import Record
from app.models.user import User

# In-memory SQLite database for isolated test execution
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def test_user(db_session):
    user = User(
        email="testuser@atlasworkspace.io",
        password_hash=get_password_hash("TestPassword123!"),
        full_name="Test User",
        role="member",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def test_user_token(client, test_user):
    resp = client.post(
        "/api/v1/auth/login",
        json={"email": "testuser@atlasworkspace.io", "password": "TestPassword123!"},
    )
    return resp.json()["access_token"]


@pytest.fixture(scope="function")
def second_user(db_session):
    user = User(
        email="seconduser@atlasworkspace.io",
        password_hash=get_password_hash("TestPassword123!"),
        full_name="Second User",
        role="member",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def second_user_token(client, second_user):
    resp = client.post(
        "/api/v1/auth/login",
        json={"email": "seconduser@atlasworkspace.io", "password": "TestPassword123!"},
    )
    return resp.json()["access_token"]
