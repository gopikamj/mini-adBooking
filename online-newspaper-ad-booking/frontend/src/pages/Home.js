import React, { useEffect } from "react";
import "./Home.css";

const Home = () => {
  useEffect(() => {
    // Carousel functionality
    const handleCarousel = () => {
      const carouselInner = document.querySelector('.carousel-inner');
      const items = document.querySelectorAll('.carousel-item');
      const prevBtn = document.querySelector('.carousel-control.prev');
      const nextBtn = document.querySelector('.carousel-control.next');
      
      if (!carouselInner || !items.length || !prevBtn || !nextBtn) return;
      
      let currentIndex = 0;
      const totalItems = items.length;
      
      // Initialize carousel
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
      
      // Auto slide
      let interval = setInterval(nextSlide, 5000);
      
      // Event listeners
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
      
      // Pause autoplay on hover
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
      
      // Cleanup function
      return () => {
        clearInterval(interval);
      };
    };
    
    // Run after component mounts
    handleCarousel();
  }, []);

  return (
    <>
      {/* Background newspaper overlay */}
      <div className="background-overlay"></div>

      <div className="container">
        <header>
          <h1 className="title">Welcome to Newspaper Ad Booking</h1>
          <p className="subtitle">Your ultimate destination for placing newspaper ads with ease</p>
          
          <div className="nav-container">
            
          </div>
        </header>

        <main>
          <section className="main-content">
            <h2>Your One-Stop Shop for Newspaper Advertising</h2>
            <p>Book ads in your favorite newspaper easily.</p>

            {/* Carousel */}
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
                    <p>grap your opportunity</p>
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
              <div className="carousel-control prev">
                &lt;
              </div>
              <div className="carousel-control next">
                &gt;
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;