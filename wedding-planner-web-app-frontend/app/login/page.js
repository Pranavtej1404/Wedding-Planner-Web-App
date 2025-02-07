'use client'
import { useState } from "react";
import axios from "axios";
import "./login.css";

export default function Login() {
  const [activeTab, setActiveTab] = useState("user");
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register

  return (
    <div className="container">
      <div className="auth-box">
        {/* Navbar for User/Freelancer selection */}
        <div className="nav-bar">
          <button
            className={`nav-button ${activeTab === "user" ? "active" : ""}`}
            onClick={() => setActiveTab("user")}
          >
            User
          </button>
          <button
            className={`nav-button ${activeTab === "freelancer" ? "active" : ""}`}
            onClick={() => setActiveTab("freelancer")}
          >
            Freelancer
          </button>
        </div>

        {/* Content Switching for Login/Register */}
        {activeTab === "user" ? <UserForm isLogin={isLogin} /> : <FreelancerForm isLogin={isLogin} />}

        {/* Toggle Button for Login/Register */}
        <div className="toggle-container">
          <button className="toggle-button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Switch to Register" : "Switch to Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Function to send form data using Axios
const sendFormData = async (url, data) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response from backend:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending data:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "An error occurred" };
  }
};

// User Login/Register Form
function UserForm({ isLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userData = { email, password };
    const url = isLogin ? "http://localhost:5000/api/user/login" : "http://localhost:5000/api/user/register";
    
    const response = await sendFormData(url, userData);
    
    if (response.success) {
      alert(isLogin ? "Login successful!" : "Registration successful!");
    } else {
      alert(response.message);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>{isLogin ? "User Login" : "User Register"}</h2>
      <input className="input-field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {!isLogin && (
        <input className="input-field" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      )}
      <button className="submit-button" type="submit">{isLogin ? "Login" : "Register"}</button>
    </form>
  );
}

// Freelancer Login/Register Form
function FreelancerForm({ isLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialization, setSpecialization] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const freelancerData = { email, password, specialization };
    const url = isLogin ? "http://localhost:5000/api/freelancer/login" : "http://localhost:5000/api/freelancer/register";
    
    const response = await sendFormData(url, freelancerData);
    
    if (response.success) {
      alert(isLogin ? "Login successful!" : "Registration successful!");
    } else {
      alert(response.message);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>{isLogin ? "Freelancer Login" : "Freelancer Register"}</h2>
      <input className="input-field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {!isLogin && (
        <input className="input-field" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      )}
      {!isLogin && (
        <div className="select-container">
          <p>Select Your Specialization:</p>
          <select className="input-field" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required>
            <option value="">Select</option>
            <option value="Design & Decor">Design & Decor</option>
            <option value="Photography & Videography">Photography & Videography</option>
            <option value="Beauty & Styling">Beauty & Styling</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Catering & Food Services">Catering & Food Services</option>
            <option value="Logistics & Rentals">Logistics & Rentals</option>
          </select>
        </div>
      )}
      <button className="submit-button" type="submit">{isLogin ? "Login" : "Register"}</button>
    </form>
  );
}
