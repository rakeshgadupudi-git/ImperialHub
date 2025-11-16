import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Chat.css';

export default function Chat({ user }) {
  const { productId, sellerId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [product, setProduct] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      alert('Please login to chat');
      navigate('/shop');
      return;
    }
    fetchProduct();
    fetchMessages();
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [productId, sellerId, user]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        // Determine other user (seller or buyer)
        if (user.id === sellerId) {
          // We're the seller, other user is buyer (we'll get this from messages)
        } else {
          // We're the buyer, other user is seller
          setOtherUser({ id: sellerId, name: data.sellerName || 'Seller' });
        }
      }
    } catch (err) {
      console.error('Error fetching product:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/${productId}/${user.id}/${sellerId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        // Determine other user from messages if we're seller
        if (user.id === sellerId && data.length > 0) {
          const firstMessage = data[0];
          const otherUserId = firstMessage.senderId === user.id ? firstMessage.receiverId : firstMessage.senderId;
          const otherUserName = firstMessage.senderId === user.id ? firstMessage.receiverName : firstMessage.senderName;
          setOtherUser({ id: otherUserId, name: otherUserName });
        }
        scrollToBottom();
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !otherUser) return;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          senderId: user.id,
          senderName: user.name,
          receiverId: otherUser.id,
          receiverName: otherUser.name,
          message: newMessage.trim()
        }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!user) {
    return null;
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
          <div className="chat-header-info">
            {product && <h2>{product.name}</h2>}
            {otherUser && <p>Chatting with: {otherUser.name}</p>}
          </div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="no-messages">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.senderId === user.id ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  <div className="message-sender">{msg.senderName}</div>
                  <div className="message-text">{msg.message}</div>
                  <div className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={sendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
          />
          <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

