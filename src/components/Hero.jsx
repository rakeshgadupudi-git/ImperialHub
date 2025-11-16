import { useState, useEffect, useRef } from 'react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import './Hero.css';

const PRODUCT_CATEGORIES = [
  { first: 'Modern', second: 'Furniture' },
  { first: 'Luxury', second: 'Electronics' },
  { first: 'Elegant', second: 'Accessories' },
  { first: 'Premium', second: 'Fashion' },
  { first: 'Stylish', second: 'Home' },
  { first: 'Classic', second: 'Sports' },
  { first: 'Designer', second: 'Watches' },
  { first: 'Smart', second: 'Devices' }
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState({ first: '', second: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentCategory = PRODUCT_CATEGORIES[currentIndex];
    const firstWord = currentCategory.first;
    const secondWord = currentCategory.second;
    const totalLength = firstWord.length + secondWord.length;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing mode
        if (charIndex < firstWord.length) {
          // Typing first word
          setDisplayText(prev => ({
            ...prev,
            first: firstWord.substring(0, charIndex + 1)
          }));
          setCharIndex(prev => prev + 1);
        } else if (charIndex < totalLength) {
          // Typing second word
          const secondCharIndex = charIndex - firstWord.length;
          setDisplayText(prev => ({
            ...prev,
            second: secondWord.substring(0, secondCharIndex + 1)
          }));
          setCharIndex(prev => prev + 1);
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), 2500);
        }
      } else {
        // Deleting mode
        if (charIndex > firstWord.length) {
          // Deleting second word
          const secondCharIndex = charIndex - firstWord.length;
          setDisplayText(prev => ({
            ...prev,
            second: secondWord.substring(0, secondCharIndex - 1)
          }));
          setCharIndex(prev => prev - 1);
        } else if (charIndex > 0) {
          // Deleting first word
          setDisplayText(prev => ({
            ...prev,
            first: firstWord.substring(0, charIndex - 1),
            second: ''
          }));
          setCharIndex(prev => prev - 1);
        } else {
          // Finished deleting, move to next category
          setIsDeleting(false);
          setCurrentIndex(prev => (prev + 1) % PRODUCT_CATEGORIES.length);
          setDisplayText({ first: '', second: '' });
          setCharIndex(0);
        }
      }
    }, isDeleting ? 50 : 120); // Faster when deleting

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentIndex]);


  return (
    <section className="hero" id="home">
      <div className="hero-background">
        <img src="/bg.png" alt="Background" className="bg-image" />
      </div>
      
      <div className="hero-content">
        <div className="hero-left">
          <h1 className="hero-title">
            <span className="title-line changing-word">
              <span className="typing-text">
                {displayText.first}
                {displayText.first && !displayText.second && <span className="cursor">|</span>}
              </span>
            </span>
            <span className="title-line changing-word-second">
              <span className="typing-text">
                {displayText.second}
                {displayText.second && <span className="cursor">|</span>}
              </span>
            </span>
          </h1>
          
          <div className="scroll-stack-container">
            <ScrollStack
              className="hero-features"
              itemDistance={80}
              itemScale={0.05}
              itemStackDistance={25}
              stackPosition="20%"
              scaleEndPosition="10%"
              baseScale={0.85}
              rotationAmount={0}
              blurAmount={0.5}
              useWindowScroll={false}
            >
              <ScrollStackItem itemClassName="feature-item feature-item-1">
                <div className="feature-content">
                  <div className="feature-text">
                    <h3>Premium Quality</h3>
                    <p>Curated selection of finest products</p>
                  </div>
                  <div className="feature-icon-box">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                </div>
              </ScrollStackItem>
              <ScrollStackItem itemClassName="feature-item feature-item-2">
                <div className="feature-content">
                  <div className="feature-text">
                    <h3>Fast Delivery</h3>
                    <p>Quick and secure shipping</p>
                  </div>
                  <div className="feature-icon-box">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </div>
                </div>
              </ScrollStackItem>
              <ScrollStackItem itemClassName="feature-item feature-item-3">
                <div className="feature-content">
                  <div className="feature-text">
                    <h3>24/7 Support</h3>
                    <p>Always here to help you</p>
                  </div>
                  <div className="feature-icon-box">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                </div>
              </ScrollStackItem>
              <ScrollStackItem itemClassName="feature-item feature-item-4">
                <div className="feature-content">
                  <div className="feature-text">
                    <h3>Secure Payment</h3>
                    <p>Safe and encrypted transactions</p>
                  </div>
                  <div className="feature-icon-box">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                  </div>
                </div>
              </ScrollStackItem>
              <ScrollStackItem itemClassName="feature-item feature-item-5">
                <div className="feature-content">
                  <div className="feature-text">
                    <h3>Easy Returns</h3>
                    <p>Hassle-free return policy</p>
                  </div>
                  <div className="feature-icon-box">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 12h18M3 6h18M3 18h18"></path>
                    </svg>
                  </div>
                </div>
              </ScrollStackItem>
              <ScrollStackItem itemClassName="feature-item feature-item-6">
                <div className="feature-content">
                  <div className="feature-text">
                    <h3>Best Prices</h3>
                    <p>Competitive pricing guaranteed</p>
                  </div>
                  <div className="feature-icon-box">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                </div>
              </ScrollStackItem>
            </ScrollStack>
          </div>

          <div className="price-tag-section">
            <div className="price-tag">
              <span className="price-line"></span>
              <span className="price-text">Price: $499</span>
              <div className="price-arrow">
                <svg width="70" height="50" viewBox="0 0 70 50" fill="none">
                  <path d="M5 25 L55 25 M50 18 L55 25 L50 32" stroke="#87ceeb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="circular-text-container">
            <svg className="circular-text" viewBox="0 0 250 250">
              <defs>
                <path id="circle-path" d="M 125, 125 m -100, 0 a 100,100 0 1,1 200,0 a 100,100 0 1,1 -200,0" />
              </defs>
              <text fill="#000000" fontSize="11" fontWeight="700" letterSpacing="2">
                <textPath href="#circle-path" startOffset="0%">
                  CREATIVE DESIGN * HOME DECOR * LIGHTING * INTERIOR DESIGN * FURNITURES *
                </textPath>
              </text>
            </svg>
          </div>
          
          <div className="product-description-box">
            <h2 className="description-title">This Product</h2>
            <p className="description-text">
              Change the look of your house is change the perspective of others. 
              Converting a home into a modern living space with premium furniture 
              that combines style and comfort.
            </p>
            <button className="explore-btn">
              EXPLORE SHOP →
            </button>
          </div>
        </div>
      </div>

      {/* Angled Banner Bands - Full Width Below Hero */}
      <div className="banner-bands">
        <div className="banner-bands-container">
          <div className="banner-band banner-band-faded">
            <span className="banner-text">Heart of The Wood * Urban Look * Classical Decor</span>
          </div>
          <div className="banner-band banner-band-prominent">
            <span className="banner-text">Creative Design * Home Decor * Lighting * Interior Design * Furnitures</span>
          </div>
        </div>
      </div>
    </section>
  );
}
