import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div style={styles.container}>
      <h2>Welcome to Newspaper Ads!</h2>
      <p>Start booking your advertisements today.</p>
      <Link to="/book-ad">
        <button style={styles.button}>Book an Ad</button>
      </Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "10px 20px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textDecoration: "none",
  },
};

export default Welcome;
