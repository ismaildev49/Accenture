import React, { useState } from 'react';
import {account} from "../../appwrite/config"
import { useNavigate } from 'react-router-dom';




const LoginForm = () => {

    const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const navigate = useNavigate();

 const handleSubmit = (event) => {
  event.preventDefault();

  if (!email || !password) {
    alert("Please fill in all the fields!");
  } else {
    login()
  }
  // Handle form submission logic here
 };
 const login = async () => {
  try {
    var x = await account.createEmailSession(email, password)
    navigate('/dashboard/')
  } catch (error) {
    alert("Wrong email or password")
  }
  
 }



    return <form onSubmit={handleSubmit} className="login">
    <div className="login__field">
        <i className="login__icon fas fa-user"></i>
        <input
         type="email" 
         id='email' 
         value={email} 
         onChange={(e) => setEmail(e.target.value)}
         className="login__input" 
         placeholder="User name / Email"/>
    </div>
    <div className="login__field">
        <i className="login__icon fas fa-lock"></i>
        <input 
        type="password" 
        id='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="login__input" placeholder="Password"/>
    </div>
    <button className="button login__submit">
        <span className="button__text">Log In Now</span>
        <i className="button__icon fas fa-chevron-right"></i>
    </button>				
</form>
}
export default LoginForm