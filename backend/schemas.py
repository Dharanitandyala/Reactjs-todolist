from pydantic import BaseModel


# Todo input schema

class TodoCreate(BaseModel):

    title: str

class TodoResponse(BaseModel):

    id: int

    title: str

    completed: bool


    class Config:
        from_attributes = True

# Signup input

class UserCreate(BaseModel):

    username: str

    email: str

    password: str



# Login input

class UserLogin(BaseModel):

    email: str

    password: str