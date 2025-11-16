import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Shop.css';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    brand: '',
    condition: '',
    minRating: '',
    inStock: '',
    hasDiscount: '',
    isUserProduct: '',
    tags: '',
    search: '',
    sort: 'newest'
  });
  const [total, setTotal] = useState(0);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchFilterOptions();
  }, [filters]);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        const products = data.products || data;
        
        // Extract unique brands
        const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
        setAvailableBrands(brands);
        
        // Extract unique tags
        const tags = [...new Set(products.flatMap(p => p.tags || []))].sort();
        setAvailableTags(tags);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || data);
        setTotal(data.total || data.length);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      condition: '',
      minRating: '',
      inStock: '',
      hasDiscount: '',
      isUserProduct: '',
      tags: '',
      search: '',
      sort: 'newest'
    });
    setSearchParams({});
  };

  const applyPricePreset = (preset) => {
    switch(preset) {
      case 'under50':
        setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '50' }));
        break;
      case '50to100':
        setFilters(prev => ({ ...prev, minPrice: '50', maxPrice: '100' }));
        break;
      case '100to250':
        setFilters(prev => ({ ...prev, minPrice: '100', maxPrice: '250' }));
        break;
      case '250to500':
        setFilters(prev => ({ ...prev, minPrice: '250', maxPrice: '500' }));
        break;
      case 'over500':
        setFilters(prev => ({ ...prev, minPrice: '500', maxPrice: '' }));
        break;
      default:
        break;
    }
  };

  return (
    <div className="shop-page">
      <div className="shop-container">
        <aside className="shop-filters">
          <div className="filters-header">
            <h2>Filters</h2>
            <button onClick={clearFilters} className="clear-filters">Clear All</button>
          </div>

          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Accessories">Accessories</option>
              <option value="Home">Home</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-presets">
              <button type="button" className="price-preset-btn" onClick={() => applyPricePreset('under50')}>
                Under ₹50
              </button>
              <button type="button" className="price-preset-btn" onClick={() => applyPricePreset('50to100')}>
                ₹50 - ₹100
              </button>
              <button type="button" className="price-preset-btn" onClick={() => applyPricePreset('100to250')}>
                ₹100 - ₹250
              </button>
              <button type="button" className="price-preset-btn" onClick={() => applyPricePreset('250to500')}>
                ₹250 - ₹500
              </button>
              <button type="button" className="price-preset-btn" onClick={() => applyPricePreset('over500')}>
                Over ₹500
              </button>
            </div>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min ₹"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="filter-input"
                min="0"
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="filter-input"
                min="0"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Brand</label>
            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="filter-select"
            >
              <option value="">All Brands</option>
              {availableBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Condition</label>
            <select
              value={filters.condition}
              onChange={(e) => handleFilterChange('condition', e.target.value)}
              className="filter-select"
            >
              <option value="">All Conditions</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Minimum Rating</label>
            <select
              value={filters.minRating}
              onChange={(e) => handleFilterChange('minRating', e.target.value)}
              className="filter-select"
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Star</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Tags</label>
            <select
              value={filters.tags}
              onChange={(e) => handleFilterChange('tags', e.target.value)}
              className="filter-select"
            >
              <option value="">All Tags</option>
              {availableTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="rating-low">Lowest Rated</option>
              <option value="name">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="discount">Highest Discount</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.inStock === 'true'}
                onChange={(e) => handleFilterChange('inStock', e.target.checked ? 'true' : '')}
              />
              <span>In Stock Only</span>
            </label>
          </div>

          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.hasDiscount === 'true'}
                onChange={(e) => handleFilterChange('hasDiscount', e.target.checked ? 'true' : '')}
              />
              <span>On Sale / Discounted</span>
            </label>
          </div>

          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.isUserProduct === 'true'}
                onChange={(e) => handleFilterChange('isUserProduct', e.target.checked ? 'true' : '')}
              />
              <span>User Products Only</span>
            </label>
          </div>
        </aside>

        <main className="shop-main">
          <div className="shop-results">
            <p className="results-count">{total} products found</p>
          </div>

          {loading ? (
            <div className="products-loading">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="no-products">No products found matching your criteria.</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product.slug || product._id}`}
                  className="product-card"
                >
                  <div className="product-image-container">
                    <img src={product.image || 'https://via.placeholder.com/400'} alt={product.name} />
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="discount-badge">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                    {!product.inStock && <div className="out-of-stock">Out of Stock</div>}
                  </div>
                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    {product.condition && (
                      <span className="product-condition-small">{product.condition}</span>
                    )}
                    <h3 className="product-name">{product.name}</h3>
                    {product.brand && <p className="product-brand">{product.brand}</p>}
                    {product.isUserProduct && product.sellerName && (
                      <p className="product-seller">Sold by: {product.sellerName}</p>
                    )}
                    <div className="product-rating">
                      {product.rating > 0 && (
                        <>
                          <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
                          <span className="rating-value">({product.rating.toFixed(1)})</span>
                        </>
                      )}
                    </div>
                    <div className="product-price">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="original-price">₹{product.originalPrice.toFixed(2)}</span>
                      )}
                      <span className="current-price">₹{product.price?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

