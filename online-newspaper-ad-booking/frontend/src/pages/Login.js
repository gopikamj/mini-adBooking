import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  // ORIGINAL STATE MANAGEMENT - UNCHANGED
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // ORIGINAL LOGIN HANDLER - UNCHANGED
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      
      alert("Login successful!");
      await fetchUser();
  
      if (data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/welcome");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials. Please try again.");
    }
  };

  // ENHANCED STYLING ONLY
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f7fa",
      backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      padding: "20px"
    },
    card: {
      width: "100%",
      maxWidth: "400px",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      padding: "2rem",
      transition: "all 0.3s ease"
    },
    heading: {
      color: "#2b6cb0",
      fontSize: "1.8rem",
      fontWeight: "600",
      marginBottom: "1.5rem",
      textAlign: "center",
      background: "linear-gradient(90deg, #2b6cb0, #4299e1)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.25rem"
    },
    input: {
      width: "100%",
      padding: "12px 15px",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      fontSize: "16px",
      transition: "all 0.2s ease"
    },
    inputFocus: {
      borderColor: "#4299e1",
      boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.2)",
      outline: "none"
    },
    passwordContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    },
    eyeIcon: {
      position: "absolute",
      right: "15px",
      color: "#718096",
      cursor: "pointer",
      transition: "color 0.2s ease"
    },
    eyeIconHover: {
      color: "#2b6cb0"
    },
    button: {
      width: "100%",
      padding: "14px",
      backgroundColor: "#4299e1",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      marginTop: "10px"
    },
    buttonHover: {
      backgroundColor: "#3182ce",
      transform: "translateY(-1px)"
    }
  };

  return (
    <div style={styles.container}>
      <div 
        style={styles.card}
        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 15px 35px rgba(0, 0, 0, 0.15)"}
        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)"}
      >
        <h2 style={styles.heading}>Login</h2>
        
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            onFocus={e => e.target.style = {...styles.input, ...styles.inputFocus}}
            onBlur={e => e.target.style = styles.input}
          />
          
          <div style={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              onFocus={e => e.target.style = {...styles.input, ...styles.inputFocus}}
              onBlur={e => e.target.style = styles.input}
            />
            <span 
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
              onMouseEnter={e => e.currentTarget.style = {...styles.eyeIcon, ...styles.eyeIconHover}}
              onMouseLeave={e => e.currentTarget.style = styles.eyeIcon}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          
          <button
            type="submit"
            style={styles.button}
            onMouseEnter={e => e.currentTarget.style = {...styles.button, ...styles.buttonHover}}
            onMouseLeave={e => e.currentTarget.style = styles.button}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;