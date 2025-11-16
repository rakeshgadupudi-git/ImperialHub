import { useState, useEffect } from 'react';
import './BentoCards.css';

export default function BentoCards() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      // Handle both array and wrapped response formats
      const products = Array.isArray(data) ? data : (data.value || data.products || []);
      setProducts(products.slice(0, 12));
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="products-section" id="products">
        <div className="products-container">
          <h2 className="section-title">Our Products</h2>
          <div className="products-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="product-card skeleton" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="products-section" id="products">
      <div className="products-container">
        <h2 className="section-title">Our Products</h2>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image-container">
                <img 
                  src={product.image || 'https://via.placeholder.com/400'} 
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-overlay">
                  <button className="product-btn">View Details</button>
                </div>
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₹{product.price?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
