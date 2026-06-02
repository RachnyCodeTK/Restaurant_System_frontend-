import React from "react";

const Features = () => {
  const features = [
    {
      icon: "⚡",
      title: "Fast Delivery & Order",
      description: "Quick and reliable delivery to your doorstep",
    },
    {
    
      icon: "👤",  //icon telegram
      title: "Customer Support 24/7",
      description: "Always here to help with your questions",
      tellegram: "https://t.me/Loutrachny",
    },
    {
      icon: "🎁",
      title: "100% Secure Payment",
      description: "Safe and encrypted payment methods",
    },
  ];

  return (
    <section className="features" id="about">
      <div className="features-container">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            {feature.tellegram && (
              <a href={feature.tellegram} target="_blank" rel="noopener noreferrer" className="telegram-link">Contact Us</a>
            )}
            <p>{feature.description}</p>

          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
