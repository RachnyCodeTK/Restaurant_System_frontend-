import React, { useState, useEffect } from "react";
import { getProducts } from "../../../../services/api";
import { getImageUrl } from "../../../../utils/imageUtils";

const MenuBoard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await getProducts();
        // Take first 4 products for the menu board
        setMenuItems(response.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching menu items:', error);
        // Fallback to empty array
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) {
    return (
      <section className="menu-board" id="menu">
        <h2>Menu Board</h2>
        <p>Loading menu items...</p>
      </section>
    );
  }

  return (
    <section className="menu-board" id="menu">
      <h2>Menu Board</h2>
      <div className="menu-container">
        {menuItems.map((item, index) => (
          <div key={item.prd_id} className={`menu-item ${index % 2 === 0 ? 'left' : 'right'}`}>
            <div className="menu-emoji">
              {item.photo ? (
                <img src={getImageUrl(item.photo)} alt={item.name} style={{width: '60px', height: '60px', objectFit: 'cover'}} />
              ) : (
                '🍽️'
              )}
            </div>
            <div className="menu-details">
              <h3>{item.name}</h3>
              <p>Delicious food item</p>
              <span className="menu-price">${item.price}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MenuBoard;
