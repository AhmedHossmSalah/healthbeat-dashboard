import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

def test_register_user(client: TestClient, test_user_data):
    """Test user registration"""
    response = client.post("/auth/register", json=test_user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == test_user_data["email"]
    assert data["role"] == "patient"
    assert "id" in data

def test_register_duplicate_email(client: TestClient, test_user_data):
    """Test registration with duplicate email"""
    # Register first user
    client.post("/auth/register", json=test_user_data)
    
    # Try to register again with same email
    response = client.post("/auth/register", json=test_user_data)
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]

def test_login_success(client: TestClient, test_user_data):
    """Test successful login"""
    # Register user first
    client.post("/auth/register", json=test_user_data)
    
    # Login
    login_data = {
        "email": test_user_data["email"],
        "password": test_user_data["password"]
    }
    response = client.post("/auth/login", json=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials(client: TestClient):
    """Test login with invalid credentials"""
    login_data = {
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    }
    response = client.post("/auth/login", json=login_data)
    assert response.status_code == 401

def test_get_current_user(client: TestClient, test_user_data):
    """Test getting current user profile"""
    # Register and login
    client.post("/auth/register", json=test_user_data)
    login_response = client.post("/auth/login", json={
        "email": test_user_data["email"],
        "password": test_user_data["password"]
    })
    token = login_response.json()["access_token"]
    
    # Get profile
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user_data["email"]
    assert data["full_name"] == test_user_data["full_name"]

def test_update_user_profile(client: TestClient, test_user_data):
    """Test updating user profile"""
    # Register and login
    client.post("/auth/register", json=test_user_data)
    login_response = client.post("/auth/login", json={
        "email": test_user_data["email"],
        "password": test_user_data["password"]
    })
    token = login_response.json()["access_token"]
    
    # Update profile
    headers = {"Authorization": f"Bearer {token}"}
    update_data = {
        "full_name": "Updated Name",
        "sex": "M"
    }
    response = client.put("/auth/me", json=update_data, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Updated Name"
    assert data["sex"] == "M"