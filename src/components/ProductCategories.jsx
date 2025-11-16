import { Link } from 'react-router-dom';
import './ProductCategories.css';

export default function ProductCategories() {
  const categories = [
    {
      name: 'Neckband',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      discount: 'Min. 50% Off',
      link: '/shop?category=Electronics'
    },
    {
      name: 'Trimmers',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      discount: 'Min. 50% Off',
      link: '/shop?category=Accessories'
    },
    {
      name: 'DSLR & Mirrorless',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop',
      discount: 'Min. 30% Off',
      link: '/shop?category=Electronics'
    },
    {
      name: 'Earphones',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop',
      discount: 'Min. 50% Off',
      link: '/shop?category=Electronics'
    }
  ];

  return (
    <section className="product-categories-section">
      <div className="categories-container">
        {/* Left Panel - Product Categories */}
        <div className="categories-panel">
          <div className="categories-header">
            <h2>Best Gadgets & Appliances</h2>
            <Link to="/shop" className="view-all-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Link>
          </div>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link key={index} to={category.link} className="category-card">
                <div className="category-image-wrapper">
                  <img src={category.image} alt={category.name} />
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <span className="discount-badge">{category.discount}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Panel - Promotional Banner */}
        <div className="promo-panel">
          <div className="promo-content">
            <div className="promo-logo">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>Imperial Hub</span>
            </div>
            <h2 className="promo-title">Top Selling Smartphones</h2>
            <p className="promo-subtitle">Latest Technology, Best Brands</p>
            <div className="promo-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop" 
                alt="Smartphones" 
                className="promo-image"
              />
              <Link to="/shop?category=Electronics" className="explore-btn">
                Explore Now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

