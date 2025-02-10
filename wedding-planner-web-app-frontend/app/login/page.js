"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "./login.css";

export default function Login() {
  const [activeTab, setActiveTab] = useState("user");
  const [isLogin, setIsLogin] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);
  if (!isClient) return null; 

  return (
    <div className="container">
      <div className="auth-box">
       
        <div className="nav-bar">
          {["user", "freelancer"].map((type) => (
            <button
              key={type}
              className={`nav-button ${activeTab === type ? "active" : ""}`}
              onClick={() => setActiveTab(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

      
        <AuthForm userType={activeTab} isLogin={isLogin} />

      
        <div className="toggle-container">
          <button className="toggle-button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Switch to Register" : "Switch to Login"}
          </button>
        </div>
      </div>
    </div>
  );
}


const sendFormData = async (url, data) => {
  try {
    const response = await axios.post(url, data, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });

    return { success: true, userId: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
};


function AuthForm({ userType, isLogin }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "", specialization: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    const url = `http://localhost:8080/api/${userType}/${isLogin ? "login" : "register"}`;
    
 
    const { confirmPassword, ...dataToSend } = formData;
    const response = await sendFormData(url, dataToSend);
    setLoading(false);

    if (response.success) {
      alert(isLogin ? "Login successful!" : "Registration successful!");
      router.push(`/user/${response.userId}`);
    } else {
      handleErrorResponse(response.status, userType);
    }
  };

  const handleOAuth = async (e) => {
    e.preventDefault();
    if (status !== "authenticated") return signIn("google");

    setLoading(true);
    const { email, name } = session.user;
    const response = await sendFormData(`http://localhost:8080/api/${userType}/Oauth`, { email, name });
    setLoading(false);

    if (response.success) {
      router.push(`/user/${response.userId}`);
    } else {
      alert("OAuth Login Failed!");
    }
  };


  const handleErrorResponse = (status, userType) => {
    const userTypeLabel = userType === "user" ? "User" : "Freelancer";

    const messages = {
      404: `${userTypeLabel} not registered!`,
      400: "Invalid credentials",
      409: `${userTypeLabel} already exists!`,
    };

    alert(messages[status] || "Something went wrong. Please try again.");
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>{isLogin ? `${userType} Login` : `${userType} Register`}</h2>
      <input className="input-field" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input className="input-field" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      
      
      {!isLogin && (
        <input className="input-field" type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
      )}

     
      {userType === "freelancer" && !isLogin && (
        <div className="select-container">
          <p>Select Your Specialization:</p>
          <select className="input-field" name="specialization" value={formData.specialization} onChange={handleChange} required>
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

      <button className="submit-button" type="submit" disabled={loading}>
        {loading ? "Processing..." : isLogin ? "Login" : "Register"}
      </button>
      <button onClick={handleOAuth} className="submit-button" disabled={loading}>Sign in with Google</button>
    </form>
  );
}
