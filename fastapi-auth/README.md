# FastAPI Auth

FastAPI project with Google OAuth authentication.

## Setup

1. Install dependencies:
```bash
pip install -e ".[dev]"
```

2. Copy `.env.example` to `.env` and fill in your Google OAuth credentials

3. Run the server:
```bash
uvicorn app.main:app --reload
```

## Google OAuth Setup

1. Go to Google Cloud Console
2. Create a project and enable Google+ API / Google Identity Services
3. Create OAuth 2.0 credentials
4. Set redirect URI to: `http://localhost:8000/api/auth/google/callback`
5. Add your credentials to `.env`

## API Endpoints

- `GET /` - Root
- `GET /health` - Health check
- `GET /api/auth/google/login` - Start Google OAuth flow
- `GET /api/auth/google/callback` - OAuth callback
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user