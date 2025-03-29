import React, { useState } from "react";

import "./PaymentPage.css";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentPage = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get calculated price from location state or localStorage
  const calculatedPrice = location.state?.price || localStorage.getItem("bookingPrice") || "XX.XX";

  const handlePayment = async (event) => {
    event.preventDefault();
    setError(null);

    const isCardFilled = cardNumber && expiryDate && cvv;
    const isProofUploaded = !!paymentProof;

    if (!isCardFilled && !isProofUploaded) {
      setError("Please provide either card details or upload payment proof.");
      return;
    }

    if (isCardFilled) {
      if (!/^\d{16}$/.test(cardNumber)) {
        setError("Invalid card number. Please enter a valid number.");
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(expiryDate)) {
        setError("Invalid expiry date. Please enter a valid date (MM/YYYY).");
        return;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        setError("Invalid CVV. Please enter a valid 3 or 4 digit CVV.");
        return;
      }
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setPaymentProof(file);
    } else {
      setError("Only image files (e.g., PNG, JPEG) are allowed.");
    }
  };

  if (loading) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <div className="payment-processing">
            <div className="payment-spinner"></div>
            <p className="processing-text">Processing your payment of ₹{calculatedPrice}...</p>
            <p className="processing-note">Please don't close this window</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <div className="payment-success">
            <svg className="success-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h2>Payment Successful!</h2>
            <p>Your payment of ₹{calculatedPrice} has been completed.</p>
            <p>Redirecting to homepage...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <h1 className="payment-title">Payment Amount: ₹{calculatedPrice}</h1>
          <div className="payment-methods">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Razorpay_Logo_2.svg/800px-Razorpay_Logo_2.svg.png" 
              alt="Razorpay" 
              className="payment-logo"
            />
            <div className="secure-badge">
              <svg className="lock-icon" viewBox="0 0 24 24">
                <path d="M12 1C8.676 1 6 3.676 6 7v3H5v11h14V10h-1V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v3H8V7c0-2.276 1.724-4 4-4zm-5 9h10v7H7v-7z"/>
              </svg>
              <span>Secure Payment</span>
            </div>
          </div>
        </div>

        <form className="payment-form" onSubmit={handlePayment}>
          <div className="payment-section">
            <h3 className="section-title">
              <svg className="card-icon" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
              Credit/Debit Card
            </h3>
            
            <div className="input-group">
              <label>Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="1234 5678 9012 3456"
                maxLength="16"
                className="card-input"
              />
              <div className="card-icons">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg" alt="Visa" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg" alt="Mastercard" />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length === 2 && !value.includes('/')) {
                      setExpiryDate(value + '/');
                    } else {
                      setExpiryDate(value);
                    }
                  }}
                  placeholder="MM/YYYY"
                  maxLength="7"
                />
              </div>
              <div className="input-group">
                <label>CVV</label>
                <div className="cvv-input">
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="123"
                    maxLength="4"
                  />
                  <svg className="help-icon" viewBox="0 0 24 24">
                    <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="payment-divider">
            <span>OR</span>
          </div>

          <div className="payment-section">
            <h3 className="section-title">
              <svg className="upload-icon" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Upload Payment Proof
            </h3>
            
            <div className="file-upload">
              <label htmlFor="paymentProof" className="upload-label">
                <svg className="cloud-icon" viewBox="0 0 24 24">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                </svg>
                <span>{paymentProof ? paymentProof.name : 'Choose file'}</span>
                <input
                  id="paymentProof"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </label>
              {paymentProof && (
                <button 
                  type="button" 
                  className="remove-file"
                  onClick={() => setPaymentProof(null)}
                >
                  Remove
                </button>
              )}
            </div>
            <p className="file-note">Supported formats: JPG, PNG (Max 5MB)</p>
          </div>

          <button type="submit" className="submit-button">
            Pay ₹{calculatedPrice}
          </button>

          {error && (
            <div className="error-message">
              <svg className="error-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;