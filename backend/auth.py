from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from database import get_db
from models import User


SECRET_KEY = "mysecretkey"

ALGORITHM = "HS256"


# password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):

    # bcrypt supports max 72 bytes
    password = password[:72]

    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
):

    plain_password = plain_password[:72]

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# JWT token creation
def create_access_token(data: dict):

    user_data = data.copy()

    expire_time = (
        datetime.utcnow()
        +
        timedelta(minutes=30)
    )

    user_data.update(
        {
            "exp": expire_time
        }
    )

    token = jwt.encode(
        user_data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token



oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login"
)



def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")


        if email is None:

            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )


    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )


    user = db.query(User)\
        .filter(
            User.email == email
        )\
        .first()


    if user is None:

        raise HTTPException(
            status_code=401,
            detail="User not found"
        )


    return user