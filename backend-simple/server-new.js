require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'thememarket-secret-key-2024';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thememarket';

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ============ DATABASE SCHEMAS ============

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  createdAt: { type: Date, default: Date.now }
});

const themeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  shortDescription: String,
  price: { type: Number, required: true },
  category: String,
  preview_image: String,
  theme_file: String,
  features: [String],
  previewUrl: String,
  demoUrl: String,
  download_count: { type: Number, default: 0 },
  is_published: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  theme_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Theme', required: true },
  theme_title: String,
  theme_image: String,
  amount: Number,
  status: { type: String, default: 'completed' },
  payment_method: String,
  order_date: { type: Date, default: Date.now }
});

const downloadSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  theme_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Theme', required: true },
  theme_title: String,
  download_date: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Theme = mongoose.model('Theme', themeSchema);
const Order = mongoose.model('Order', orderSchema);
const Download = mongoose.model('Download', downloadSchema);

// ============ AUTH MIDDLEWARE ============

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
}

// ============ AUTH ROUTES ============

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'USER'
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Get current user
app.get('/api/user/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ============ THEME ROUTES ============

// Get all themes
app.get('/api/themes', async (req, res) => {
  try {
    const themes = await Theme.find({ is_published: true }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: themes.length,
      data: themes
    });
  } catch (error) {
    console.error('Get themes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single theme
app.get('/api/themes/:id', async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);

    if (!theme) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }

    res.json({
      success: true,
      data: theme
    });
  } catch (error) {
    console.error('Get theme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Upload theme (Admin only)
app.post('/api/themes/upload', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { title, description, shortDescription, price, category, preview_image, features, previewUrl, demoUrl } = req.body;

    const newTheme = new Theme({
      title,
      description,
      shortDescription,
      price,
      category,
      preview_image,
      features: features || [],
      previewUrl,
      demoUrl
    });

    await newTheme.save();

    res.status(201).json({
      success: true,
      message: 'Theme uploaded successfully',
      data: newTheme
    });
  } catch (error) {
    console.error('Upload theme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete theme (Admin only)
app.delete('/api/themes/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const theme = await Theme.findByIdAndDelete(req.params.id);

    if (!theme) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }

    res.json({
      success: true,
      message: 'Theme deleted successfully'
    });
  } catch (error) {
    console.error('Delete theme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ============ DOWNLOAD ROUTES ============

// Download theme
app.post('/api/themes/download/:id', authMiddleware, async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);

    if (!theme) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }

    // Record download
    const newDownload = new Download({
      user_id: req.user.id,
      theme_id: theme._id,
      theme_title: theme.title
    });

    await newDownload.save();

    // Increment download count
    theme.download_count += 1;
    await theme.save();

    res.json({
      success: true,
      message: 'Download recorded',
      data: newDownload
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get user downloads
app.get('/api/user/downloads', authMiddleware, async (req, res) => {
  try {
    const downloads = await Download.find({ user_id: req.user.id })
      .sort({ download_date: -1 });

    res.json({
      success: true,
      count: downloads.length,
      data: downloads
    });
  } catch (error) {
    console.error('Get downloads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ============ ORDER ROUTES ============

// Create order (Purchase theme)
app.post('/api/orders', authMiddleware, async (req, res) => {
  try {
    const { theme_id, amount } = req.body;
    
    if (!theme_id || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide theme_id and amount'
      });
    }

    const theme = await Theme.findById(theme_id);

    if (!theme) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }

    // Create order
    const newOrder = new Order({
      user_id: req.user.id,
      theme_id: theme._id,
      theme_title: theme.title,
      theme_image: theme.preview_image,
      amount: parseFloat(amount),
      status: 'completed',
      payment_method: 'credit_card'
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get user orders
app.get('/api/user/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user.id })
      .sort({ order_date: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single order
app.get('/api/orders/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user_id.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ============ DASHBOARD ROUTES ============

// Get dashboard stats
app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get user-specific stats
    const ordersCount = await Order.countDocuments({ user_id: req.user.id });
    const downloadsCount = await Download.countDocuments({ user_id: req.user.id });
    
    // Get total spent
    const orders = await Order.find({ user_id: req.user.id });
    const totalSpent = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

    // For admin - get global stats
    let adminStats = {};
    if (user.role === 'ADMIN') {
      const totalUsers = await User.countDocuments();
      const totalThemes = await Theme.countDocuments();
      const totalOrders = await Order.countDocuments();
      const totalRevenue = await Order.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      adminStats = {
        totalUsers,
        totalThemes,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      };
    }

    res.json({
      success: true,
      data: {
        ordersCount,
        downloadsCount,
        totalSpent,
        ...adminStats
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ============ HEALTH CHECK ============

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'ThemeMarket Backend is running with MongoDB!',
    timestamp: new Date().toISOString()
  });
});

// ============ SEED DEFAULT ADMIN ============

async function seedAdmin() {
  try {
    const adminExists = await User.findOne({ email: 'admin@thememarket.com' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        name: 'Admin User',
        email: 'admin@thememarket.com',
        password: hashedPassword,
        role: 'ADMIN'
      });
      await admin.save();
      console.log('✅ Default admin created: admin@thememarket.com / admin123');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
}

// ============ START SERVER ============

const server = app.listen(PORT, async () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🗄️  Database: MongoDB`);
  console.log('\n📝 Default Admin Login:');
  console.log('   Email: admin@thememarket.com');
  console.log('   Password: admin123\n');
  
  // Seed default admin
  await seedAdmin();
});

module.exports = app;
