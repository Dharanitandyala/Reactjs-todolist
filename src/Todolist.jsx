import { useState } from "react";

export const Todolist =()=>{
    const[items,setItems]=useState([])
    const [newItemText, setNewItemText] = useState("");
    const addItem=()=>{
        const newItem={
            id:Date.now(),
            text:newItemText,
            done:false,  
        }
        setItems([...items,newItem]);
        setNewItemText("");
    }
    const removeItem=(id) =>{
        setItems(items.filter((item)=> item.id !== id));
    }
    const toggleDone=(id)=>{
        setItems(
            items.map((item)=>{
                if(item.id===id){
                    return{...item,done:!item.done};
                };
                return item;
            })
        )
    }
    return <div className="header">
       <div>
         <h1 className="title">Things to be done..</h1>
       </div>
        <div className="input-row">
  <input 
    type="text"
    value={newItemText}
    onChange={(e) => setNewItemText(e.target.value)}
    placeholder="Enter a task..."
  />
  <button className="add-btn" onClick={()=> newItemText!=="" ? addItem():alert("Enter a task!")}>+</button>
</div>
        <ul>
            {items.map((item)=>{
                return (<li key={item.id} className="list">
                   <button style={{backgroundColor:item.done?" #43840f" : "#f00707bb" }} className="Items">
                    <span  >
                    {item.text}
                    </span>
                   </button>
                    <button onClick={()=> toggleDone(item.id)} className="done">{item.done ? "Undo" : "✓"}</button>
                <button onClick={()=>removeItem(item.id)} className="delete">✖</button></li>
                );
            })}
        </ul>
    </div>
}