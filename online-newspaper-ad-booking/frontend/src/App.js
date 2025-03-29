// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import AdBooking from "./pages/AdBooking";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AdSummary from "./pages/AdSummary";
import Footer from "./components/Footer";
import Welcome from "./pages/Welcome";
import NewspaperLayout from "./pages/layouts/NewspaperLayout";
import DeccanChroniclesBooking from "./pages/layouts/DeccanChroniclesBooking"; 
import PaymentPage from "./pages/PaymentPage"; // ✅ Import Payment Page
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';

import AdminPayments from './pages/AdminPayments';


function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Pages that include Navbar and Footer */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/book-ad" element={isAuthenticated ? <AdBooking /> : <Navigate to="/login" />} />
                <Route path="/dashboard" element={isAuthenticated ? <UserDashboard /> : <Navigate to="/login" />} />
                <Route path="/ad-summary" element={isAuthenticated ? <AdSummary /> : <Navigate to="/login" />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/payment" element={isAuthenticated ? <PaymentPage /> : <Navigate to="/login" />} /> {/* Payment Page Route */}
                <Route path="/admin/payments" element={
                isAuthenticated ? <><Navbar /><AdminPayments /><Footer /></> : <Navigate to="/login" />
              } />
              </Routes>
              <Footer />
            </>
          }
        />

        {/* Standalone Newspaper Layout Page (Without Navbar & Footer) */}
        <Route path="/newspaper-layout" element={<NewspaperLayout />} />

        {/* Deccan Chronicles Ad Booking Page */}
        <Route path="/deccan-chronicles-booking" element={<DeccanChroniclesBooking />} />
      </Routes>
    </Router>
  );
}

export default App;