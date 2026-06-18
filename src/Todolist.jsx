import { useState, useEffect } from "react";
export const Todolist =()=>{
    const [todos,settodos] = useState([])
    const [newTask,setNewTask] = useState("")
    const addTask = async() => {

    const res = await fetch("http://127.0.0.1:8000/todos",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            title:newTask
        })
    })

    const data = await res.json()

    settodos([...todos,data])
    setNewTask("")
}
useEffect(()=>{
    fetch("http://127.0.0.1:8000/todos")
    .then(res=>res.json())
    .then(data=>settodos(data))
},[])
    const deleteTask = async(id) => {

    await fetch(`http://127.0.0.1:8000/todos/${id}`,{
        method:"DELETE"
    })
    settodos(
        todos.filter(todo => todo.id !== id)
    )
}
    const updateTask = async(id) => {

    const updatedtitle = prompt("Enter new task")

    const res = await fetch(`http://127.0.0.1:8000/todos/${id}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            title:updatedtitle
        })
    })

    const data = await res.json()

    settodos(data)
}
  const togglecompleted = async(task) => {

    const res = await fetch(
        `http://127.0.0.1:8000/todos/${task.id}/completed`,
        {
            method:"PUT"
        }
    )


    const updated = await res.json()


    settodos(
        todos.map(todo =>
            todo.id === task.id ? updated : todo
        )
    )
}

  return (
    <div className="header">

      <h1 className="title">Things To Be completed...</h1>

      <div className="input-row">

        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a task..."
        />

        <button
          className="add-btn"
          onClick={addTask}
        >
          +
        </button>

      </div>

      <ul>

        {
          todos.map((task, index) => (

            <li key={task.id} className="list">

              <button
                className="Items"
                style={{
                  backgroundColor: task.completed
                    ? "#43840f"
                    : "#f00707bb",

                  textDecoration: task.completed
                    ? "line-through"
                    : "none",

                  opacity: task.completed ? 0.6 : 1
                }}
              >
                {task.title}
              </button>

              {/* completed BUTTON */}
              {
                !task.completed && (
                  <button
                    className="completed"
                    onClick={() => togglecompleted(task)}
                  >
                    ✓
                  </button>
                )
              }
              <button
                  className="update"
                  onClick={() => updateTask(task.id)}
                >
                Edit
              </button>

              {/* DELETE BUTTON */}
              <button
                className="delete"
                onClick={() => deleteTask(task.id)}
              >
                ✖
              </button>

            </li>

          ))
        }

      </ul>

    </div>
  );
};