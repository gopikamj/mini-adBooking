import React, { useEffect } from "react";
import "./Home.css";

const Home = () => {
  useEffect(() => {
    // Carousel functionality - unchanged
    const handleCarousel = () => {
      const carouselInner = document.querySelector('.carousel-inner');
      const items = document.querySelectorAll('.carousel-item');
      const prevBtn = document.querySelector('.carousel-control.prev');
      const nextBtn = document.querySelector('.carousel-control.next');
      
      if (!carouselInner || !items.length || !prevBtn || !nextBtn) return;
      
      let currentIndex = 0;
      const totalItems = items.length;
      
      const updateCarousel = () => {
        carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
      };
      
      const nextSlide = () => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
      };
      
      const prevSlide = () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
      };
      
      let interval = setInterval(nextSlide, 5000);
      
      prevBtn.addEventListener('click', function() {
        clearInterval(interval);
        prevSlide();
        interval = setInterval(nextSlide, 5000);
      });
      
      nextBtn.addEventListener('click', function() {
        clearInterval(interval);
        nextSlide();
        interval = setInterval(nextSlide, 5000);
      });
      
      const carousel = document.querySelector('.carousel');
      if (carousel) {
        carousel.addEventListener('mouseenter', function() {
          clearInterval(interval);
        });
        
        carousel.addEventListener('mouseleave', function() {
          interval = setInterval(nextSlide, 5000);
        });
      }
      
      updateCarousel();
      
      return () => {
        clearInterval(interval);
      };
    };
    
    handleCarousel();
  }, []);

  return (
    <div className="home-container">
      {/* Background newspaper overlay */}
      <div className="background-overlay"></div>

      <div className="container">
        <header className="hero-section">
          <h1 className="hero-title">Newspaper Ad Booking Platform</h1>
          <p className="hero-subtitle">Streamline your advertising with our comprehensive newspaper ad booking solution</p>
        </header>

        <main className="main-content">
          <section className="features-section">
            <h2 className="section-title">Why Choose Our Platform?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📰</div>
                <h3>Wide Selection</h3>
                <p>Access to hundreds of newspapers across the country</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⏱️</div>
                <h3>Quick Booking</h3>
                <p>Place your ad in just a few clicks</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💰</div>
                <h3>Competitive Pricing</h3>
                <p>Get the best rates for your advertisements</p>
              </div>
            </div>
          </section>

          <section className="carousel-section">
            <h2 className="section-title">Featured Advertisements</h2>
            <p className="section-description">See examples of successful ads placed through our platform</p>
            
            <div className="carousel">
              <div className="carousel-inner">
                <div className="carousel-item">
                  <img src="https://images.all-free-download.com/images/graphiclarge/bunting_burger_advertising_poster_template_contrast_classic_design_6924466.jpg" alt="Ad Example 1" />
                  <div className="carousel-caption">
                    <h3>Blockbuster Sale</h3>
                    <p>Get ready for the biggest release of the year!</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img src="https://c8.alamy.com/comp/2AFH83K/security-guard-job-offer-newspaper-classified-ad-career-opportunity-2AFH83K.jpg" alt="Ad Example 2" />
                  <div className="carousel-caption">
                    <h3>Hiring Securities</h3>
                    <p>Grab your opportunity</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img src="https://newspaperads.ads2publish.com/wp-content/uploads/2019/07/myntra-block-buster-sale-40-to-80-off-ad-delhi-times-19-07-2019-250x391.png" alt="Ad Example 3" />
                  <div className="carousel-caption">
                    <h3>Blockbuster Sale</h3>
                    <p>Get ready for the biggest release of the year!</p>
                  </div>
                </div>
              </div>
              <button className="carousel-control prev">
                &lt;
              </button>
              <button className="carousel-control next">
                &gt;
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;