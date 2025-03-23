import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <h1 style={styles.title}>Welcome to Newspaper Ads!</h1>
      <p style={styles.description}>
        Start booking your advertisements today and reach a wider audience!
      </p>
      <Link to="/book-ad" style={styles.button}>
        Book an Ad
      </Link>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    textAlign: "center",
    marginTop: "50px",
    padding: "20px",
    backgroundImage: "url('https://cdn.dribbble.com/users/2321513/screenshots/17411847/media/d773265730da159098d1b48b8714df7f.png?resize=1000x750&vertical=center')", // Replace with your image URL
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh", // Adjust height as needed
    color: "white", // Change text color for better contrast
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the rgba values for opacity
    zIndex: 1,
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    position: "relative",
    zIndex: 2,
  },
  description: {
    fontSize: "1.2rem",
    marginBottom: "30px",
    position: "relative",
    zIndex: 2,
  },
  button: {
    display: "inline-block",
    backgroundColor: "#007BFF",
    color: "white",
    padding: "15px 30px",
    fontSize: "1.2rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textDecoration: "none",
    transition: "background-color 0.3s ease",
    position: "relative",
    zIndex: 2,
  },
};

export default Welcome;