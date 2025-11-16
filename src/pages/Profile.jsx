import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile({ user, onLogout, onSellClick }) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile-info');
  const [userProducts, setUserProducts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [demoRequests, setDemoRequests] = useState([]);
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [sellerStandalonePurchases, setSellerStandalonePurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({
    personalInfo: false,
    email: false,
    mobile: false
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/shop');
      return;
    }
    // Initialize form data from user
    if (user.name) {
      const nameParts = user.name.split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        gender: 'Male',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (activeSection === 'products' || activeSection === 'chats' || activeSection === 'demo-requests' || 
        activeSection === 'buyer-orders' || activeSection === 'seller-orders') {
      fetchUserData();
    }
  }, [activeSection]);

  const fetchUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (activeSection === 'products') {
        const response = await fetch(`/api/products/user/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setUserProducts(data);
        }
      } else if (activeSection === 'chats') {
        const response = await fetch(`/api/chat/conversations/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        }
      } else if (activeSection === 'demo-requests') {
        const response = await fetch(`/api/demo-request/seller/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setDemoRequests(data);
        }
      } else if (activeSection === 'buyer-orders') {
        const response = await fetch(`/api/orders/user/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setBuyerOrders(data);
        }
      } else if (activeSection === 'seller-orders') {
        const response = await fetch(`/api/orders/seller/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setSellerOrders(data.orders || []);
          setSellerStandalonePurchases(data.standalonePurchases || []);
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePersonalInfo = async () => {
    // Here you would typically save to backend
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    setEditMode({ ...editMode, personalInfo: false });
    // Update user object if needed
  };

  const handleSaveEmail = async () => {
    // Here you would typically save to backend
    setEditMode({ ...editMode, email: false });
  };

  const handleSaveMobile = async () => {
    // Here you would typically save to backend
    setEditMode({ ...editMode, mobile: false });
  };

  const handleEditProduct = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleViewProduct = (slug) => {
    navigate(`/product/${slug}`);
  };

  const handleChatClick = (productId, otherUserId) => {
    navigate(`/chat/${productId}/${otherUserId}`);
  };

  const handleDemoRequestStatus = async (requestId, status) => {
    try {
      const response = await fetch(`/api/demo-request/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchUserData();
      }
    } catch (err) {
      console.error('Error updating demo request:', err);
      alert('Failed to update demo request');
    }
  };

  if (!user) {
    return null;
  }

  const nameParts = user.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return (
    <div className="profile-page-flipkart">
      <div className="profile-container-flipkart">
        {/* Left Sidebar */}
        <aside className="profile-sidebar-flipkart">
          <div className="user-greeting">
            <div className="user-avatar-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="greeting-text">
              <span className="hello-text">Hello,</span>
              <span className="user-name-bold">{user.name}</span>
            </div>
          </div>

          <nav className="profile-nav">
            <div className="nav-section">
              <div className="nav-item-main">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                <span>MY ORDERS</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-arrow">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
              <div className="nav-submenu">
                <button
                  className={`nav-subitem ${activeSection === 'buyer-orders' ? 'active' : ''}`}
                  onClick={() => setActiveSection('buyer-orders')}
                >
                  My Orders (Buyer)
                </button>
                <button
                  className={`nav-subitem ${activeSection === 'seller-orders' ? 'active' : ''}`}
                  onClick={() => setActiveSection('seller-orders')}
                >
                  Sales Orders (Seller)
                </button>
              </div>
            </div>

            <div className="nav-section">
              <div className="nav-item-main">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>ACCOUNT SETTINGS</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-arrow">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
              <div className="nav-submenu">
                <button
                  className={`nav-subitem ${activeSection === 'profile-info' ? 'active' : ''}`}
                  onClick={() => setActiveSection('profile-info')}
                >
                  Profile Information
                </button>
                <button
                  className={`nav-subitem ${activeSection === 'addresses' ? 'active' : ''}`}
                  onClick={() => setActiveSection('addresses')}
                >
                  Manage Addresses
                </button>
                <button
                  className={`nav-subitem ${activeSection === 'pan' ? 'active' : ''}`}
                  onClick={() => setActiveSection('pan')}
                >
                  PAN Card Information
                </button>
              </div>
            </div>

            <div className="nav-section">
              <div className="nav-item-main">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                <span>PAYMENTS</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-arrow">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
              <div className="nav-submenu">
                <button
                  className={`nav-subitem ${activeSection === 'gift-cards' ? 'active' : ''}`}
                  onClick={() => setActiveSection('gift-cards')}
                >
                  Gift Cards <span className="gift-balance">₹0</span>
                </button>
                <button
                  className={`nav-subitem ${activeSection === 'upi' ? 'active' : ''}`}
                  onClick={() => setActiveSection('upi')}
                >
                  Saved UPI
                </button>
                <button
                  className={`nav-subitem ${activeSection === 'cards' ? 'active' : ''}`}
                  onClick={() => setActiveSection('cards')}
                >
                  Saved Cards
                </button>
              </div>
            </div>

            <div className="nav-section">
              <div className="nav-item-main">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>MY STUFF</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-arrow">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
              <div className="nav-submenu">
                <button
                  className={`nav-subitem ${activeSection === 'products' ? 'active' : ''}`}
                  onClick={() => setActiveSection('products')}
                >
                  My Products
                </button>
                <button
                  className={`nav-subitem ${activeSection === 'chats' ? 'active' : ''}`}
                  onClick={() => setActiveSection('chats')}
                >
                  Messages
                </button>
                <button
                  className={`nav-subitem ${activeSection === 'demo-requests' ? 'active' : ''}`}
                  onClick={() => setActiveSection('demo-requests')}
                >
                  Demo Requests
                </button>
                <button
                  className={`nav-subitem ${activeSection === 'coupons' ? 'active' : ''}`}
                  onClick={() => setActiveSection('coupons')}
                >
                  My Coupons
                </button>
                <button
                  className={`nav-subitem ${activeSection === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveSection('reviews')}
                >
                  My Reviews & Ratings
                </button>
                <button
                  className={`nav-subitem ${activeSection === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveSection('notifications')}
                >
                  All Notifications
                </button>
                <button
                  className={`nav-subitem ${activeSection === 'wishlist' ? 'active' : ''}`}
                  onClick={() => setActiveSection('wishlist')}
                >
                  My Wishlist
                </button>
              </div>
            </div>

            <div className="nav-section">
              <button className="nav-item-main logout-nav" onClick={onLogout}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Logout</span>
              </button>
            </div>

            <div className="frequently-visited">
              <div className="fv-title">Frequently Visited:</div>
              <button className="fv-link" onClick={() => navigate('/shop')}>Track Order</button>
              <button className="fv-link" onClick={() => navigate('/about')}>Help Center</button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="profile-main-flipkart">
          {activeSection === 'profile-info' && (
            <div className="profile-info-section">
              <div className="section-header-flipkart">
                <h2>Profile Information</h2>
              </div>

              <div className="info-block">
                <div className="info-block-header">
                  <h3>Personal Information</h3>
                  {!editMode.personalInfo && (
                    <button className="edit-link" onClick={() => setEditMode({ ...editMode, personalInfo: true })}>
                      Edit
                    </button>
                  )}
                </div>
                {editMode.personalInfo ? (
                  <div className="edit-form">
                    <div className="name-inputs">
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="First Name"
                        className="name-input"
                      />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Last Name"
                        className="name-input"
                      />
                    </div>
                    <div className="gender-section">
                      <label>Your Gender</label>
                      <div className="gender-options">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={formData.gender === 'Male'}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          />
                          <span>Male</span>
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={formData.gender === 'Female'}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          />
                          <span>Female</span>
                        </label>
                      </div>
                    </div>
                    <div className="form-actions">
                      <button className="save-btn" onClick={handleSavePersonalInfo}>Save</button>
                      <button className="cancel-btn" onClick={() => setEditMode({ ...editMode, personalInfo: false })}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="info-display">
                    <div className="name-display">
                      <div className="name-field">{firstName || 'First Name'}</div>
                      <div className="name-field">{lastName || 'Last Name'}</div>
                    </div>
                    <div className="gender-display">
                      <span className="gender-label">Gender:</span>
                      <span className="gender-value">{formData.gender}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="info-block">
                <div className="info-block-header">
                  <h3>Email Address</h3>
                  {!editMode.email && (
                    <button className="edit-link" onClick={() => setEditMode({ ...editMode, email: true })}>
                      Edit
                    </button>
                  )}
                </div>
                {editMode.email ? (
                  <div className="edit-form">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="email-input"
                    />
                    <div className="form-actions">
                      <button className="save-btn" onClick={handleSaveEmail}>Save</button>
                      <button className="cancel-btn" onClick={() => setEditMode({ ...editMode, email: false })}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="info-display">
                    <div className="email-display">{formData.email || user.email}</div>
                  </div>
                )}
              </div>

              <div className="info-block">
                <div className="info-block-header">
                  <h3>Mobile Number</h3>
                  {!editMode.mobile && (
                    <button className="edit-link" onClick={() => setEditMode({ ...editMode, mobile: true })}>
                      Edit
                    </button>
                  )}
                </div>
                {editMode.mobile ? (
                  <div className="edit-form">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="phone-input"
                      placeholder="+91"
                    />
                    <div className="form-actions">
                      <button className="save-btn" onClick={handleSaveMobile}>Save</button>
                      <button className="cancel-btn" onClick={() => setEditMode({ ...editMode, mobile: false })}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="info-display">
                    <div className="phone-display">{formData.phone || user.phone || '+91'}</div>
                  </div>
                )}
              </div>

              <div className="faqs-section">
                <h3>FAQs</h3>
                <div className="faq-item">
                  <strong>What happens when I update my email address (or mobile number)?</strong>
                  <p>Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).</p>
                </div>
                <div className="faq-item">
                  <strong>When will my Imperial Hub account be updated with the new email address (or mobile number)?</strong>
                  <p>It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.</p>
                </div>
                <div className="faq-item">
                  <strong>What happens to my existing Imperial Hub account when I update my email address (or mobile number)?</strong>
                  <p>Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your Order history, saved addresses and favorite items.</p>
                </div>
                <div className="faq-item">
                  <strong>Does my Seller account get affected when I update my email address?</strong>
                  <p>Imperial Hub has a 'single sign-on' policy. Any changes will reflect in your Seller account also.</p>
                </div>
              </div>

              <div className="account-actions">
                <button className="deactivate-link">Deactivate Account</button>
                <button className="delete-link">Delete Account</button>
              </div>
            </div>
          )}

          {activeSection === 'products' && (
            <div className="products-section-flipkart">
              <div className="section-header-flipkart">
                <h2>My Products</h2>
                <button className="add-product-btn-flipkart" onClick={onSellClick}>
                  + Add New Product
                </button>
              </div>
              {loading ? (
                <div className="loading-state">Loading...</div>
              ) : userProducts.length === 0 ? (
                <div className="empty-state-card">No products yet</div>
              ) : (
                <div className="products-grid-flipkart">
                  {userProducts.map((product) => (
                    <div key={product._id} className="product-card-flipkart">
                      <img src={product.image || 'https://via.placeholder.com/300'} alt={product.name} />
                      <div className="product-info-flipkart">
                        <h3>{product.name}</h3>
                        <p className="product-price-flipkart">₹{product.price?.toLocaleString('en-IN')}</p>
                        <div className="product-actions-flipkart">
                          <button onClick={() => handleEditProduct(product._id)}>Edit</button>
                          <button onClick={() => handleViewProduct(product.slug || product._id)}>View</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'chats' && (
            <div className="chats-section-flipkart">
              <div className="section-header-flipkart">
                <h2>Messages</h2>
              </div>
              {loading ? (
                <div className="loading-state">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="empty-state-card">No messages yet</div>
              ) : (
                <div className="conversations-list-flipkart">
                  {conversations.map((conv, index) => (
                    <div key={index} className="conversation-item-flipkart" onClick={() => handleChatClick(conv.productId, conv._id)}>
                      <div className="conv-avatar">{conv.otherUserName.charAt(0)}</div>
                      <div className="conv-details">
                        <h3>{conv.otherUserName}</h3>
                        <p>{conv.lastMessage}</p>
                      </div>
                      {conv.unreadCount > 0 && <span className="unread-badge">{conv.unreadCount}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'demo-requests' && (
            <div className="demo-requests-section-flipkart">
              <div className="section-header-flipkart">
                <h2>Demo Requests</h2>
              </div>
              {loading ? (
                <div className="loading-state">Loading...</div>
              ) : demoRequests.length === 0 ? (
                <div className="empty-state-card">No demo requests yet</div>
              ) : (
                <div className="demo-requests-grid-flipkart">
                  {demoRequests.map((request) => (
                    <div key={request._id} className="demo-request-card-flipkart">
                      <h3>{request.productId?.name}</h3>
                      <p>Buyer: {request.buyerName}</p>
                      <p>Amount: ₹{request.advancePayment?.toLocaleString('en-IN')}</p>
                      <span className={`status-badge status-${request.status}`}>{request.status}</span>
                      {request.status === 'pending' && (
                        <div className="request-actions">
                          <button onClick={() => handleDemoRequestStatus(request._id, 'approved')}>Approve</button>
                          <button onClick={() => handleDemoRequestStatus(request._id, 'rejected')}>Reject</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Buyer Orders Section */}
          {activeSection === 'buyer-orders' && (
            <div className="orders-section-flipkart">
              <div className="section-header-flipkart">
                <h2>My Orders</h2>
              </div>
              {loading ? (
                <div className="loading-state">Loading...</div>
              ) : buyerOrders.length === 0 ? (
                <div className="empty-state-card">No orders yet</div>
              ) : (
                <div className="orders-list-flipkart">
                  {buyerOrders.map((order) => (
                    <div key={order._id} className="order-card-flipkart">
                      <div className="order-header">
                        <div className="order-info">
                          <h3>Order ID: {order.orderId}</h3>
                          <p className="order-date">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="order-status-badge">
                          <span className={`status-badge status-${order.orderStatus}`}>{order.orderStatus}</span>
                          <span className={`payment-status payment-${order.paymentStatus}`}>{order.paymentStatus}</span>
                        </div>
                      </div>
                      <div className="order-items">
                        {order.purchases && order.purchases.map((purchase) => (
                          <div key={purchase._id} className="order-item">
                            <img 
                              src={purchase.productId?.image || 'https://via.placeholder.com/100'} 
                              alt={purchase.productId?.name} 
                              className="order-item-image"
                            />
                            <div className="order-item-details">
                              <h4>{purchase.productId?.name || 'Product'}</h4>
                              <p>Quantity: {purchase.quantity}</p>
                              <p className="order-item-price">₹{purchase.amount?.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="order-footer">
                        <div className="order-total">
                          <strong>Total: ₹{order.totalAmount?.toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="order-address">
                          <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                          <p><strong>Payment Method:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Seller Orders Section */}
          {activeSection === 'seller-orders' && (
            <div className="orders-section-flipkart">
              <div className="section-header-flipkart">
                <h2>Sales Orders</h2>
              </div>
              {loading ? (
                <div className="loading-state">Loading...</div>
              ) : (sellerOrders.length === 0 && sellerStandalonePurchases.length === 0) ? (
                <div className="empty-state-card">No sales orders yet</div>
              ) : (
                <div className="orders-list-flipkart">
                  {/* Orders grouped by order */}
                  {sellerOrders.map((order) => (
                    <div key={order._id} className="order-card-flipkart">
                      <div className="order-header">
                        <div className="order-info">
                          <h3>Order ID: {order.orderId}</h3>
                          <p className="order-date">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="buyer-info">Buyer: {order.buyerName}</p>
                        </div>
                        <div className="order-status-badge">
                          <span className={`status-badge status-${order.orderStatus}`}>{order.orderStatus}</span>
                          <span className={`payment-status payment-${order.paymentStatus}`}>{order.paymentStatus}</span>
                        </div>
                      </div>
                      <div className="order-items">
                        {order.purchases && order.purchases
                          .filter(purchase => purchase.sellerId?.toString() === user.id)
                          .map((purchase) => (
                            <div key={purchase._id} className="order-item">
                              <img 
                                src={purchase.productId?.image || 'https://via.placeholder.com/100'} 
                                alt={purchase.productId?.name} 
                                className="order-item-image"
                              />
                              <div className="order-item-details">
                                <h4>{purchase.productId?.name || 'Product'}</h4>
                                <p>Quantity: {purchase.quantity}</p>
                                <p className="order-item-price">₹{purchase.amount?.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className="order-footer">
                        <div className="order-total">
                          <strong>Total: ₹{order.totalAmount?.toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="order-address">
                          <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                          <p><strong>Payment Method:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Standalone purchases (not part of an order) */}
                  {sellerStandalonePurchases.map((purchase) => (
                    <div key={purchase._id} className="order-card-flipkart">
                      <div className="order-header">
                        <div className="order-info">
                          <h3>Purchase #{purchase._id.toString().slice(-6)}</h3>
                          <p className="order-date">Placed on: {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                          <p className="buyer-info">Buyer: {purchase.buyerName}</p>
                        </div>
                        <div className="order-status-badge">
                          <span className={`status-badge status-${purchase.status}`}>{purchase.status}</span>
                          <span className={`payment-status payment-${purchase.paymentStatus}`}>{purchase.paymentStatus}</span>
                        </div>
                      </div>
                      <div className="order-items">
                        <div className="order-item">
                          <img 
                            src={purchase.productId?.image || 'https://via.placeholder.com/100'} 
                            alt={purchase.productId?.name} 
                            className="order-item-image"
                          />
                          <div className="order-item-details">
                            <h4>{purchase.productId?.name || 'Product'}</h4>
                            <p>Quantity: {purchase.quantity}</p>
                            <p className="order-item-price">₹{purchase.amount?.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      </div>
                      <div className="order-footer">
                        <div className="order-total">
                          <strong>Total: ₹{purchase.amount?.toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="order-address">
                          <p><strong>Shipping Address:</strong> {purchase.shippingAddress || 'N/A'}</p>
                          <p><strong>Payment Method:</strong> {purchase.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Placeholder sections for other menu items */}
          {(activeSection === 'addresses' || activeSection === 'pan' || activeSection === 'gift-cards' || 
            activeSection === 'upi' || activeSection === 'cards' || activeSection === 'coupons' || 
            activeSection === 'reviews' || activeSection === 'notifications' || activeSection === 'wishlist') && (
            <div className="coming-soon-section">
              <h2>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace(/-/g, ' ')}</h2>
              <p>This section is coming soon!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
