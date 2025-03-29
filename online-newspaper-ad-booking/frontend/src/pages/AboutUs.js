import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>Newspaper Ad Booking</h1>
        <p className="subtitle">Premium Advertising Solutions</p>
      </header>
      
      <main className="about-content">
        <section className="about-section">
          <h2>Our Expertise</h2>
          <p>
            As the leading digital platform for print advertising, Newspaper Ad Booking 
            specializes in connecting businesses with premium newspaper inventory nationwide. 
            Our proprietary technology simplifies the ad booking process while maximizing 
            campaign effectiveness.
          </p>
        </section>
        
        <section className="value-propositions">
          <h2>Key Advantages</h2>
          <div className="value-grid">
            <div className="value-card">
              <h3>Comprehensive Network</h3>
              <p>Access to 850+ newspapers with verified circulation data</p>
            </div>
            <div className="value-card">
              <h3>Transparent Pricing</h3>
              <p>Competitive rates with no hidden fees</p>
            </div>
            <div className="value-card">
              <h3>Efficient Platform</h3>
              <p>Real-time availability and instant confirmation</p>
            </div>
            <div className="value-card">
              <h3>Performance Analytics</h3>
              <p>Detailed reporting on ad placement and reach</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;