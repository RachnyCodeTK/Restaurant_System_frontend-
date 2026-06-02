import React from "react";

const Header = () => {
  return (
    <div className="header">
      <div>
        <h1> Rachny TK 👋</h1>
      </div>

      {/* Search Input */}
      {/* <input 
        type="text" 
        placeholder="Search..." 
        aria-label="Search"
      /> */}

      <div className="header-right">
        <span>Rachny TK</span>
      </div>
    </div>
  );
};

export default Header;