from typing import Optional, Tuple
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)
from app.models.activity import Activity
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserResponse


class AuthService:
    @staticmethod
    def register_user(db: Session, request: RegisterRequest) -> Tuple[User, TokenResponse]:
        existing_user = db.query(User).filter(User.email == request.email.lower()).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email address already exists",
            )

        hashed_password = get_password_hash(request.password)
        new_user = User(
            email=request.email.lower(),
            password_hash=hashed_password,
            full_name=request.full_name,
            role="member",
            is_active=True,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Record activity
        activity = Activity(
            user_id=new_user.id,
            action_type="register",
            description=f"User {new_user.full_name} registered an account.",
            action_metadata={"email": new_user.email},
        )
        db.add(activity)
        db.commit()

        access_token = create_access_token(new_user.id)
        refresh_token = create_refresh_token(new_user.id)
        token_response = TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserResponse.model_validate(new_user),
        )
        return new_user, token_response

    @staticmethod
    def authenticate_user(db: Session, request: LoginRequest) -> Tuple[User, TokenResponse]:
        user = db.query(User).filter(User.email == request.email.lower()).first()
        if not user or not verify_password(request.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User account is inactive",
            )

        # Record login activity
        activity = Activity(
            user_id=user.id,
            action_type="login",
            description=f"User {user.full_name} signed in.",
            action_metadata={"email": user.email},
        )
        db.add(activity)
        db.commit()

        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)
        token_response = TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserResponse.model_validate(user),
        )
        return user, token_response

    @staticmethod
    def refresh_access_token(db: Session, refresh_token_str: str) -> TokenResponse:
        payload = decode_token(refresh_token_str)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token",
            )

        user_id = payload.get("sub")
        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive",
            )

        new_access_token = create_access_token(user.id)
        new_refresh_token = create_refresh_token(user.id)
        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            user=UserResponse.model_validate(user),
        )
