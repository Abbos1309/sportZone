"use client"
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import { useState } from "react";
import Rodal from "rodal";
function page() {
 const [login,setLogin]=useState("")
 const [email,setEmail]=useState("")
 const [open,SetOpen]=useState(false)
 
 
 
 
 
 
 
 return (
    <div>
<div>
    <div>GYM SOFt</div>
    <div>
        <button>Registration</button>
        <button onClick={()=>setLogin(true)}>Log In</button>
    </div>
</div>
<div>
    <img src={img.svg}/>
</div>
<div>
    <Rodal
    visible={open}
        onClose={handleClose}
        width={520}
        height={640}
        customStyles={{
          background: "#0b1c29",
          borderRadius: "8px",
          padding: "0",
        }}>
       <input placeholder="Login" onChange={(e)=>setLogin(e.target.value)}/>
       <input placeholder="Password" onChange={(a)=>setEmail(a.target.value)}/>
       <button onClick={handleAdd}>Sign In</button> 
    </Rodal>
</div>
    </div>
  
  )
}

export default page



