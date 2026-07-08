import { useState } from "react";
import "../style/Login.css";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import BASE_URL from "./config";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e)
  {
        e.preventDefault();

        try
        {
          const res = await axios.post(`${BASE_URL}/user/login`, {
            username: formData.username,
            password: formData.password,
          });
    
          const token = res.data.token;
          localStorage.setItem("token",token);
          localStorage.setItem("username", res.data.user.username);
          localStorage.setItem("userId", res.data.user.id);
          
          alert("Login Successful!!");  
          console.log(formData);
          navigate("/home");
        }
        catch(err){
          console.log("error:", err.response ? err.response.data : err.message);
          alert("Login failed!");
        }
    }

  return (
    <>
      <nav className="navbar">
        <h2 className="nav-left">--- TIC TAC TOE ---</h2>

        <Link to='/signup'><div className="nav-right">
          <button className="nav-btn signup-btn">Signup</button>
        </div></Link>
      </nav>

      <div className="container">

        <div className="login-card">

          <h1 className="login-title">
            Login to your account
          </h1>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="login-btn">
              login
            </button>

          </form>

        </div>

      </div>
    </>
  );
}

export default Login;