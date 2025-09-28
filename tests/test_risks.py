import pytest
from fastapi.testclient import TestClient

def test_get_risk_assessment_details(client: TestClient):
    """Test getting complete risk assessment details"""
    # Submit assessment first
    submission_data = {
        "assessment_type_id": "diabetes",
        "session_id": "test-risk-details",
        "data": {
            "age": 50,
            "weight": 80,
            "height": 170,
            "fastingGlucose": "120",
            "hba1c": "6.2",
            "familyHistory": "نعم"
        }
    }
    
    submit_response = client.post("/submissions/", json=submission_data)
    risk_id = submit_response.json()["risk_id"]
    
    # Get risk details
    response = client.get(f"/risks/{risk_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == risk_id
    assert data["disease"] == "diabetes"
    assert "disease_specific" in data
    assert "recommendations" in data
    assert "submission_data" in data

def test_get_nonexistent_risk(client: TestClient):
    """Test getting non-existent risk assessment"""
    fake_uuid = "00000000-0000-0000-0000-000000000000"
    response = client.get(f"/risks/{fake_uuid}")
    assert response.status_code == 404

def test_risk_assessment_permissions(client: TestClient, test_user_data):
    """Test risk assessment access permissions"""
    # Register and login user 1
    client.post("/auth/register", json=test_user_data)
    login_response = client.post("/auth/login", json={
        "email": test_user_data["email"],
        "password": test_user_data["password"]
    })
    token1 = login_response.json()["access_token"]
    
    # Submit assessment as user 1
    submission_data = {
        "assessment_type_id": "diabetes",
        "data": {"age": 40}
    }
    headers1 = {"Authorization": f"Bearer {token1}"}
    submit_response = client.post("/submissions/", json=submission_data, headers=headers1)
    risk_id = submit_response.json()["risk_id"]
    
    # Register and login user 2
    user2_data = {
        "email": "user2@example.com",
        "password": "Pass123!",
        "full_name": "User Two"
    }
    client.post("/auth/register", json=user2_data)
    login_response2 = client.post("/auth/login", json={
        "email": user2_data["email"],
        "password": user2_data["password"]
    })
    token2 = login_response2.json()["access_token"]
    
    # Try to access user 1's risk assessment as user 2
    headers2 = {"Authorization": f"Bearer {token2}"}
    response = client.get(f"/risks/{risk_id}", headers=headers2)
    assert response.status_code == 403