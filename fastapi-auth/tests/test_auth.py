import pytest
from httpx import AsyncClient, ASGITransport

from app.main import app


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.mark.anyio
async def test_root(client):
    response = await client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "FastAPI Auth API", "status": "running"}


@pytest.mark.anyio
async def test_health(client):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


@pytest.mark.anyio
async def test_google_callback_without_code(client):
    response = await client.get("/api/auth/google/callback")
    assert response.status_code == 422


@pytest.mark.anyio
async def test_get_current_user_no_token(client):
    response = await client.get("/api/auth/me")
    assert response.status_code == 422


@pytest.mark.anyio
async def test_refresh_token_no_token(client):
    response = await client.post("/api/auth/refresh")
    assert response.status_code == 422