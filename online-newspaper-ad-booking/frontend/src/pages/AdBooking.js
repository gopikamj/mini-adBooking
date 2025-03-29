import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNewspapers, getUserData } from "../services/api";

import { FiChevronDown, FiArrowRight } from "react-icons/fi";
import "../styles/BookAd.css"; // Updated import path
const AdBooking = () => {
  const [newspapers, setNewspapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        setAuthChecking(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setAuthError(true);
          setAuthChecking(false);
          return;
        }

        const userData = await getUserData();
        if (userData) {
          setUser(userData);
          setAuthError(false);
          fetchNewspapers();
        } else {
          localStorage.removeItem("token");
          setAuthError(true);
        }
      } catch (error) {
        console.error("Error checking user:", error);
        setAuthError(true);
      } finally {
        setAuthChecking(false);
      }
    };

    checkUser();
  }, []);

  const fetchNewspapers = async () => {
    try {
      setLoading(true);
      const data = await getNewspapers();
      setNewspapers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching newspapers:", error);
      setNewspapers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewspaperChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedNewspaper = newspapers.find((paper) => paper.id === selectedId);
    if (selectedNewspaper) {
      navigate(`/newspaper-layout?name=${encodeURIComponent(selectedNewspaper.name)}`);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  // Single return statement for all states
  return (
    <div className="ad-booking-page">
      <div className="ad-booking-card">
        {authChecking ? (
          <div className="auth-loading">
            <div className="spinner"></div>
            <p>Verifying your account...</p>
          </div>
        ) : authError || !user ? (
          <div className="auth-error">
            <h2>{authError ? "Authentication Issue" : "Authentication Required"}</h2>
            <p>
              {authError
                ? "There was a problem verifying your login. Please try logging in again."
                : "You need to be logged in to book an ad."}
            </p>
            <button className="auth-button" onClick={handleLoginRedirect}>
              Go to Login <FiArrowRight />
            </button>
          </div>
        ) : (
          <>
            <h2>Book Your Advertisement</h2>
            <p className="welcome-message">
              Welcome back, <span>{user.name}</span>! Select a newspaper to begin.
            </p>

            <div className="form-container">
              <div className="form-group">
                <label>Select Newspaper</label>
                <div className="select-wrapper">
                  <select
                    onChange={handleNewspaperChange}
                    disabled={loading || newspapers.length === 0}
                  >
                    <option value="">{loading ? "Loading newspapers..." : "Choose a newspaper"}</option>
                    {newspapers.map((paper) => (
                      <option key={paper.id} value={paper.id}>
                        {paper.name} - ₹{paper.price_per_word.toLocaleString()}/word
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="select-icon" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdBooking;