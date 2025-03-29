import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  // State management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [phoneError, setPhoneError] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!/^\d*$/.test(value)) {
        setPhoneError("Phone number must contain only digits.");
        return;
      } else if (value.length > 10) {
        setPhoneError("Phone number cannot exceed 10 digits.");
        return;
      } else {
        setPhoneError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits.");
      return;
    }

    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    alert(data.message);
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    navigate("/login");
  };

  // Styles
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f7fa",
      backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    card: {
      width: "100%",
      maxWidth: "450px",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      padding: "40px",
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    },
    header: {
      textAlign: "center",
      marginBottom: "10px"
    },
    heading: {
      color: "#2b6cb0",
      fontSize: "1.8rem",
      fontWeight: "600",
      marginBottom: "5px"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    label: {
      fontSize: "14px",
      color: "#4a5568",
      fontWeight: "500"
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
    error: {
      color: "#e53e3e",
      fontSize: "12px",
      marginTop: "-5px",
      height: "12px"
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
    footer: {
      textAlign: "center",
      color: "#718096",
      fontSize: "14px",
      marginTop: "20px"
    },
    loginText: {
      textAlign: "center",
      color: "#4a5568",
      fontSize: "14px"
    },
    loginLink: {
      color: "#4299e1",
      fontWeight: "600",
      cursor: "pointer",
      textDecoration: "none"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.heading}>Create Account</h1>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={e => e.target.style = {...styles.input, ...styles.inputFocus}}
              onBlur={e => e.target.style = styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={e => e.target.style = {...styles.input, ...styles.inputFocus}}
              onBlur={e => e.target.style = styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{
                ...styles.input,
                ...(phoneError ? { borderColor: "#e53e3e" } : {})
              }}
              onFocus={e => e.target.style = {
                ...styles.input,
                ...styles.inputFocus,
                borderColor: phoneError ? "#e53e3e" : "#4299e1"
              }}
              onBlur={e => e.target.style = {
                ...styles.input,
                borderColor: phoneError ? "#e53e3e" : "#e2e8f0"
              }}
            />
            <span style={styles.error}>{phoneError || " "}</span>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={e => e.target.style = {...styles.input, ...styles.inputFocus}}
              onBlur={e => e.target.style = styles.input}
            />
          </div>
          
          <button
            type="submit"
            style={styles.button}
          >
            Sign Up
          </button>
        </form>

        <p style={styles.loginText}>
          Already have an account?{' '}
          <span 
            style={styles.loginLink}
            onClick={handleLoginRedirect}
          >
            Log In
          </span>
        </p>
        
        <div style={styles.footer}>
          © 2025 Newspaper Ad Booking
        </div>
      </div>
    </div>
  );
};

export default Signup;