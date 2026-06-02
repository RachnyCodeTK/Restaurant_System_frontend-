import React from "react";

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        <div className="footer-section">
          <h4>About Us</h4>
          <ul>
            <li><a href="#about">About FOODIE</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#press">Press</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#shipping">Shipping Info</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Policy</h4>
          <ul>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms & Conditions</a></li>
            <li><a href="#refund">Refund Policy</a></li>
            <li><a href="#cookies">Cookie Settings</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#facebook">📘 Facebook</a>
            <a href="#twitter">🐦 Twitter</a>
            <a href="#instagram">📷 Instagram</a>
            <a href="#tiktok">🎵 TikTok</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 FOODIE. All rights reserved.</p>
        <p>Crafted with ❤️ for food lovers</p>
      </div>
    </footer>
  );
};

export default Footer;
