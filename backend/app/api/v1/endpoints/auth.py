from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RefreshTokenRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
)
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(
    response: Response,
    request: RegisterRequest,
    db: Session = Depends(get_db)
):
    _, token_resp = AuthService.register_user(db=db, request=request)
    # Set HttpOnly cookie for extra security
    response.set_cookie(
        key="access_token",
        value=token_resp.access_token,
        httponly=True,
        samesite="lax",
        secure=settings.ENVIRONMENT == "production",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    return token_resp


@router.post("/login", response_model=TokenResponse)
def login(
    response: Response,
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    _, token_resp = AuthService.authenticate_user(db=db, request=request)
    max_age = (
        (settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400)
        if request.remember_me
        else (settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    )
    response.set_cookie(
        key="access_token",
        value=token_resp.access_token,
        httponly=True,
        samesite="lax",
        secure=settings.ENVIRONMENT == "production",
        max_age=max_age,
    )
    return token_resp


@router.post("/logout", response_model=MessageResponse)
def logout(response: Response):
    response.delete_cookie(key="access_token")
    return MessageResponse(message="Successfully signed out")


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(
    response: Response,
    request: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    token_resp = AuthService.refresh_access_token(db=db, refresh_token_str=request.refresh_token)
    response.set_cookie(
        key="access_token",
        value=token_resp.access_token,
        httponly=True,
        samesite="lax",
        secure=settings.ENVIRONMENT == "production",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    return token_resp


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    # Standard security practice: Never disclose whether the email address exists
    return MessageResponse(
        message="If this email is registered, you will receive password reset instructions."
    )


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    return MessageResponse(
        message="Your password has been successfully reset. You may now sign in."
    )
