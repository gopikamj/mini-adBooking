import React, { useState, useEffect } from "react";
import { getNewspapers } from "../services/api";

function Explore() {
  const [newspapers, setNewspapers] = useState([]);

  useEffect(() => {
    const fetchNewspapers = async () => {
      const data = await getNewspapers();
      if (Array.isArray(data)) {
        setNewspapers(data);
      } else {
        setNewspapers([]);
      }
    };
    fetchNewspapers();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <h1 style={styles.title}>Explore Newspapers</h1>
      {newspapers.length > 0 ? (
        <ul style={styles.list}>
          {newspapers.map((paper) => (
            <li key={paper.id} style={styles.listItem}>
              <span style={styles.paperName}>{paper.name}</span>
              <span style={styles.price}>₹{paper.price_per_word} per word</span>
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.loading}>Loading newspapers...</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundImage: "url('https://cdn.dribbble.com/users/2321513/screenshots/17411847/media/d773265730da159098d1b48b8714df7f.png?resize=1000x750&vertical=center')", // Replace with your image URL
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    fontFamily: "'Arial', sans-serif",
    color: "black", // Change text color for better contrast
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.4)", // White overlay with 70% opacity
    zIndex: 1,
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "40px",
    position: "relative",
    zIndex: 2,
  },
  list: {
    listStyleType: "none",
    padding: 0,
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
  },
  listItem: {
    backgroundColor: "rgba(255, 255, 255, 1)", // Slightly transparent white for list items
    border: "1px solid #dee2e6",
    borderRadius: "8px",
    padding: "25px",
    margin: "20px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
    position: "relative",
    zIndex: 2,
  },
  paperName: {
    fontWeight: "bold",
    color: "#007BFF",
  },
  price: {
    color: "#28a745",
    fontWeight: "bold",
  },
  loading: {
    fontSize: "1.2rem",
    color: "black",
    position: "relative",
    zIndex: 2,
  },
};

export default Explore;