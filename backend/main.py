from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from schemas import UserCreate,UserLogin
from models import User
from auth import hash_password, create_access_token, verify_password
from auth import get_current_user

from database import engine, get_db, Base
import models
import schemas


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
# create tables
models.Base.metadata.create_all(bind=engine)

@app.post("/signup")
def signup(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    try:

        existing_user = db.query(User)\
            .filter(User.email == user.email)\
            .first()


        if existing_user:

            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )


        new_user = User(

            username=user.username,

            email=user.email,

            hashed_password=
            hash_password(user.password)

        )


        db.add(new_user)

        db.commit()

        db.refresh(new_user)


        return {
            "message":"Account created successfully"
        }


    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@app.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = db.query(models.User)\
        .filter(models.User.email == user.email)\
        .first()



    if db_user is None:

        raise HTTPException(
            status_code=404,
            detail="Account not found"
        )



    if not verify_password(
        user.password,
        db_user.hashed_password
    ):

        raise HTTPException(
            status_code=401,
            detail="Incorrect password"
        )



    token=create_access_token(

        {
            "sub":db_user.email
        }

    )



    return {

        "access_token":token,

        "token_type":"bearer",

        "username":db_user.username

    }

@app.post("/todos", response_model=schemas.TodoResponse)
def create_todo(

    todo: schemas.TodoCreate,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    new_todo = models.Todo(

        title = todo.title,


        user_id = current_user.id

    )


    db.add(new_todo)

    db.commit()

    db.refresh(new_todo)


    return new_todo


@app.get("/todos")
def get_todos(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    todos = db.query(models.Todo)\
        .filter(
            models.Todo.user_id 
            == 
            current_user.id
        )\
        .all()


    return todos

@app.delete("/todos/{todo_id}")
def delete_todo(

    todo_id:int,

    db:Session=Depends(get_db),

    current_user = Depends(get_current_user)

):


    todo = db.query(models.Todo)\
        .filter(
            models.Todo.id == todo_id,
            models.Todo.user_id == current_user.id
        )\
        .first()



    if todo is None:

        return {
            "message":"Todo not found"
        }



    db.delete(todo)


    db.commit()



    return {
        "message":"Todo deleted"
    }
@app.put("/todos/{todo_id}")
def update_todo(

    todo_id: int,

    updated_todo: schemas.TodoCreate,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):


    todo = db.query(models.Todo).filter(

        models.Todo.id == todo_id,

        models.Todo.user_id == current_user.id

    ).first()



    if todo is None:

        return {
            "message": "Todo not found"
        }



    todo.title = updated_todo.title



    db.commit()

    db.refresh(todo)



    return todo
@app.put("/todos/{todo_id}/completed")
def complete_todo(

    todo_id:int,

    db:Session = Depends(get_db),

    current_user = Depends(get_current_user)

):



    todo = db.query(models.Todo).filter(

        models.Todo.id == todo_id,

        models.Todo.user_id == current_user.id

    ).first()



    if todo is None:

        return {
            "message":"Todo not found"
        }



    todo.completed = not todo.completed



    db.commit()

    db.refresh(todo)



    return todo
