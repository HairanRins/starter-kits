# FastAPI Auth Project

## Common Commands

- `uvicorn app.main:app --reload` - Run dev server
- `pytest` - Run tests
- `pytest -v -k <pattern>` - Run specific tests
- `pip install -e ".[dev]"` - Install with dev dependencies

## Project Structure

- `app/` - Application code
- `tests/` - Test files
- `app/core/` - Core config (config.py, security.py, oauth.py)
- `app/api/` - API routes
- `app/models/` - SQLAlchemy models (user.py)
- `app/schemas/` - Pydantic schemas (user.py)
- `app/db/` - Database setup (database.py)

## Auth Implementation

- Google OAuth2 via `authlib`
- JWT access + refresh token flow
- Access tokens: 30 min (configurable)
- Refresh tokens: 7 days (configurable)
- Tokens store user ID in `sub` claim

## Environment Variables

Copy `.env.example` to `.env` and configure:
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `SECRET_KEY` - JWT secret key
- `DATABASE_URL` - Database connection string

## API Endpoints

- `GET /` - Root
- `GET /health` - Health check
- `GET /api/auth/google/login` - Start Google OAuth flow
- `GET /api/auth/google/callback` - OAuth callback
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user (requires `token` query param)