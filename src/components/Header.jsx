import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Header.css';

export default function Header({ user, onSellClick, onLogout }) {
  const { getCartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState('India');
  const [language, setLanguage] = useState('ENGLISH');
  const [searchQuery, setSearchQuery] = useState('');
  const location_path = useLocation();
  const isShopPage = location_path.pathname === '/shop';
  const cartCount = getCartCount();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <Link to="/" className="logo">
            <h1>IMPERIAL HUB</h1>
          </Link>
        </div>
        
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/">HOME <span className="arrow">▼</span></Link>
          <Link to="/about">ABOUT <span className="arrow">▼</span></Link>
          <Link to="/shop">SHOP <span className="arrow">▼</span></Link>
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              
              <Link to="/cart" className="action-btn cart-btn" aria-label="Shopping cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span className="cart-count">{cartCount}</span>
              </Link>
              <div className="user-menu">
                <Link to="/profile" className="user-name">{user.name}</Link>
                <button onClick={onLogout} className="logout-btn" title="Logout">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <button className="action-btn" onClick={onSellClick} aria-label="Login">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
              <Link to="/cart" className="action-btn cart-btn" aria-label="Shopping cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span className="cart-count">{cartCount}</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {isShopPage && (
        <div className="shop-header-bar">
          <div className="shop-header-content">
            <div className="location-selector">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <input 
                type="text" 
                value={location} 
                readOnly
                className="location-input"
              />
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder='Search "Products"'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </form>

            <div className="language-selector">
              <span>{language}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            <button className="favorites-btn" aria-label="Favorites">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>

            {!user && (
              <button className="login-link" onClick={onSellClick}>Login</button>
            )}

            <div className="sell-button-wrapper">
              <button className="sell-button-shop" onClick={onSellClick}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>SELL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
