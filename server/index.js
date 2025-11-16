import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI 

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
});

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  longDescription: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  images: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Fashion', 'Accessories', 'Home', 'Sports', 'Other']
  },
  brand: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor'],
    default: 'New'
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  sellerName: {
    type: String,
    default: ''
  },
  sellerContact: {
    type: String,
    default: ''
  },
  isUserProduct: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [reviewSchema],
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  tags: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Chat Message Schema
const chatMessageSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Demo Request Schema
const demoRequestSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyerName: {
    type: String,
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  advancePayment: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  message: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Purchase Schema
const purchaseSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyerName: {
    type: String,
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online'],
    default: 'cod'
  },
  shippingAddress: {
    type: String,
    default: ''
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  }
});

// Order Schema (for grouping multiple purchases)
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyerName: {
    type: String,
    required: true
  },
  purchases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase'
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online'],
    default: 'cod'
  },
  shippingAddress: {
    type: String,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
const DemoRequest = mongoose.model('DemoRequest', demoRequestSchema);
const Purchase = mongoose.model('Purchase', purchaseSchema);
const Order = mongoose.model('Order', orderSchema);

// Helper function to generate slug
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Routes

// Get all featured products
app.get('/api/products/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(6);
    res.json(products);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

// Get all products with filters
app.get('/api/products', async (req, res) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      brand,
      condition,
      minRating,
      inStock,
      hasDiscount,
      isUserProduct,
      tags,
      search,
      sort = 'newest',
      limit = 50, 
      skip = 0 
    } = req.query;
    
    const query = {};
    
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (condition) query.condition = condition;
    if (inStock !== undefined) query.inStock = inStock === 'true';
    if (isUserProduct !== undefined) query.isUserProduct = isUserProduct === 'true';
    if (minRating) query.rating = { $gte: parseFloat(minRating) };
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (hasDiscount === 'true') {
      query.originalPrice = { $exists: true, $ne: null };
      query.$expr = { $gt: ['$originalPrice', '$price'] };
    }
    
    if (tags) {
      query.tags = { $in: [tags] };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { longDescription: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'rating-low') sortOption = { rating: 1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'name-desc') sortOption = { name: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'reviews') sortOption = { 'reviews.length': -1 };
    
    let products;
    
    // Handle discount sorting separately as it requires calculation
    if (sort === 'discount') {
      const allProducts = await Product.find(query);
      const productsArray = allProducts.map(p => p.toObject());
      productsArray.sort((a, b) => {
        const discountA = (a.originalPrice && a.originalPrice > a.price) 
          ? a.originalPrice - a.price : 0;
        const discountB = (b.originalPrice && b.originalPrice > b.price) 
          ? b.originalPrice - b.price : 0;
        return discountB - discountA;
      });
      products = productsArray.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
    } else {
      products = await Product.find(query)
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .sort(sortOption);
    }
    
    const total = await Product.countDocuments(query);
    
    res.json({ products, total, limit: parseInt(limit), skip: parseInt(skip) });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add review to product (must come before /api/products/:id)
app.post('/api/products/:id/reviews', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const { userName, rating, comment } = req.body;
    product.reviews.push({ userName, rating, comment });
    
    // Calculate average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = totalRating / product.reviews.length;
    
    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(400).json({ error: 'Failed to add review' });
  }
});

// Get product by slug (must come before /api/products/:id to avoid route conflict)
app.get('/api/products/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get single product by ID (must come last to avoid conflicts)
app.get('/api/products/:id', async (req, res) => {
  try {
    // Check if it's a valid MongoDB ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Simple password validation (in production, use bcrypt)
    const user = new User({
      name,
      email,
      password, // In production, hash this with bcrypt
      phone: phone || '',
      address: address || ''
    });

    await user.save();
    res.status(201).json({ 
      message: 'User created successfully',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ error: 'Failed to register user' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Simple password check (in production, use bcrypt.compare)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(400).json({ error: 'Failed to login' });
  }
});

// Get user's products
app.get('/api/products/user/:userId', async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.userId });
    res.json(products);
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ error: 'Failed to fetch user products' });
  }
});

// Update product (for sellers to edit their products)
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updateData = req.body;
    // Regenerate slug if name changed
    if (updateData.name && updateData.name !== product.name) {
      updateData.slug = generateSlug(updateData.name);
    }

    Object.assign(product, updateData);
    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ error: 'Failed to update product' });
  }
});

// Chat Routes
// Send a chat message
app.post('/api/chat', async (req, res) => {
  try {
    const { productId, senderId, senderName, receiverId, receiverName, message } = req.body;
    const chatMessage = new ChatMessage({
      productId,
      senderId,
      senderName,
      receiverId,
      receiverName,
      message
    });
    await chatMessage.save();
    res.json(chatMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(400).json({ error: 'Failed to send message' });
  }
});

// Get chat messages for a product/conversation
app.get('/api/chat/:productId/:userId/:otherUserId', async (req, res) => {
  try {
    const { productId, userId, otherUserId } = req.params;
    const messages = await ChatMessage.find({
      productId,
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get all conversations for a user
app.get('/api/chat/conversations/:userId', async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const conversations = await ChatMessage.aggregate([
      {
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', userId] },
              '$receiverId',
              '$senderId'
            ]
          },
          productId: { $first: '$productId' },
          otherUserName: {
            $first: {
              $cond: [
                { $eq: ['$senderId', userId] },
                '$receiverName',
                '$senderName'
              ]
            }
          },
          lastMessage: { $first: '$message' },
          lastMessageTime: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$senderId', userId] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Mark messages as read
app.put('/api/chat/read/:productId/:userId/:otherUserId', async (req, res) => {
  try {
    await ChatMessage.updateMany(
      {
        productId: req.params.productId,
        senderId: req.params.otherUserId,
        receiverId: req.params.userId,
        read: false
      },
      { $set: { read: true } }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(400).json({ error: 'Failed to mark messages as read' });
  }
});

// Demo Request Routes
// Create a demo request
app.post('/api/demo-request', async (req, res) => {
  try {
    const { productId, buyerId, buyerName, sellerId, advancePayment, message } = req.body;
    const demoRequest = new DemoRequest({
      productId,
      buyerId,
      buyerName,
      sellerId,
      advancePayment,
      message: message || ''
    });
    await demoRequest.save();
    res.json(demoRequest);
  } catch (error) {
    console.error('Error creating demo request:', error);
    res.status(400).json({ error: 'Failed to create demo request' });
  }
});

// Get demo requests for a seller
app.get('/api/demo-request/seller/:sellerId', async (req, res) => {
  try {
    const requests = await DemoRequest.find({ sellerId: req.params.sellerId })
      .populate('productId', 'name image price')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching demo requests:', error);
    res.status(500).json({ error: 'Failed to fetch demo requests' });
  }
});

// Update demo request status
app.put('/api/demo-request/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const demoRequest = await DemoRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!demoRequest) {
      return res.status(404).json({ error: 'Demo request not found' });
    }
    res.json(demoRequest);
  } catch (error) {
    console.error('Error updating demo request:', error);
    res.status(400).json({ error: 'Failed to update demo request' });
  }
});

// Checkout Route - Handles payment, stock updates, and order creation
app.post('/api/checkout', async (req, res) => {
  try {
    const { 
      buyerId, 
      buyerName, 
      cartItems, 
      shippingAddress, 
      paymentMethod,
      totalAmount 
    } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Validate stock availability and get product details
    const purchasePromises = cartItems.map(async (item) => {
      const product = await Product.findById(item.productId || item._id);
      if (!product) {
        throw new Error(`Product ${item.productId || item._id} not found`);
      }
      
      // Check stock availability
      if (!product.inStock || product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`);
      }

      return {
        product,
        quantity: item.quantity,
        amount: item.price * item.quantity
      };
    });

    const validatedItems = await Promise.all(purchasePromises);

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create purchases and update stock
    const purchases = [];
    for (const item of validatedItems) {
      const { product, quantity, amount } = item;
      
      // Get sellerId from product
      const sellerId = product.seller || null;
      
      // Create purchase
      const purchase = new Purchase({
        productId: product._id,
        buyerId,
        buyerName,
        sellerId,
        amount,
        quantity,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        paymentMethod,
        shippingAddress,
        status: 'completed'
      });
      await purchase.save();
      purchases.push(purchase._id);

      // Update stock quantity
      product.stockQuantity -= quantity;
      if (product.stockQuantity <= 0) {
        product.stockQuantity = 0;
        product.inStock = false;
      }
      await product.save();
    }

    // Create order
    const order = new Order({
      orderId,
      buyerId,
      buyerName,
      purchases,
      totalAmount,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      paymentMethod,
      shippingAddress,
      orderStatus: 'confirmed'
    });
    await order.save();

    // Populate order with purchase details
    const populatedOrder = await Order.findById(order._id)
      .populate('purchases')
      .populate({
        path: 'purchases',
        populate: {
          path: 'productId',
          select: 'name image price'
        }
      });

    res.json({
      success: true,
      order: populatedOrder,
      message: 'Order placed successfully'
    });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to process checkout',
      details: error.message
    });
  }
});

// Purchase Routes
// Create a purchase (legacy endpoint - kept for backward compatibility)
app.post('/api/purchase', async (req, res) => {
  try {
    const { productId, buyerId, buyerName, sellerId, amount, quantity } = req.body;
    
    // If sellerId not provided, get it from product
    let finalSellerId = sellerId;
    if (!finalSellerId && productId) {
      const product = await Product.findById(productId);
      if (product) {
        finalSellerId = product.seller || null;
      }
    }
    
    const purchase = new Purchase({
      productId,
      buyerId,
      buyerName,
      sellerId: finalSellerId,
      amount,
      quantity: quantity || 1
    });
    await purchase.save();
    res.json(purchase);
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(400).json({ error: 'Failed to create purchase' });
  }
});

// Get purchases for a product (for seller analytics)
app.get('/api/purchase/product/:productId', async (req, res) => {
  try {
    const purchases = await Purchase.find({ 
      productId: req.params.productId,
      status: 'completed'
    }).sort({ purchaseDate: -1 });
    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});

// Get purchase analytics for a seller
app.get('/api/purchase/analytics/:sellerId', async (req, res) => {
  try {
    const purchases = await Purchase.find({ 
      sellerId: req.params.sellerId,
      status: 'completed'
    }).populate('productId', 'name');

    // Group by product
    const productStats = {};
    purchases.forEach(purchase => {
      const productId = purchase.productId._id.toString();
      if (!productStats[productId]) {
        productStats[productId] = {
          productName: purchase.productId.name,
          totalSales: 0,
          totalRevenue: 0,
          quantity: 0
        };
      }
      productStats[productId].totalSales += 1;
      productStats[productId].totalRevenue += purchase.amount;
      productStats[productId].quantity += purchase.quantity;
    });

    // Monthly sales data
    const monthlyData = {};
    purchases.forEach(purchase => {
      const month = new Date(purchase.purchaseDate).toISOString().slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { sales: 0, revenue: 0 };
      }
      monthlyData[month].sales += 1;
      monthlyData[month].revenue += purchase.amount;
    });

    res.json({
      totalPurchases: purchases.length,
      totalRevenue: purchases.reduce((sum, p) => sum + p.amount, 0),
      productStats: Object.values(productStats),
      monthlyData: Object.entries(monthlyData).map(([month, data]) => ({
        month,
        ...data
      }))
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get orders for a user (as buyer)
app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.params.userId })
      .populate({
        path: 'purchases',
        populate: {
          path: 'productId',
          select: 'name image price slug'
        }
      })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get purchases/orders for a seller
app.get('/api/orders/seller/:sellerId', async (req, res) => {
  try {
    const purchases = await Purchase.find({ sellerId: req.params.sellerId })
      .populate('productId', 'name image price slug')
      .populate('buyerId', 'name email')
      .sort({ purchaseDate: -1 });
    
    // Group purchases by order if they belong to an order
    const ordersMap = new Map();
    const standalonePurchases = [];
    
    for (const purchase of purchases) {
      // Find if this purchase belongs to an order
      const order = await Order.findOne({ purchases: purchase._id });
      if (order) {
        if (!ordersMap.has(order._id.toString())) {
          const populatedOrder = await Order.findById(order._id)
            .populate({
              path: 'purchases',
              populate: {
                path: 'productId',
                select: 'name image price slug'
              }
            });
          // Filter purchases to only include those from this seller
          populatedOrder.purchases = populatedOrder.purchases.filter(
            p => p.sellerId && p.sellerId.toString() === req.params.sellerId
          );
          if (populatedOrder.purchases.length > 0) {
            ordersMap.set(order._id.toString(), populatedOrder);
          }
        }
      } else {
        standalonePurchases.push(purchase);
      }
    }
    
    res.json({
      orders: Array.from(ordersMap.values()),
      standalonePurchases
    });
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ error: 'Failed to fetch seller orders' });
  }
});

// Get single order by ID
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .populate({
        path: 'purchases',
        populate: {
          path: 'productId',
          select: 'name image price slug'
        }
      });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create product (admin or user)
app.post('/api/products', async (req, res) => {
  try {
    const productData = req.body;
    if (!productData.slug && productData.name) {
      productData.slug = generateSlug(productData.name);
    }
    
    // If seller info is provided, mark as user product
    if (productData.seller || productData.sellerName) {
      productData.isUserProduct = true;
    }
    
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ error: 'Failed to create product' });
  }
});

// Helper function to create product with all fields
function createProduct(data) {
  const reviews = [];
  const reviewCount = data.featured ? Math.floor(Math.random() * 5) + 3 : Math.floor(Math.random() * 3);
  const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'David Brown', 'Emily Davis', 'Chris Wilson', 'Lisa Anderson'];
  const comments = [
    'Excellent product! Highly recommend.',
    'Great quality and fast shipping.',
    'Love it! Exceeded my expectations.',
    'Perfect for my needs. Very satisfied.',
    'Amazing value for money.',
    'Top quality product. Will buy again!',
    'Outstanding quality and design.',
    'Very happy with this purchase.',
    'Better than expected!',
    'Great product, would recommend.'
  ];
  
  for (let i = 0; i < reviewCount; i++) {
    const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
    reviews.push({
      userName: names[Math.floor(Math.random() * names.length)],
      rating: rating,
      comment: comments[Math.floor(Math.random() * comments.length)]
    });
  }
  
  const totalRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  
  return {
    ...data,
    slug: data.slug || generateSlug(data.name),
    longDescription: data.longDescription || data.description + ' Experience premium quality and modern design with this exceptional product. Perfect for those who value style and functionality.',
    brand: data.brand || 'Imperial',
    stockQuantity: data.stockQuantity || Math.floor(Math.random() * 100) + 10,
    condition: data.condition || 'New',
    images: data.images || [data.image],
    tags: data.tags || [data.category.toLowerCase(), 'premium', 'modern'],
    specifications: data.specifications || {},
    reviews: reviews,
    rating: parseFloat(totalRating.toFixed(1)),
    isUserProduct: data.isUserProduct || false,
    seller: data.seller || null,
    sellerName: data.sellerName || '',
    sellerContact: data.sellerContact || ''
  };
}

// Seed database with sample products
app.post('/api/seed', async (req, res) => {
  try {
    const sampleProducts = [
      // Featured Electronics
      {
        name: 'Premium Smartphone Pro',
        description: 'Latest flagship smartphone with advanced camera system and 5G connectivity',
        price: 74999,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        category: 'Electronics',
        featured: true,
        inStock: true
      },
      {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery',
        price: 28999,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        category: 'Electronics',
        featured: true,
        inStock: true
      },
      {
        name: 'Ultra-Slim Laptop',
        description: 'High-performance laptop with 16GB RAM, 1TB SSD, and stunning 4K display',
        price: 107999,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        category: 'Electronics',
        featured: true,
        inStock: true
      },
      {
        name: 'Smart Watch Series X',
        description: 'Advanced fitness tracking, heart rate monitor, and smartphone notifications',
        price: 24999,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        category: 'Electronics',
        featured: true,
        inStock: true
      },
      {
        name: 'Wireless Earbuds Pro',
        description: 'True wireless earbuds with noise cancellation and premium sound quality',
        price: 16599,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
        category: 'Electronics',
        featured: false,
        inStock: true
      },
      {
        name: '4K Ultra HD TV',
        description: '55-inch Smart TV with HDR10+ and voice control',
        price: 66499,
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
        category: 'Electronics',
        featured: false,
        inStock: true
      },
      {
        name: 'Gaming Console',
        description: 'Next-gen gaming console with ray tracing and 120fps support',
        price: 41499,
        image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
        category: 'Electronics',
        featured: false,
        inStock: true
      },
      {
        name: 'Tablet Pro',
        description: '12.9-inch tablet with M1 chip and Apple Pencil support',
        price: 91299,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
        category: 'Electronics',
        featured: false,
        inStock: true
      },
      // Fashion
      {
        name: 'Designer Leather Handbag',
        description: 'Elegant Italian leather handbag with gold-tone hardware',
        price: 37399,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        category: 'Fashion',
        featured: true,
        inStock: true
      },
      {
        name: 'Premium Leather Jacket',
        description: 'Classic biker-style leather jacket with quilted lining',
        price: 49799,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
        category: 'Fashion',
        featured: false,
        inStock: true
      },
      {
        name: 'Designer Sunglasses',
        description: 'Stylish UV protection sunglasses with polarized lenses',
        price: 14999,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
        category: 'Fashion',
        featured: false,
        inStock: true
      },
      {
        name: 'Luxury Watch Collection',
        description: 'Swiss-made automatic watch with sapphire crystal',
        price: 107999,
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
        category: 'Fashion',
        featured: false,
        inStock: true
      },
      {
        name: 'Designer Sneakers',
        description: 'Premium athletic sneakers with memory foam insoles',
        price: 20799,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        category: 'Fashion',
        featured: false,
        inStock: true
      },
      // Accessories
      {
        name: 'Premium Watch',
        description: 'Luxury timepiece with precision movement and water resistance',
        price: 24999,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        category: 'Accessories',
        featured: true,
        inStock: true
      },
      {
        name: 'Wireless Charging Pad',
        description: 'Fast wireless charging pad compatible with all Qi-enabled devices',
        price: 4149,
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
        category: 'Accessories',
        featured: false,
        inStock: true
      },
      {
        name: 'Premium Backpack',
        description: 'Waterproof backpack with laptop compartment and USB charging port',
        price: 10799,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        category: 'Accessories',
        featured: false,
        inStock: true
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable waterproof speaker with 360-degree sound',
        price: 7479,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
        category: 'Accessories',
        featured: false,
        inStock: true
      },
      {
        name: 'Smart Ring',
        description: 'Fitness tracking ring with sleep monitoring and heart rate sensor',
        price: 16599,
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
        category: 'Accessories',
        featured: false,
        inStock: true
      },
      // Home
      {
        name: 'Smart Home Hub',
        description: 'Central control hub for all your smart home devices',
        price: 12499,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        category: 'Home',
        featured: false,
        inStock: true
      },
      {
        name: 'Robot Vacuum Cleaner',
        description: 'Self-charging robot vacuum with mapping technology',
        price: 33199,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        category: 'Home',
        featured: false,
        inStock: true
      },
      {
        name: 'Smart LED Light Strips',
        description: 'RGB color-changing LED strips with app control',
        price: 6649,
        image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400',
        category: 'Home',
        featured: false,
        inStock: true
      },
      {
        name: 'Premium Coffee Maker',
        description: 'Programmable coffee maker with thermal carafe',
        price: 16599,
        image: 'https://images.unsplash.com/photo-1517668808823-bac4ce1a3b73?w=400',
        category: 'Home',
        featured: false,
        inStock: true
      },
      {
        name: 'Air Purifier Pro',
        description: 'HEPA air purifier with smart sensors and app control',
        price: 28999,
        image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400',
        category: 'Home',
        featured: false,
        inStock: true
      },
      // Sports
      {
        name: 'Fitness Tracker Watch',
        description: 'Advanced fitness tracking with GPS and heart rate monitor',
        price: 14999,
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
        category: 'Sports',
        featured: false,
        inStock: true
      },
      {
        name: 'Yoga Mat Premium',
        description: 'Eco-friendly yoga mat with superior grip and cushioning',
        price: 4979,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
        category: 'Sports',
        featured: false,
        inStock: true
      },
      {
        name: 'Dumbbell Set',
        description: 'Adjustable dumbbell set with weight range 5-50lbs',
        price: 24999,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        category: 'Sports',
        featured: false,
        inStock: true
      },
      {
        name: 'Running Shoes Pro',
        description: 'Lightweight running shoes with advanced cushioning technology',
        price: 12499,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        category: 'Sports',
        featured: false,
        inStock: true
      },
      {
        name: 'Bicycle Helmet',
        description: 'Aerodynamic bicycle helmet with MIPS protection',
        price: 7479,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        category: 'Sports',
        featured: false,
        inStock: true
      },
      // Other
      {
        name: 'Portable Power Bank',
        description: '20000mAh power bank with fast charging and wireless charging',
        price: 5809,
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c8?w=400',
        category: 'Other',
        featured: false,
        inStock: true
      },
      {
        name: 'USB-C Hub',
        description: 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader',
        price: 4149,
        image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400',
        category: 'Other',
        featured: false,
        inStock: true
      },
      {
        name: 'Camera Drone',
        description: '4K camera drone with GPS and obstacle avoidance',
        price: 49799,
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400',
        category: 'Other',
        featured: false,
        inStock: true
      }
    ];

    await Product.deleteMany({});
    
    // Process products with helper function
    const processedProducts = sampleProducts.map(productData => {
      const product = createProduct(productData);
      // Ensure slug is always generated
      if (!product.slug) {
        product.slug = generateSlug(product.name);
      }
      return product;
    });
    
    const products = await Product.insertMany(processedProducts);
    
    // Log first few products to verify slugs
    console.log('Sample product slugs:', products.slice(0, 3).map(p => ({ name: p.name, slug: p.slug })));
    
    res.json({ 
      message: `Database seeded successfully with ${products.length} products`,
      count: products.length,
      products: products.map(p => ({ _id: p._id, name: p.name, slug: p.slug }))
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error('Please stop the process using this port or use a different port.');
    console.error('\nTo kill the process on port 5000, run:');
    console.error('  Windows: netstat -ano | findstr :5000');
    console.error('  Then: taskkill /PID <PID> /F');
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

