import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import Card from "../../../components/Card";
import SalesChart from "../../../components/SalesChart";
import OrderChart from "../../../components/OrderChart";
import "../../../style/dashboard.css";

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="container">
      {/* Hamburger Button */}
      <button 
        className={`hamburger ${sidebarOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main">
        <Header />

        {/* Dashboard Cards */}
        <div className="cards">
          <Card
            title="Today's Revenue"
            value="$ 11,256"
            color="#22c55e"
          />
          <Card
            title="Today's Order"
            value="245"
            color="#a855f7"
          />
          <Card
            title="Avg. Expense"
            value="$ 6,556"
            color="#3b82f6"
          />
          <Card
            title="Avg. Revenue"
            value="$ 4,227"
            color="#ef4444"
          />
        </div>

        {/* Charts */}
        <div className="charts">
          <SalesChart />
          <OrderChart />
        </div>

        {/* Trending Orders */}
        <div className="trending">
          <h3>Trending Orders</h3>

          <div className="trend-list">
            <div className="trend-card">
              Chicken Pot Pie <br /> $299
            </div>

            <div className="trend-card">
              Massed Salad <br /> $245
            </div>

            <div className="trend-card">
              Rice Toppings <br /> $225
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;