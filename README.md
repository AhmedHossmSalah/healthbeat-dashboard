# HealthBeat Medical Risk Assessment API

A comprehensive FastAPI backend system for medical risk assessment supporting diabetes, hypertension, and heart disease evaluation.

## Features

- **User Authentication**: JWT-based auth with role-based access control (patient/provider/admin)
- **Risk Assessment**: AI-powered risk evaluation for three major diseases
- **Draft System**: Auto-save functionality for incomplete assessments
- **Recommendations**: Personalized medical recommendations based on risk scores
- **Analytics**: Event tracking and usage analytics
- **Admin Dashboard**: User management and system metrics
- **Security**: Password hashing, input validation, audit logging

## Quick Start

### Prerequisites

- Python 3.11+
- SQL Server (or use Docker Compose)
- ODBC Driver 17 for SQL Server

### Local Development

1. **Clone and setup environment**:
```bash
git clone <repository-url>
cd healthbeat-api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Configure environment**:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Setup database**:
```bash
# Option 1: Use Docker Compose (recommended for development)
docker-compose up -d db

# Option 2: Use existing SQL Server
# Make sure SQL Server is running and accessible
```

5. **Run migrations**:
```bash
alembic upgrade head
```

6. **Seed initial data**:
```bash
python scripts/seed_data.py
```

7. **Start the application**:
```bash
uvicorn app.main:app --reload --port 8000
```

8. **Access the API**:
- API Documentation: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc
- Health Check: http://127.0.0.1:8000/health

### Using Docker Compose

```bash
# Start all services (API + SQL Server)
docker-compose up -d

# View logs
docker-compose logs -f web

# Stop services
docker-compose down
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user profile
- `PUT /auth/me` - Update user profile

### Assessment Types
- `GET /assessments` - List available assessment types

### Drafts (Auto-save)
- `POST /drafts/` - Save/update draft
- `GET /drafts/` - Get draft by user/session
- `DELETE /drafts/{id}` - Delete draft

### Submissions
- `POST /submissions/` - Submit assessment for risk calculation
- `GET /submissions/{id}` - Get submission details
- `GET /submissions/` - List user submissions

### Risk Assessments
- `GET /risks/{id}` - Get complete risk assessment with recommendations

### Recommendations
- `GET /recommendations/` - Get user recommendations
- `POST /recommendations/` - Create manual recommendation (provider/admin)

### Analytics
- `POST /analytics/events` - Track user events

### Admin (Admin only)
- `GET /admin/users` - List users with filters
- `GET /admin/assessments` - Get system metrics
- `PUT /admin/users/{id}/status` - Update user status

## Testing

Run the test suite:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py -v
```

## API Testing

Use the provided `requests.http` file with VS Code REST Client extension, or import the collection into Postman.

### Example cURL Commands

```bash
# Register user
curl -X POST "http://127.0.0.1:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"ali@example.com","password":"Pass1234!","full_name":"Ali Ahmed"}'

# Login
curl -X POST "http://127.0.0.1:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"ali@example.com","password":"Pass1234!"}'

# Save draft
curl -X POST "http://127.0.0.1:8000/drafts/" \
  -H "Content-Type: application/json" \
  -d '{"assessment_type_id":"diabetes","session_id":"sess-1","data":{"age":45,"weight":80}}'

# Submit assessment
curl -X POST "http://127.0.0.1:8000/submissions/" \
  -H "Content-Type: application/json" \
  -d '{"assessment_type_id":"diabetes","session_id":"sess-1","data":{"age":45,"fastingGlucose":"110","hba1c":"6.0"}}'
```

## Database Schema

The system uses the following main entities:

- **Users**: Authentication and user management
- **Patient Profiles**: Extended patient information
- **Assessment Types**: Diabetes, Hypertension, Heart Disease
- **Assessment Drafts**: Auto-saved incomplete assessments
- **Survey Submissions**: Completed assessments
- **Risk Assessments**: Calculated risk scores and classifications
- **Disease-specific tables**: Clinical details for each disease type
- **Recommendations**: Personalized medical recommendations

## Security Features

- **Password Security**: bcrypt hashing with salt
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Patient/Provider/Admin roles
- **Input Validation**: Pydantic models with comprehensive validation
- **Audit Logging**: Track all sensitive operations
- **CORS Protection**: Configurable CORS for frontend integration

## Risk Calculation

The system includes a rule-based risk calculation engine as a fallback. In production, this can be replaced with ML model endpoints.

### Supported Diseases

1. **Diabetes**: Based on age, BMI, lab values (glucose, HbA1c), family history, lifestyle
2. **Hypertension**: Based on blood pressure readings, age, lifestyle factors, family history
3. **Heart Disease**: Based on cholesterol levels, age, gender, smoking, family history

## Environment Variables

Key configuration variables (see `.env.example`):

- `DB_SERVER`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Database connection
- `SECRET_KEY`: JWT signing key (must be secure in production)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time
- `FRONTEND_HOST`: CORS allowed origin
- `LOG_LEVEL`: Logging level (DEBUG/INFO/WARNING/ERROR)

## Production Deployment

1. **Database**: Use managed SQL Server (Azure SQL, AWS RDS)
2. **Secrets**: Use environment-specific secret management
3. **Logging**: Configure structured logging with external aggregation
4. **Monitoring**: Add health checks and metrics collection
5. **Security**: Enable HTTPS, configure proper CORS origins
6. **Scaling**: Use container orchestration (Kubernetes, Docker Swarm)

## Default Accounts

After running the seed script:

- **Admin**: admin@example.com / Passw0rd!
- **Test Patient**: ali@example.com / Pass1234!

## Support

For issues and questions:
- Check the API documentation at `/docs`
- Review the test files for usage examples
- Check logs for detailed error information

## License

This project is proprietary software for HealthBeat medical platform.