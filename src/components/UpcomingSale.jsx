import { Link } from 'react-router-dom';
import './UpcomingSale.css';

export default function UpcomingSale() {
  const saleDate = new Date();
  saleDate.setDate(saleDate.getDate() + 7); // 7 days from now
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <section className="upcoming-sale-section">
      <div className="sale-container">
        <div className="sale-content">
          <div className="sale-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Upcoming Sale</span>
          </div>
          
          <h2 className="sale-title">
            <span className="sale-title-main">MEGA SALE</span>
            <span className="sale-title-sub">Coming Soon</span>
          </h2>
          
          <div className="sale-info">
            <div className="sale-date">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <div className="date-text">
                <span className="date-label">Sale Starts On</span>
                <span className="date-value">{formatDate(saleDate)}</span>
              </div>
            </div>
            
            <div className="sale-offers">
              <div className="offer-item">
                <span className="offer-percent">Upto 70%</span>
                <span className="offer-label">OFF</span>
              </div>
              <div className="offer-divider"></div>
              <div className="offer-item">
                <span className="offer-percent">Free</span>
                <span className="offer-label">Delivery</span>
              </div>
              <div className="offer-divider"></div>
              <div className="offer-item">
                <span className="offer-percent">Extra 10%</span>
                <span className="offer-label">Cashback</span>
              </div>
            </div>
          </div>

          <div className="sale-features">
            <div className="feature-tag">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              All Categories
            </div>
            <div className="feature-tag">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Best Brands
            </div>
            <div className="feature-tag">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Limited Time
            </div>
            <div className="feature-tag">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Early Bird Offers
            </div>
          </div>

          <div className="sale-cta">
            <Link to="/shop" className="notify-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              Notify Me
            </Link>
            <Link to="/shop" className="explore-sale-btn">
              Explore Products
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Link>
          </div>

          <div className="countdown-section">
            <span className="countdown-label">Sale starts in:</span>
            <div className="countdown-timer">
              <div className="countdown-item">
                <span className="countdown-number">07</span>
                <span className="countdown-unit">Days</span>
              </div>
              <span className="countdown-separator">:</span>
              <div className="countdown-item">
                <span className="countdown-number">12</span>
                <span className="countdown-unit">Hours</span>
              </div>
              <span className="countdown-separator">:</span>
              <div className="countdown-item">
                <span className="countdown-number">45</span>
                <span className="countdown-unit">Minutes</span>
              </div>
              <span className="countdown-separator">:</span>
              <div className="countdown-item">
                <span className="countdown-number">30</span>
                <span className="countdown-unit">Seconds</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sale-visual">
          <div className="sale-image-wrapper">
            <div className="floating-product product-1">
              <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop" alt="Product" />
              <div className="product-badge">-50%</div>
            </div>
            <div className="floating-product product-2">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" alt="Product" />
              <div className="product-badge">-60%</div>
            </div>
            <div className="floating-product product-3">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" alt="Product" />
              <div className="product-badge">-40%</div>
            </div>
            <div className="sale-sparkles">
              <div className="sparkle sparkle-1">✨</div>
              <div className="sparkle sparkle-2">✨</div>
              <div className="sparkle sparkle-3">✨</div>
              <div className="sparkle sparkle-4">✨</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

