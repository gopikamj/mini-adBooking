import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminPayments.css';

const AdminPayments = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingBookings = async () => {
      try {
        const response = await api.get('/api/admin/bookings/pending');
        setBookings(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingBookings();
  }, []);

  const handleViewDetails = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };

  const handleApprove = async (bookingId) => {
    try {
      await api.post(`/api/admin/bookings/approve/${bookingId}`);
      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve booking');
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await api.post(`/api/admin/bookings/reject/${bookingId}`);
      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject booking');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-container">
      <h1>Pending Ad Bookings</h1>
      
      {bookings.length === 0 ? (
        <p>No pending bookings to review</p>
      ) : (
        <div className="bookings-grid">
          {bookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.title}</h3>
                <span className="status">Pending</span>
              </div>
              
              <div className="booking-details">
                <p><strong>Newspaper:</strong> {booking.newspaper_name}</p>
                <p><strong>Ad Space:</strong> {booking.ad_space_name}</p>
                <p><strong>User:</strong> {booking.user_name}</p>
                <p><strong>Amount:</strong> ₹{booking.amount}</p>
                <p><strong>Duration:</strong> {booking.duration} days</p>
              </div>
              
              {booking.payment_proof && (
                <div className="payment-proof">
                  <img 
                    src={booking.payment_proof} 
                    alt="Payment proof" 
                    onClick={() => window.open(booking.payment_proof, '_blank')}
                  />
                </div>
              )}
              
              <div className="booking-actions">
                <button 
                  className="view-btn"
                  onClick={() => handleViewDetails(booking.id)}
                >
                  View Details
                </button>
                <button 
                  className="approve-btn"
                  onClick={() => handleApprove(booking.id)}
                >
                  Approve
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => handleReject(booking.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPayments;