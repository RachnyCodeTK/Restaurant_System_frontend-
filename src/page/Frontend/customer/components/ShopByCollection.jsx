import React, { useState, useEffect } from "react";
import { getCategories } from "../../../../services/api";

const ShopByCollection = ({ onCategorySelect, selectedCategory }) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleScroll = (direction) => {
    const newOffset = direction === 'next' ? scrollOffset + 150 : scrollOffset - 150;
    if (newOffset >= 0 && newOffset <= categories.length * 150) {
      setScrollOffset(newOffset);
    }
  };

  const handleShopByCategory = (categoryId) => {
    onCategorySelect(categoryId);
    // Scroll to products section
    const productsSection = document.querySelector(".product-grid-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const colors = ["#FF6B35", "#F7931E", "#90BE6D", "#E63946", "#FDB833", "#4A90E2", "#9B59B6", "#1ABC9C"];

  if (loading) {
    return (
      <section className="shop-by-collection" id="menu">
        <div className="section-header">
          <h2>Shop by Collection</h2>
          <p>Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="shop-by-collection" id="menu">
      <div className="section-header">
        <h2>Shop by Collection</h2>
        <div className="header-control">
          <button className="nav-btn prev-btn" onClick={() => handleScroll('prev')}>←</button>
          <button className="nav-btn next-btn" onClick={() => handleScroll('next')}>→</button>
        </div>
      </div>

      <div className="collection-grid" style={{ transform: `translateX(-${scrollOffset}px)`, transition: 'transform 0.3s ease' }}>
        {categories.map((category, index) => (
          <div 
            key={category.cat_id} 
            className={`collection-card ${selectedCategory === category.cat_id ? 'active' : ''}`}
            style={{ borderColor: colors[index % colors.length] }}
          >
            <div className="collection-emoji">🍽️</div>
            <h4>{category.cat_name}</h4>
            <button 
              className="shop-btn"
              onClick={() => handleShopByCategory(category.cat_id)}
            >
              Shop Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopByCollection;
