import {useState} from "react";
import API from "./api";


function Login(){


const [email,setEmail]=useState("");

const [password,setPassword]=useState("");



const login=async()=>{


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



alert("Login success");


};



return(

<div>

<h2>Login</h2>


<input
placeholder="email"
onChange={(e)=>setEmail(e.target.value)}
/>


<input
placeholder="password"
onChange={(e)=>setPassword(e.target.value)}
/>


<button onClick={login}>
Login
</button>


</div>

);

}


export default Login;