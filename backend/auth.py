from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from database import get_db
from models import User

# secret key used for creating token
SECRET_KEY = "mysecretkey"

ALGORITHM = "HS256"


# password hashing setup
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)



# convert password -> hashed password
def hash_password(password: str):

    return pwd_context.hash(password)




# compare login password with hashed password
def verify_password(
    plain_password,
    hashed_password
):

    return pwd_context.verify(
        plain_password,
        hashed_password
    )




# create JWT token
def create_access_token(data: dict):

    user_data = data.copy()


    expire_time = datetime.utcnow() + timedelta(minutes=30)


    user_data.update(
        {"exp": expire_time}
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
        .filter(User.email == email)\
        .first()


    if user is None:

        raise HTTPException(
            status_code=401,
            detail="User not found"
        )


    return user