import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';

const PRODUCT_CATEGORIES = [
  { first: 'Design', second: 'Inspiration' },
  { first: 'Home', second: 'Decor' },
  { first: 'Modern', second: 'Living' },
  { first: 'Interior', second: 'Style' },
  { first: 'Creative', second: 'Spaces' },
];

export default function Blog() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState({ first: '', second: '' });
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentCategory = PRODUCT_CATEGORIES[currentIndex];
    const firstWord = currentCategory.first;
    const secondWord = currentCategory.second;
    const totalLength = firstWord.length + secondWord.length;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing mode
        if (charIndex < firstWord.length) {
          setDisplayText(prev => ({
            ...prev,
            first: firstWord.substring(0, charIndex + 1)
          }));
          setCharIndex(prev => prev + 1);
        } else if (charIndex < totalLength) {
          const secondCharIndex = charIndex - firstWord.length;
          setDisplayText(prev => ({
            ...prev,
            second: secondWord.substring(0, secondCharIndex + 1)
          }));
          setCharIndex(prev => prev + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2500);
        }
      } else {
        // Deleting mode
        if (charIndex > firstWord.length) {
          const secondCharIndex = charIndex - firstWord.length;
          setDisplayText(prev => ({
            ...prev,
            second: secondWord.substring(0, secondCharIndex - 1)
          }));
          setCharIndex(prev => prev - 1);
        } else if (charIndex > 0) {
          setDisplayText(prev => ({
            ...prev,
            first: firstWord.substring(0, charIndex - 1),
            second: ''
          }));
          setCharIndex(prev => prev - 1);
        } else {
          setIsDeleting(false);
          setCurrentIndex(prev => (prev + 1) % PRODUCT_CATEGORIES.length);
          setDisplayText({ first: '', second: '' });
          setCharIndex(0);
        }
      }
    }, isDeleting ? 50 : 120);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentIndex]);

  const blogPosts = [
    {
      id: 1,
      title: 'Modern Furniture Trends for 2024',
      excerpt: 'Discover the latest trends in modern furniture design and how to incorporate them into your home.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
      date: 'March 15, 2024',
      category: 'Design',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Creating the Perfect Home Office Space',
      excerpt: 'Transform your workspace with these essential tips for a productive and stylish home office.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
      date: 'March 10, 2024',
      category: 'Interior',
      readTime: '7 min read'
    },
    {
      id: 3,
      title: 'Sustainable Living: Eco-Friendly Furniture Choices',
      excerpt: 'Learn how to make environmentally conscious choices when selecting furniture for your home.',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600',
      date: 'March 5, 2024',
      category: 'Lifestyle',
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'Small Space Solutions: Maximizing Your Living Area',
      excerpt: 'Creative ideas to make the most of limited space without compromising on style or comfort.',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
      date: 'February 28, 2024',
      category: 'Tips',
      readTime: '8 min read'
    },
    {
      id: 5,
      title: 'Color Psychology in Interior Design',
      excerpt: 'Understanding how colors affect mood and atmosphere in your living spaces.',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600',
      date: 'February 20, 2024',
      category: 'Design',
      readTime: '5 min read'
    },
    {
      id: 6,
      title: 'Minimalist Design: Less is More',
      excerpt: 'Explore the principles of minimalist design and how to achieve a clean, uncluttered home.',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
      date: 'February 15, 2024',
      category: 'Style',
      readTime: '6 min read'
    }
  ];

  return (
    <div className="blog-page">
      <section className="blog-hero">
        <div className="blog-hero-content">
          <h1 className="blog-title">
            <span className="blog-title-line changing-word">
              <span className="typing-text">
                {displayText.first}
                {displayText.first && !displayText.second && <span className="cursor">|</span>}
              </span>
            </span>
            <span className="blog-title-line changing-word-second">
              <span className="typing-text">
                {displayText.second}
                {displayText.second && <span className="cursor">|</span>}
              </span>
            </span>
          </h1>
          <p className="blog-subtitle">Insights, Inspiration & Ideas for Your Home</p>
        </div>
      </section>

      <section className="blog-content">
        <div className="blog-container">
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <article key={post.id} className="blog-card">
                <div className="blog-card-image">
                  <img src={post.image} alt={post.title} />
                  <div className="blog-card-overlay">
                    <span className="blog-category">{post.category}</span>
                  </div>
                </div>
                <div className="blog-card-content">
                  <div className="blog-meta">
                    <span className="blog-date">{post.date}</span>
                    <span className="blog-read-time">{post.readTime}</span>
                  </div>
                  <h2 className="blog-card-title">{post.title}</h2>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <Link to={`/blog/${post.id}`} className="blog-read-more">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

