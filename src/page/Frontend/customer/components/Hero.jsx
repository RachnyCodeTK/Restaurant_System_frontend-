import React from "react";

const Hero = ({ navigate }) => {
  const handleOrderNow = () => {
    // Scroll to products section
    const productsSection = document.querySelector(".product-grid-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    } else if (navigate) {
      navigate("/shop");
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <div className="hero-text">
          <h1>
            Enjoy <span className="highlight">Healthy</span> and<br />
            Delicious Food
          </h1>
          <p>
            Discover our delicious menu crafted with fresh ingredients.
            From traditional favorites to modern creations, satisfy your cravings.
          </p>
          <button className="cta-btn" onClick={handleOrderNow}>Order Now</button>
        </div>

        <div className="hero-image">
          <div className="pizza-hero">
            <span className="pizza-emoji">🍕</span>
          </div>
          <div className="floating-items">
            <div className="float-item item-1">🍅</div>
            <div className="float-item item-2">🧀</div>
            <div className="float-item item-3">🌶️</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
