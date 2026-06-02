import React, { useState, useEffect } from "react";

const DealOfDay = ({ navigate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 23,
    hours: 15,
    minutes: 10,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleShopNow = () => {
    const productsSection = document.querySelector(".product-grid-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="deal-of-day">
      <div className="deal-container">
        <div className="deal-image">
          <span className="deal-emoji">🍕</span>
        </div>

        <div className="deal-content">
          <h2>Deal of The Day</h2>
          <p className="deal-subtitle">
            Limited time offer on selected items
          </p>

          <div className="deal-timer">
            <div className="timer-item">
              <span className="timer-number">{String(timeLeft.days).padStart(2, "0")}</span>
              <span className="timer-label">Days</span>
            </div>
            <span className="timer-separator">:</span>
            <div className="timer-item">
              <span className="timer-number">{String(timeLeft.hours).padStart(2, "0")}</span>
              <span className="timer-label">Hours</span>
            </div>
            <span className="timer-separator">:</span>
            <div className="timer-item">
              <span className="timer-number">{String(timeLeft.minutes).padStart(2, "0")}</span>
              <span className="timer-label">Minutes</span>
            </div>
            <span className="timer-separator">:</span>
            <div className="timer-item">
              <span className="timer-number">{String(timeLeft.seconds).padStart(2, "0")}</span>
              <span className="timer-label">Seconds</span>
            </div>
          </div>

          <button className="deal-btn" onClick={handleShopNow}>Shop Now</button>
        </div>
      </div>
    </section>
  );
};

export default DealOfDay;
