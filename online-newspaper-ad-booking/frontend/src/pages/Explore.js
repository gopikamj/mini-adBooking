import React, { useState, useEffect } from "react";
import { getNewspapers } from "../services/api";
import { FiBook, FiDollarSign } from "react-icons/fi";

function Explore() {
  const [newspapers, setNewspapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewspapers = async () => {
      try {
        setIsLoading(true);
        const data = await getNewspapers();
        setNewspapers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching newspapers:", error);
        setNewspapers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNewspapers();
  }, []);

  // Styles object
  const styles = {
    container: {
      position: "relative",
      minHeight: "100vh",
      padding: "2rem",
      fontFamily: "'Lora', 'Georgia', serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: "url('https://cdn.dribbble.com/users/2321513/screenshots/17411847/media/d773265730da159098d1b48b8714df7f.png?resize=1000x750&vertical=center')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: 0.05,
      zIndex: -1
    },
    content: {
      width: "100%",
      maxWidth: "800px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    title: {
      fontSize: "2.5rem",
      color: "#2c3e50",
      marginBottom: "1rem",
      textAlign: "center",
      fontWeight: 700,
      fontFamily: "'Playfair Display', serif"
    },
    subtitle: {
      fontSize: "1.2rem",
      color: "#34495e",
      textAlign: "center",
      marginBottom: "3rem",
      maxWidth: "700px"
    },
    grid: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
      width: "100%",
      maxWidth: "600px"
    },
    card: {
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      padding: "1.5rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "all 0.3s ease"
    },
    cardHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)"
    },
    cardContent: {
      display: "flex",
      alignItems: "center",
      gap: "1rem"
    },
    cardIcon: {
      fontSize: "1.5rem",
      color: "#f39c12"
    },
    priceInfo: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      color: "#34495e",
      fontSize: "1.1rem"
    },
    priceIcon: {
      color: "#2ecc71"
    },
    loadingState: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "3rem",
      gap: "1rem"
    },
    spinner: {
      width: "3rem",
      height: "3rem",
      border: "4px solid rgba(44, 62, 80, 0.1)",
      borderTopColor: "#2c3e50",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      borderRadius: "8px",
      maxWidth: "600px"
    }
  };

  // Animation for spinner
  const spinKeyframes = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={styles.container}>
      <style>{spinKeyframes}</style>
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        <h1 style={styles.title}>Explore Newspapers</h1>
        <p style={styles.subtitle}>Browse our collection of newspapers for your advertising needs</p>
        
        {isLoading ? (
          <div style={styles.loadingState}>
            <div style={styles.spinner}></div>
            <p>Loading newspapers...</p>
          </div>
        ) : newspapers.length > 0 ? (
          <div style={styles.grid}>
            {newspapers.map((paper) => (
              <div 
                key={paper.id} 
                style={styles.card}
                onMouseEnter={e => e.currentTarget.style.transform = styles.cardHover.transform}
                onMouseLeave={e => e.currentTarget.style.transform = ''}
              >
                <div style={styles.cardContent}>
                  <FiBook style={styles.cardIcon} />
                  <span>{paper.name}</span>
                </div>
                <div style={styles.priceInfo}>
                  <FiDollarSign style={styles.priceIcon} />
                  <span>₹{paper.price_per_word.toLocaleString()} per word</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p>No newspapers available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;