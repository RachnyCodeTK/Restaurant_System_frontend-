import React from "react";

const PersonalTouch = () => {
  return (
    <section className="personal-touch">
      <div className="touch-header">
        <h2>A Personal Touch</h2>
        <p>Experience food crafted with care and passion</p>
      </div>

      <div className="touch-content">
        <div className="touch-image">
          <div className="pizza-showcase">🍕</div>
        </div>

        <div className="touch-text">
          <p>
            Every pizza we make is prepared with the freshest ingredients and 
            a commitment to excellence. Our chefs bring a personal touch to every 
            order, ensuring your dining experience is unforgettable.
          </p>
          <div className="touch-stats">
            <div className="stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Menu Items</span>
            </div>
            <div className="stat">
              <span className="stat-number">4.8⭐</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalTouch;
