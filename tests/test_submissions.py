import pytest
from fastapi.testclient import TestClient

def test_submit_diabetes_assessment(client: TestClient):
    """Test diabetes assessment submission"""
    submission_data = {
        "assessment_type_id": "diabetes",
        "session_id": "test-submission-123",
        "data": {
            "age": 55,
            "weight": 85,
            "height": 170,
            "fastingGlucose": "110",
            "hba1c": "6.0",
            "familyHistory": "نعم",
            "exercise": "نادراً",
            "smoking": "لا"
        }
    }
    
    response = client.post("/submissions/", json=submission_data)
    assert response.status_code == 201
    data = response.json()
    assert "submission_id" in data
    assert "risk_id" in data
    assert "score" in data
    assert "risk_bucket" in data
    assert "recommendations" in data
    assert data["score"] >= 0.0 and data["score"] <= 1.0

def test_submit_hypertension_assessment(client: TestClient):
    """Test hypertension assessment submission"""
    submission_data = {
        "assessment_type_id": "hypertension",
        "session_id": "test-bp-session",
        "data": {
            "age": 60,
            "weight": 90,
            "height": 175,
            "bpReadings": [
                {"systolic": "150", "diastolic": "95"},
                {"systolic": "145", "diastolic": "90"}
            ],
            "salt": "كثير",
            "exercise": "لا أمارس",
            "familyHistory": "نعم"
        }
    }
    
    response = client.post("/submissions/", json=submission_data)
    assert response.status_code == 201
    data = response.json()
    assert data["risk_bucket"] in ["low", "medium", "high"]
    assert len(data["recommendations"]) > 0

def test_submit_heart_assessment(client: TestClient):
    """Test heart disease assessment submission"""
    submission_data = {
        "assessment_type_id": "heart",
        "session_id": "test-heart-session",
        "data": {
            "age": 65,
            "gender": "ذكر",
            "cholesterol": "250",
            "ldl": "170",
            "hdl": "35",
            "smoking": "نعم",
            "familyHistory": "نعم",
            "exercise": "لا أمارس"
        }
    }
    
    response = client.post("/submissions/", json=submission_data)
    assert response.status_code == 201
    data = response.json()
    assert data["score"] > 0.5  # Should be high risk
    assert data["risk_bucket"] in ["medium", "high"]

def test_get_submission(client: TestClient):
    """Test getting submission by ID"""
    # Submit assessment first
    submission_data = {
        "assessment_type_id": "diabetes",
        "session_id": "test-get-submission",
        "data": {"age": 30, "weight": 70, "height": 165}
    }
    
    submit_response = client.post("/submissions/", json=submission_data)
    submission_id = submit_response.json()["submission_id"]
    
    # Get submission
    response = client.get(f"/submissions/{submission_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == submission_id
    assert data["data"]["age"] == 30

def test_submit_invalid_assessment_type(client: TestClient):
    """Test submission with invalid assessment type"""
    submission_data = {
        "assessment_type_id": "invalid_disease",
        "session_id": "test-invalid",
        "data": {"age": 30}
    }
    
    response = client.post("/submissions/", json=submission_data)
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]