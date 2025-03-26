import React, { useState } from "react";
import "./PaymentPage.css";

const PaymentPage = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle form submission
  const handlePayment = async (event) => {
    event.preventDefault();
    setError(null); // Reset error message

    // Validate Inputs (At least one method must be filled)
    const isCardFilled = cardNumber && expiryDate && cvv;
    const isProofUploaded = !!paymentProof;

    if (!isCardFilled && !isProofUploaded) {
      setError("Please provide either card details or upload payment proof.");
      return;
    }

    if (isCardFilled) {
      if (!isValidCardNumber(cardNumber)) {
        setError("Invalid card number. Please enter a valid number.");
        return;
      }
      if (!isValidExpiryDate(expiryDate)) {
        setError("Invalid expiry date. Please enter a valid date (MM/YYYY).");
        return;
      }
      if (!isValidCVV(cvv)) {
        setError("Invalid CVV. Please enter a valid 3 or 4 digit CVV.");
        return;
      }
    }

    setLoading(true);
    const paymentData = {
      cardNumber: isCardFilled ? cardNumber : null,
      expiryDate: isCardFilled ? expiryDate : null,
      cvv: isCardFilled ? cvv : null,
      paymentProof: isProofUploaded ? paymentProof : null,
    };

    try {
      const response = await fakePaymentApi(paymentData);
      if (response.success) {
        setSuccess(true);
        console.log("Payment successful:", response);
      } else {
        setError(response.message || "Payment failed.");
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("An error occurred during payment processing. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // File Upload Handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setPaymentProof(file);
    } else {
      setError("Only image files (e.g., PNG, JPEG) are allowed.");
    }
  };

  // Validation Functions
  const isValidCardNumber = (number) => /^\d{16}$/.test(number);
  const isValidExpiryDate = (date) => /^(0[1-9]|1[0-2])\/\d{4}$/.test(date);
  const isValidCVV = (cvv) => /^\d{3,4}$/.test(cvv);

  // Simulated Payment API Call (Mock)
  const fakePaymentApi = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve({ success: true });
        } else {
          resolve({ success: false, message: "Your payment was declined." });
        }
      }, 2500);
    });
  };

  return (
    <div className="payment-container">
      <h1 className="payment-title">Payment Page</h1>

      {/* Razorpay Logo */}
      <div className="razorpay-logo-container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Razorpay_Logo_2.svg/800px-Razorpay_Logo_2.svg.png"
          alt="Razorpay Logo"
          className="razorpay-logo"
        />
      </div>

      {loading ? (
        <div className="processing-container">
          <div className="loading-spinner"></div>
          <p>Processing your payment...</p>
        </div>
      ) : (
        <form className="payment-form" onSubmit={handlePayment}>
          <p className="form-info">Choose <strong>either</strong> card payment <strong>or</strong> upload proof:</p>

          {/* Card Payment Section */}
          <h2>Option 1: Pay with Card</h2>

          <div className="input-group">
            <label htmlFor="cardNumber">Card Number:</label>
            <input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength="16"
            />
          </div>

          <div className="input-group">
            <label htmlFor="expiryDate">Expiry Date (MM/YYYY):</label>
            <input
              id="expiryDate"
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YYYY"
              maxLength="7"
            />
          </div>

          <div className="input-group">
            <label htmlFor="cvv">CVV:</label>
            <input
              id="cvv"
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              maxLength="4"
            />
          </div>

          <hr />

          {/* Upload Proof Section */}
          <h2>Option 2: Upload Payment Proof</h2>
          <div className="input-group">
            <label htmlFor="paymentProof">Upload Proof:</label>
            <input
              id="paymentProof"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>

          {/* Submit Button */}
          <div className="button-container">
            <button type="submit" className="pay-button">Pay Now</button>
          </div>

          {/* Error & Success Messages */}
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">Payment was successful!</p>}
        </form>
      )}
    </div>
  );
};

export default PaymentPage;
