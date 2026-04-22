from typing import Optional
from datetime import datetime

import httpx
from authlib.integrations.starlette_client import OAuth
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.user import User, OAuthAccount
from app.core.security import get_password_hash


class GoogleOAuthService:
    def __init__(self):
        self.client_id = settings.GOOGLE_CLIENT_ID
        self.client_secret = settings.GOOGLE_CLIENT_SECRET
        self.redirect_uri = settings.GOOGLE_REDIRECT_URI

        self.oauth = OAuth()
        self.oauth.register(
            name="google",
            client_id=self.client_id,
            client_secret=self.client_secret,
            server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
            client_kwargs={"scope": "openid email profile"},
        )

    async def get_authorization_url(self, state: str) -> str:
        redirect = await self.oauth.google.authorize_redirect(
            None,
            redirect_uri=self.redirect_uri,
            state=state,
        )
        return redirect.url

    async def get_token(self, code: str) -> dict:
        token = self.oauth.google.fetch_token(
            token_url="https://oauth2.googleapis.com/token",
            code=code,
            client_id=self.client_id,
            client_secret=self.client_secret,
            redirect_uri=self.redirect_uri,
        )
        return token

    async def get_user_info(self, access_token: str) -> dict:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            response.raise_for_status()
            return response.json()

    def get_or_create_user(
        self,
        db: Session,
        provider: str,
        provider_user_id: str,
        email: str,
        full_name: Optional[str] = None,
        access_token: Optional[str] = None,
        refresh_token: Optional[str] = None,
        expires_at: Optional[datetime] = None,
    ) -> User:
        oauth_account = db.query(OAuthAccount).filter(
            OAuthAccount.provider == provider,
            OAuthAccount.provider_user_id == provider_user_id,
        ).first()

        if oauth_account:
            oauth_account.access_token = access_token
            oauth_account.refresh_token = refresh_token
            oauth_account.expires_at = expires_at
            db.commit()
            return oauth_account.user

        user = db.query(User).filter(User.email == email).first()

        if user:
            oauth_account = OAuthAccount(
                user_id=user.id,
                provider=provider,
                provider_user_id=provider_user_id,
                access_token=access_token,
                refresh_token=refresh_token,
                expires_at=expires_at,
            )
            db.add(oauth_account)
        else:
            user = User(
                email=email,
                full_name=full_name,
                is_verified=True,
            )
            db.add(user)
            db.flush()

            oauth_account = OAuthAccount(
                user_id=user.id,
                provider=provider,
                provider_user_id=provider_user_id,
                access_token=access_token,
                refresh_token=refresh_token,
                expires_at=expires_at,
            )
            db.add(oauth_account)

        db.commit()
        db.refresh(user)
        return user


google_oauth = GoogleOAuthService()