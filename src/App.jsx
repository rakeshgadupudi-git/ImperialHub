import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import SellProduct from './components/SellProduct';
import Hero from './components/Hero';
import ProductCategories from './components/ProductCategories';
import UpcomingSale from './components/UpcomingSale';
import BentoCards from './components/BentoCards';
import About from './pages/About';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Chat from './pages/Chat';
import EditProduct from './pages/EditProduct';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showSell, setShowSell] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleSellClick = () => {
    if (!user) {
      setShowLogin(true);
    } else {
      setShowSell(true);
    }
  };

  return (
    <CartProvider>
      <div className="app">
        <Header user={user} onSellClick={handleSellClick} onLogout={handleLogout} />
        {showLogin && (
          <Login
            onClose={() => setShowLogin(false)}
            onLogin={handleLogin}
          />
        )}
        {showSell && user && (
          <SellProduct
            onClose={() => setShowSell(false)}
            user={user}
          />
        )}
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <ProductCategories />
              <UpcomingSale />
              <BentoCards />
            </>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail user={user} />} />
          <Route path="/cart" element={<Cart user={user} />} />
          <Route path="/chat/:productId/:sellerId" element={<Chat user={user} />} />
          <Route path="/edit-product/:id" element={<EditProduct user={user} />} />
          <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} onSellClick={handleSellClick} />} />
        </Routes>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
