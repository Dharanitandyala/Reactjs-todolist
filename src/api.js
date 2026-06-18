import axios from "axios";


const API = axios.create({

    baseURL:"https://todo-backend-14ae.onrender.com"

});



API.interceptors.request.use(


(config)=>{


const token = localStorage.getItem("token");


console.log("TOKEN SENT:", token);



if(token){


config.headers["Authorization"] = 
`Bearer ${token}`;


}



return config;


},


(error)=>{


return Promise.reject(error);


}


);



export default API;