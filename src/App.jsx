import { useState, useEffect } from "react";
import API from "./api";


function App(){


const [todos,setTodos]=useState([]);

const [text,setText]=useState("");

const [editId,setEditId]=useState(null);


const [username,setUsername]=useState(localStorage.getItem("username") || ""
);

const [email,setEmail]=useState("");

const [password,setPassword]=useState("");


const [login,setLogin]=useState(
localStorage.getItem("token") ? true:false
);





// SIGNUP

const signup = async()=>{


try{


await API.post(
"/signup",
{
username,
email,
password
}
);


alert("Account Created");


}

catch(err){

alert(
err.response?.data?.detail ||
"Server error"
);

}


};







// LOGIN

const userLogin = async()=>{


try{


const res = await API.post(
"/login",
{
email,
password
}
);


localStorage.setItem(
"token",
res.data.access_token
);
localStorage.setItem(
"username",
res.data.username
);


setLogin(true);


if(login){
 getTodos();
}


}

catch(err){

 alert(
   err.response?.data?.detail 
   || "Server error"
 );

}


};








// GET TODOS


const getTodos = async()=>{


const res = await API.get(
"/todos"
);



const withDate =
res.data.map(todo=>({


...todo,


date:
todo.date ||
new Date()
.toLocaleString()


}));



setTodos(withDate);


};








useEffect(()=>{


if(login){

getTodos();

}


},[login]);










// ADD + UPDATE TODO


const addTodo = async()=>{


if(text.trim()===""){

return;

}



if(editId){



await API.put(
`/todos/${editId}`,
{
title:text
}
);


setEditId(null);


}


else{


await API.post(
"/todos",
{
title:text
}
);


}




setText("");


getTodos();


};










// DELETE


const deleteTodo = async(id)=>{


await API.delete(
`/todos/${id}`
);


getTodos();


};










// DONE


const completeTodo = async(id)=>{


await API.put(
`/todos/${id}/completed`
);


getTodos();


};









// UPDATE


const updateTodo=(todo)=>{


setText(todo.title);


setEditId(todo.id);


};









// LOGOUT


const logout=()=>{


localStorage.removeItem("token");

localStorage.removeItem("username");


setTodos([]);

setLogin(false);


};









// LOGIN PAGE


if(!login){


return(

<div className="header">


<h1 className="title">

Master Your Tasks🔐

</h1>



<input

placeholder="Username"

onChange={
e=>setUsername(e.target.value)
}

/>



<input

placeholder="Email"

onChange={
e=>setEmail(e.target.value)
}

/>



<input

type="password"

placeholder="Password"

onChange={
e=>setPassword(e.target.value)
}

/>



<button
className="add-btn"
onClick={signup}
>

Signup

</button>




<button
className="completed"
onClick={userLogin}
>

Login

</button>



</div>


);


}











// TODO PAGE
// TODO PAGE


const completedCount =
todos.filter(t=>t.completed).length;


const progress =
todos.length===0
?
0
:
Math.round(
(completedCount/todos.length)*100
);



return(


<div className="dashboard">



<div className="topbar">


<div>

<h1>
Hello {username} 👋 
</h1>


<p>
{new Date().toDateString()}
</p>


</div>



<button
className="logout-btn"
onClick={logout}
>

Logout

</button>


</div>







<div className="stats">


<div className="stat-card">

<h2>{todos.length}</h2>

<p>Total</p>

</div>




<div className="stat-card">

<h2>{completedCount}</h2>

<p>Done</p>

</div>




<div className="stat-card">

<h2>
{progress}%
</h2>

<p>Progress</p>

</div>



</div>









<div className="input-row">


<input

value={text}

placeholder="Create new task..."

onChange={
e=>setText(e.target.value)
}

/>


<button
className="add-btn"
onClick={addTodo}
>

{
editId?
"Update":
"+"
}

</button>


</div>








<h2 className="section-title">

Today's Tasks

</h2>





{


todos.map(todo=>(


<div
className="list"
key={todo.id}
>




<div className="todo-content">


<h3

style={{

textDecoration:

todo.completed
?
"line-through"
:
"none"

}}

>


{todo.title}


</h3>



<p className="date">

🕒 {todo.date}

</p>


</div>





<button

className="completed"

onClick={()=>completeTodo(todo.id)}

>

✓

</button>





<button
className="update"
onClick={()=>updateTodo(todo)}

>

✎

</button>





<button

className="delete"

onClick={()=>deleteTodo(todo.id)}

>

✕

</button>



</div>


))


}



</div>


);


}


export default App;


