import React from "react";

const FeaturePromo = ({ navigate }) => {
  const handleOrderNow = () => {
    const productsSection = document.querySelector(".product-grid-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleViewMenu = () => {
    const menuSection = document.querySelector(".menu-board");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="feature-promo">
      <div className="promo-grid">
        <div className="promo-card promo-left">
          <div className="promo-content">
            <h3>Pizza is Our Favorite Food Group</h3>
            <p>Discover the perfect combination of flavors in every bite</p>
            <button className="promo-btn" onClick={handleOrderNow}>Order Now</button>
          </div>
          <div className="promo-image">🍕</div>
        </div>

        <div className="promo-card promo-right">
          <div className="promo-image">👨‍👩‍👧‍👦</div>
          <div className="promo-content">
            <h3>For The Whole Family</h3>
            <p>Perfect meals for everyone at the table</p>
            <button className="promo-btn" onClick={handleViewMenu}>View Menu</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturePromo;
