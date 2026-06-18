from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String)

    email = Column(String, unique=True)

    hashed_password = Column(String)



class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)

    completed = Column(Boolean, default=False)

    # connects todo with user
    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )