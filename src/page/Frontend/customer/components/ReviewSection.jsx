import React from "react";

const ReviewSection = () => {
  const reviews = [
    {
      id: 1,
      name: "John Doe",
      rating: 5,
      comment: "Best pizza I've ever had! Highly recommend.",
      emoji: "👨"
    },
    {
      id: 2,
      name: "Sarah Smith",
      rating: 5,
      comment: "Amazing quality and fast delivery!",
      emoji: "👩"
    },
    {
      id: 3,
      name: "Mike Johnson",
      rating: 4.5,
      comment: "Great food and excellent customer service.",
      emoji: "👨"
    },
  ];

  return (
    <section className="reviews">
      <h2>Customer Reviews</h2>
      <div className="reviews-grid">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <span className="reviewer-emoji">{review.emoji}</span>
              <div>
                <h4>{review.name}</h4>
                <div className="stars">{"⭐".repeat(Math.floor(review.rating))}</div>
              </div>
            </div>
            <p className="review-text">"{review.comment}"</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;
