import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './ProductDetail.css';

export default function ProductDetail({ user }) {
  const { addToCart } = useCart();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ userName: '', rating: 5, comment: '' });
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoForm, setDemoForm] = useState({ advancePayment: '', message: '', preferredDate: '' });
  const [showChart, setShowChart] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const isSeller = user && product && product.seller && (
    product.seller.toString() === user.id || 
    (typeof product.seller === 'object' && product.seller._id && product.seller._id.toString() === user.id)
  );

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if slug is a MongoDB ObjectId (24 hex characters)
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
      
      let response;
      if (isObjectId) {
        // If it's an ObjectId, fetch by ID
        response = await fetch(`/api/products/${slug}`);
      } else {
        // Otherwise, fetch by slug
        response = await fetch(`/api/products/slug/${slug}`);
      }
      
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(0);
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!product || !reviewForm.userName.trim()) return;

    try {
      const response = await fetch(`/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewForm),
      });

      if (response.ok) {
        // Refresh product data to show new review
        fetchProduct();
        setReviewForm({ userName: '', rating: 5, comment: '' });
        alert('Review submitted successfully!');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review');
    }
  };

  const handleRequestDemo = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to request a demo');
      return;
    }
    if (!product || !product.seller) {
      alert('Seller information not available');
      return;
    }

    const sellerId = typeof product.seller === 'object' ? product.seller._id : product.seller;

    try {
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          buyerId: user.id,
          buyerName: user.name,
          sellerId: sellerId,
          advancePayment: parseFloat(demoForm.advancePayment),
          message: demoForm.message
        }),
      });

      if (response.ok) {
        alert('Demo request submitted successfully! The seller will review your request and contact you soon.');
        setShowDemoModal(false);
        setDemoForm({ advancePayment: '', message: '', preferredDate: '' });
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to submit demo request');
      }
    } catch (err) {
      console.error('Error submitting demo request:', err);
      alert('Failed to submit demo request');
    }
  };

  const handleChatClick = () => {
    if (!user) {
      alert('Please login to chat with seller');
      return;
    }
    if (!product || !product.seller) {
      alert('Seller information not available');
      return;
    }
    const sellerId = typeof product.seller === 'object' ? product.seller._id : product.seller;
    navigate(`/chat/${product._id}/${sellerId}`);
  };

  const handleEditClick = () => {
    navigate(`/edit-product/${product._id}`);
  };

  const fetchPurchases = async () => {
    if (!product || !isSeller) return;
    try {
      const response = await fetch(`/api/purchase/product/${product._id}`);
      if (response.ok) {
        const data = await response.json();
        setPurchases(data);
      }
    } catch (err) {
      console.error('Error fetching purchases:', err);
    }
  };

  const fetchAnalytics = async () => {
    if (!user || !isSeller) return;
    try {
      const response = await fetch(`/api/purchase/analytics/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  useEffect(() => {
    if (showChart && isSeller && product) {
      fetchPurchases();
      fetchAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showChart, isSeller]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="product-loading">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="product-error">
          <h2>Product Not Found</h2>
          <p>{error || "The product you're looking for doesn't exist."}</p>
          <Link to="/shop" className="back-to-shop">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>

        <div className="product-detail-content">
          <div className="product-images-section">
            <div className="product-main-image">
              <img 
                src={images[selectedImage] || product.image || 'https://via.placeholder.com/600'} 
                alt={product.name}
              />
              {discountPercent > 0 && (
                <span className="discount-badge-large">{discountPercent}% OFF</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="product-thumbnails">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} view ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-info-section">
            <span className="product-category-badge">{product.category}</span>
            <h1 className="product-title">{product.name}</h1>
            {product.brand && <p className="product-brand-name">Brand: {product.brand}</p>}
            
            {product.condition && (
              <div className="product-condition">
                <strong>Condition:</strong> <span className="condition-badge">{product.condition}</span>
              </div>
            )}
            
            {product.isUserProduct && product.sellerName && (
              <div className="seller-info">
                <strong>Sold by:</strong> {product.sellerName}
              </div>
            )}
            
            <div className="product-rating-section">
              {product.rating > 0 ? (
                <>
                  <div className="rating-stars">
                    {'★'.repeat(Math.floor(product.rating))}
                    {'☆'.repeat(5 - Math.floor(product.rating))}
                  </div>
                  <span className="rating-value">({product.rating.toFixed(1)})</span>
                  <span className="review-count">({product.reviews?.length || 0} reviews)</span>
                </>
              ) : (
                <span className="no-rating">No reviews yet</span>
              )}
            </div>

            <div className="product-price-section">
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="original-price">₹{product.originalPrice.toFixed(2)}</span>
              )}
              <span className="current-price">₹{product.price?.toFixed(2) || '0.00'}</span>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.longDescription || product.description || 'No description available.'}</p>
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="product-specifications">
                <h3>Specifications</h3>
                <ul>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="product-stock-info">
              {product.inStock ? (
                <span className="in-stock">✓ In Stock ({product.stockQuantity || 'Available'})</span>
              ) : (
                <span className="out-of-stock">✗ Out of Stock</span>
              )}
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="product-tags">
                {product.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}

            {/* Primary Actions Section */}
            <div className="primary-actions-section">
              <div className="action-group">
                <h3 className="action-group-title">Purchase Options</h3>
                <div className="product-actions">
                  <button 
                    className="add-to-cart-btn primary-action" 
                    disabled={!product.inStock}
                    onClick={() => {
                      if (product.inStock) {
                        addToCart(product, 1);
                        alert('Product added to cart!');
                      }
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <button className="wishlist-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    Add to Wishlist
                  </button>
                </div>
              </div>

              {/* Dealer/Seller Actions */}
              {product.seller && (
                <div className="action-group">
                  <h3 className="action-group-title">Dealer Options</h3>
                  <div className="dealer-actions">
                    {!isSeller && (
                      <>
                        <button 
                          className="chat-seller-btn dealer-action-btn" 
                          onClick={handleChatClick}
                          title="Chat with the dealer about this product"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          Chat with Dealer
                        </button>
                        <button 
                          className="request-demo-btn dealer-action-btn highlight-btn" 
                          onClick={() => {
                            if (!user) {
                              alert('Please login to request a demo');
                              return;
                            }
                            setShowDemoModal(true);
                          }}
                          title="Request a demo with advance payment"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          Request Demo with Advance Payment
                        </button>
                      </>
                    )}
                    
                    {isSeller && (
                      <>
                        <button className="edit-product-btn dealer-action-btn" onClick={handleEditClick}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Edit Product
                        </button>
                        <button className="view-analytics-btn dealer-action-btn" onClick={() => setShowChart(!showChart)}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="20" x2="18" y2="10"></line>
                            <line x1="12" y1="20" x2="12" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="14"></line>
                          </svg>
                          {showChart ? 'Hide' : 'View'} Analytics
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="product-reviews-section">
          <h2>Customer Reviews</h2>
          
          {product.reviews && product.reviews.length > 0 ? (
            <div className="reviews-list">
              {product.reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <span className="reviewer-name">{review.userName}</span>
                    <div className="review-rating">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && <p className="review-comment">{review.comment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          )}

          <div className="add-review-section">
            <h3>Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={reviewForm.userName}
                  onChange={(e) => setReviewForm({ ...reviewForm, userName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rating</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows="4"
                  placeholder="Share your thoughts about this product..."
                />
              </div>
              <button type="submit" className="submit-review-btn">Submit Review</button>
            </form>
          </div>
        </div>

        {/* Demo Request Modal */}
        {showDemoModal && (
          <div className="modal-overlay" onClick={() => setShowDemoModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Request Demo with Advance Payment</h2>
              <div className="demo-info-box">
                <p><strong>Product:</strong> {product.name}</p>
                <p><strong>Price:</strong> ₹{product.price?.toFixed(2) || '0.00'}</p>
                {product.sellerName && <p><strong>Seller:</strong> {product.sellerName}</p>}
              </div>
              <form onSubmit={handleRequestDemo}>
                <div className="form-group">
                  <label>Advance Payment Amount (₹) *</label>
                  <input
                    type="number"
                    value={demoForm.advancePayment}
                    onChange={(e) => setDemoForm({ ...demoForm, advancePayment: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter advance payment amount"
                  />
                  <small className="form-hint">
                    This is an advance payment to secure your demo request. The seller will confirm the demo schedule.
                  </small>
                </div>
                <div className="form-group">
                  <label>Preferred Demo Date/Time (Optional)</label>
                  <input
                    type="datetime-local"
                    value={demoForm.preferredDate || ''}
                    onChange={(e) => setDemoForm({ ...demoForm, preferredDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Message to Seller (Optional)</label>
                  <textarea
                    value={demoForm.message}
                    onChange={(e) => setDemoForm({ ...demoForm, message: e.target.value })}
                    rows="4"
                    placeholder="Any additional information, questions, or special requirements..."
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowDemoModal(false)}>Cancel</button>
                  <button type="submit" className="submit-demo-btn">Submit Demo Request</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Purchaser Chart/Analytics */}
        {showChart && isSeller && (
          <div className="analytics-section">
            <h2>Product Analytics</h2>
            {analytics && (
              <div className="analytics-summary">
                <div className="stat-card">
                  <h3>Total Purchases</h3>
                  <p className="stat-value">{analytics.totalPurchases}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Revenue</h3>
                  <p className="stat-value">₹{analytics.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            )}
            <div className="purchasers-list">
              <h3>Recent Purchasers</h3>
              {purchases.length > 0 ? (
                <table className="purchasers-table">
                  <thead>
                    <tr>
                      <th>Buyer Name</th>
                      <th>Amount</th>
                      <th>Quantity</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                      {purchases.map((purchase, index) => (
                        <tr key={index}>
                          <td>{purchase.buyerName}</td>
                          <td>₹{purchase.amount.toFixed(2)}</td>
                          <td>{purchase.quantity}</td>
                          <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-purchases">No purchases yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

