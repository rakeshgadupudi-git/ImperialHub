import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Imperial Hub</h1>
          <p>Your trusted destination for premium products and exceptional service</p>
        </div>
      </section>

      <section className="about-content">
        <div className="about-container">
          {/* Mission & Vision */}
          <div className="about-intro">
            <div className="intro-card">
              <div className="icon-wrapper">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <h2>Our Mission</h2>
              <p>
                To revolutionize online shopping by providing customers with access to premium quality products 
                at competitive prices, while ensuring exceptional customer service and a seamless shopping experience.
              </p>
            </div>

            <div className="intro-card">
              <div className="icon-wrapper">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h2>Our Vision</h2>
              <p>
                To become India's most trusted and preferred e-commerce platform, known for quality, innovation, 
                and customer-centricity. We envision a future where shopping is effortless, enjoyable, and accessible to all.
              </p>
            </div>
          </div>

          {/* Our Story */}
          <div className="about-section">
            <div className="section-header">
              <h2>Our Story</h2>
              <div className="underline"></div>
            </div>
            <div className="story-content">
              <div className="story-text">
                <p>
                  Imperial Hub was founded with a simple yet powerful vision: to bring premium quality products 
                  directly to your doorstep. What started as a small venture has grown into a trusted platform 
                  serving thousands of satisfied customers across India.
                </p>
                <p>
                  We believe that everyone deserves access to high-quality products, whether it's the latest 
                  electronics, stylish fashion, elegant furniture, or essential home appliances. Our team of 
                  experts carefully curates each product, ensuring it meets our stringent quality standards.
                </p>
                <p>
                  Today, Imperial Hub stands as a testament to our commitment to excellence, innovation, and 
                  customer satisfaction. We continue to expand our product range while maintaining the highest 
                  standards of quality and service.
                </p>
              </div>
              <div className="story-stats">
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Happy Customers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">5K+</div>
                  <div className="stat-label">Products</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Categories</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="about-section">
            <div className="section-header">
              <h2>Why Choose Imperial Hub?</h2>
              <div className="underline"></div>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 7h-4M4 7h4m0 0v13m0-13l-4-4m4 4l4-4M4 7l4 4m12-4l-4 4m4-4v13"></path>
                  </svg>
                </div>
                <h3>Premium Quality</h3>
                <p>We source only the finest products from trusted manufacturers and verified sellers, ensuring every item meets our high standards.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h3>Wide Selection</h3>
                <p>From electronics to fashion, furniture to accessories - explore thousands of products across multiple categories.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                    <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                    <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <h3>Fast & Secure Delivery</h3>
                <p>Quick and reliable shipping with secure packaging. Track your orders in real-time and get updates every step of the way.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <h3>24/7 Customer Support</h3>
                <p>Our dedicated support team is always ready to help. Get assistance with orders, returns, or any questions you may have.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3>Secure Payments</h3>
                <p>Shop with confidence using our secure payment gateway. Multiple payment options including UPI, cards, and cash on delivery.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <h3>Easy Returns</h3>
                <p>Not satisfied? No worries! Our hassle-free return policy ensures you can return products within the specified period.</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="cta-section">
            <div className="cta-content">
              <h2>Ready to Start Shopping?</h2>
              <p>Explore our wide range of premium products and discover amazing deals</p>
              <Link to="/shop" className="cta-button">
                Shop Now
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
