from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.security import create_access_token, create_refresh_token, verify_token
from app.core.oauth import google_oauth
from app.models.user import User
from app.schemas.user import Token, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/google/login")
async def google_login():
    state = "google_login"
    url = await google_oauth.get_authorization_url(state)
    return RedirectResponse(url)


@router.get("/google/callback")
async def google_callback(code: str = Query(...), db: Session = Depends(get_db)):
    if not code:
        raise HTTPException(status_code=400, detail="Missing code parameter")

    try:
        token = await google_oauth.get_token(code)
        user_info = await google_oauth.get_user_info(token["access_token"])

        expires_at = None
        if "expires_in" in token:
            expires_at = datetime.utcnow() + timedelta(seconds=token["expires_in"])

        user = google_oauth.get_or_create_user(
            db=db,
            provider="google",
            provider_user_id=user_info["id"],
            email=user_info["email"],
            full_name=user_info.get("name"),
            access_token=token["access_token"],
            refresh_token=token.get("refresh_token"),
            expires_at=expires_at,
        )

        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
            },
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to authenticate: {str(e)}",
        )


@router.post("/refresh", response_model=Token)
def refresh_token(refresh_token: str = Query(...)):
    try:
        user_id = verify_token(refresh_token, token_type="refresh")
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    access_token = create_access_token(user_id)
    new_refresh_token = create_refresh_token(user_id)

    return Token(
        access_token=access_token,
        refresh_token=new_refresh_token,
    )


@router.get("/me", response_model=UserResponse)
def get_current_user(
    token: str = Query(...),
    db: Session = Depends(get_db),
):
    try:
        user_id = verify_token(token, token_type="access")
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user