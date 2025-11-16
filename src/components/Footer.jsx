import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Imperial Hub</h3>
          <p className="footer-description">
            Your premier destination for modern furniture and premium products. 
            We bring style and comfort to your home.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">Facebook</a>
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="Twitter">Twitter</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Categories</h4>
          <ul className="footer-links">
            <li><Link to="/shop?category=Electronics">Electronics</Link></li>
            <li><Link to="/shop?category=Fashion">Fashion</Link></li>
            <li><Link to="/shop?category=Accessories">Accessories</Link></li>
            <li><Link to="/shop?category=Home">Home</Link></li>
            <li><Link to="/shop?category=Sports">Sports</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Contact Info</h4>
          <ul className="footer-contact">
            <li>Email: info@imperialhub.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Design Street, City, State 12345</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Imperial Hub. All rights reserved.</p>
      </div>
    </footer>
  );
}

