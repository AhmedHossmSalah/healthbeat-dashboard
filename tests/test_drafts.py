import pytest
from fastapi.testclient import TestClient

def test_save_draft_anonymous(client: TestClient):
    """Test saving draft for anonymous user"""
    draft_data = {
        "assessment_type_id": "diabetes",
        "session_id": "test-session-123",
        "data": {"age": 45, "weight": 80}
    }
    
    response = client.post("/drafts/", json=draft_data)
    assert response.status_code == 201
    data = response.json()
    assert data["session_id"] == "test-session-123"
    assert data["data"]["age"] == 45

def test_get_draft_anonymous(client: TestClient):
    """Test getting draft for anonymous user"""
    # Save draft first
    draft_data = {
        "assessment_type_id": "diabetes",
        "session_id": "test-session-456",
        "data": {"age": 50}
    }
    client.post("/drafts/", json=draft_data)
    
    # Get draft
    response = client.get("/drafts/?assessment_type_id=diabetes&session_id=test-session-456")
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["age"] == 50

def test_save_draft_authenticated(client: TestClient, test_user_data):
    """Test saving draft for authenticated user"""
    # Register and login
    client.post("/auth/register", json=test_user_data)
    login_response = client.post("/auth/login", json={
        "email": test_user_data["email"],
        "password": test_user_data["password"]
    })
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Save draft
    draft_data = {
        "assessment_type_id": "diabetes",
        "data": {"age": 35, "height": 175}
    }
    
    response = client.post("/drafts/", json=draft_data, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["data"]["age"] == 35
    assert data["user_id"] is not None

def test_upsert_draft(client: TestClient):
    """Test draft upsert functionality"""
    session_id = "test-upsert-session"
    
    # Save initial draft
    draft_data = {
        "assessment_type_id": "diabetes",
        "session_id": session_id,
        "data": {"age": 40}
    }
    response1 = client.post("/drafts/", json=draft_data)
    assert response1.status_code == 201
    draft_id_1 = response1.json()["id"]
    
    # Update draft (should upsert)
    draft_data["data"]["weight"] = 75
    response2 = client.post("/drafts/", json=draft_data)
    assert response2.status_code == 201
    draft_id_2 = response2.json()["id"]
    
    # Should be same draft ID (upserted)
    assert draft_id_1 == draft_id_2
    assert response2.json()["data"]["weight"] == 75
    assert response2.json()["data"]["age"] == 40