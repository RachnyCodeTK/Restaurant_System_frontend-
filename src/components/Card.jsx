import React from "react";

/**
 * Reusable card for dashboard stats
 * props:
 *  - title
 *  - value
 *  - color
 */
const Card = ({ title, value, color }) => {
  return (
    <div className="card" style={{ backgroundColor: color }}>
      <h3>{title}</h3>
      <p className="value">{value}</p>
    </div>
  );
};

export default Card;