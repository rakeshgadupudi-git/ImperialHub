import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

export default function Cart({ user }) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    paymentMethod: 'cod'
  });

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to checkout');
      navigate('/shop');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare cart items for checkout
      const checkoutItems = cartItems.map(item => ({
        productId: item._id,
        _id: item._id,
        quantity: item.quantity,
        price: item.price
      }));

      // Process payment based on payment method
      if (checkoutForm.paymentMethod === 'online') {
        // Simulate online payment processing
        const paymentConfirmed = window.confirm(
          `Proceed with online payment of ₹${finalTotal.toLocaleString('en-IN')}?\n\n` +
          `This is a demo. In production, this would redirect to a payment gateway.`
        );
        
        if (!paymentConfirmed) {
          setIsProcessing(false);
          return;
        }
        
        // Simulate payment delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Call checkout endpoint
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyerId: user.id,
          buyerName: checkoutForm.name,
          cartItems: checkoutItems,
          shippingAddress: checkoutForm.address,
          paymentMethod: checkoutForm.paymentMethod,
          totalAmount: finalTotal
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to process checkout');
      }

      // Success!
      alert(`Order placed successfully!\n\nOrder ID: ${data.order.orderId}\nTotal: ₹${finalTotal.toLocaleString('en-IN')}`);
      clearCart();
      setShowCheckout(false);
      navigate('/profile');
    } catch (err) {
      console.error('Error placing order:', err);
      alert(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="empty-cart">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <h2>Your cart is empty</h2>
            <p>Add some products to your cart to get started!</p>
            <Link to="/shop" className="shop-now-btn">Shop Now</Link>
          </div>
        </div>
      </div>
    );
  }

  const total = getCartTotal();
  const deliveryCharge = total > 500 ? 0 : 50;
  const finalTotal = total + deliveryCharge;

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>
        
        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-header">
              <h2>Cart Items ({cartItems.length})</h2>
              <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} />
                  </div>
                  
                  <div className="cart-item-details">
                    <Link to={`/product/${item.slug || item._id}`} className="cart-item-name">
                      {item.name}
                    </Link>
                    {item.brand && <p className="cart-item-brand">Brand: {item.brand}</p>}
                    <p className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="cart-item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    <p className="item-total-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>

                  <button
                    className="remove-item-btn"
                    onClick={() => removeFromCart(item._id)}
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h2>Price Details</h2>
              
              <div className="summary-row">
                <span>Price ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery Charges</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <span className="free-delivery">FREE</span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>

              {total > 500 && (
                <div className="savings-info">
                  <span>You saved ₹50 on delivery!</span>
                </div>
              )}

              <div className="summary-divider"></div>

              <div className="summary-row total-row">
                <span>Total Amount</span>
                <span className="total-amount">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>

              <button className="checkout-btn" onClick={() => setShowCheckout(true)}>
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>

              {!user && (
                <p className="checkout-hint">Please login to proceed with checkout</p>
              )}
            </div>
          </div>
        </div>

        {showCheckout && (
          <div className="checkout-modal-overlay" onClick={() => setShowCheckout(false)}>
            <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
              <div className="checkout-header">
                <h2>Checkout</h2>
                <button className="close-modal-btn" onClick={() => setShowCheckout(false)}>×</button>
              </div>

              <form onSubmit={handleCheckout} className="checkout-form">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={checkoutForm.name}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={checkoutForm.email}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Delivery Address *</label>
                  <textarea
                    value={checkoutForm.address}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Payment Method *</label>
                  <select
                    value={checkoutForm.paymentMethod}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value })}
                    required
                  >
                    <option value="cod">Cash on Delivery</option>
                    <option value="online">Online Payment</option>
                  </select>
                </div>

                <div className="order-summary-checkout">
                  <h3>Order Summary</h3>
                  <div className="order-items-list">
                    {cartItems.map((item) => (
                      <div key={item._id} className="order-item">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-total-checkout">
                    <span>Total: ₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button type="submit" className="place-order-btn" disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

