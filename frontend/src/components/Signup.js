import { useState } from "react";
import "../style/Signup.css";
import { useNavigate, Link } from "react-router-dom";

import axios from "axios";
import BASE_URL from "./config";


function Signup() {
  const navigate= useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try{
      const res = await axios.post(`${BASE_URL}/user/signup`, {
        username: formData.username,
        password: formData.password,
      });

      //const token = res.data.token;
      //localStorage.setItem("token",token);
      //localStorage.setItem("username", res.data.username);

      alert("Signup Successful!");  
      //console.log(formData);
      navigate("/");
    }
    catch(err){
      console.log("error:", err.response ? err.response.data : err.message);
      alert("Signup failed!");
    }
  }

  return (
    <>
      <nav className="navbar">
        <h2 className="nav-left">--- TIC TAC TOE ---</h2>

        <Link to="/"><div className="nav-right">
          <button className="nav-btn login-btn">Login</button>
        </div></Link>
      </nav>

      <div className="container">

        <div className="signup-card">

          <h1 className="signup-title">
            Create Account
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

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="signup-btn"
            >
              Sign Up
            </button>

          </form>

        </div>

      </div>
    </>
  );
}

export default Signup;