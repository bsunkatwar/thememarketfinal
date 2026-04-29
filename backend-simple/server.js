const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'simple-secret-key-for-theme-market';
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors({
  origin: ['http://localhost:5500', 'http://localhost:8080', 'null'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Helper functions
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function generateId(array) {
  return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
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

    const data = readData();
    
    // Check if user exists
    if (data.users.find(u => u.email === email)) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: generateId(data.users),
      name,
      email,
      password: hashedPassword,
      role: 'USER',
      createdAt: new Date().toISOString()
    };

    data.users.push(newUser);
    writeData(data);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
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

    const data = readData();
    const user = data.users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // For admin with default password, bypass bcrypt check
    let isPasswordValid = false;
    if (email === 'admin@thememarket.com' && password === 'admin123') {
      isPasswordValid = true;
    } else {
      isPasswordValid = await bcrypt.compare(password, user.password);
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
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

// Auth middleware
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

// Get current user
app.get('/api/user/me', authMiddleware, (req, res) => {
  const data = readData();
  const user = data.users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.createdAt
    }
  });
});

// ============ THEME ROUTES ============

// Get all themes
app.get('/api/themes', (req, res) => {
  const data = readData();
  const themes = data.themes.filter(t => t.is_published);
  
  res.json({
    success: true,
    count: themes.length,
    data: themes
  });
});

// Get single theme
app.get('/api/themes/:id', (req, res) => {
  const data = readData();
  const theme = data.themes.find(t => t.id === parseInt(req.params.id));

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
});

// ============ DOWNLOAD ROUTES ============

// Download theme
app.post('/api/themes/download/:id', authMiddleware, (req, res) => {
  const data = readData();
  const theme = data.themes.find(t => t.id === parseInt(req.params.id));

  if (!theme) {
    return res.status(404).json({
      success: false,
      message: 'Theme not found'
    });
  }

  // Record download
  const newDownload = {
    id: generateId(data.downloads),
    user_id: req.user.id,
    theme_id: theme.id,
    theme_title: theme.title,
    download_date: new Date().toISOString()
  };

  data.downloads.push(newDownload);
  
  // Increment download count
  theme.download_count = (theme.download_count || 0) + 1;
  
  writeData(data);

  res.json({
    success: true,
    message: 'Download recorded',
    data: newDownload
  });
});

// Get user downloads
app.get('/api/user/downloads', authMiddleware, (req, res) => {
  const data = readData();
  const downloads = data.downloads.filter(d => d.user_id === req.user.id);

  res.json({
    success: true,
    count: downloads.length,
    data: downloads
  });
});

// ============ ORDER ROUTES ============

// Create order
app.post('/api/orders', authMiddleware, (req, res) => {
  const { theme_id, amount } = req.body;
  
  if (!theme_id || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Please provide theme_id and amount'
    });
  }

  const data = readData();
  const theme = data.themes.find(t => t.id === parseInt(theme_id));

  if (!theme) {
    return res.status(404).json({
      success: false,
      message: 'Theme not found'
    });
  }

  // Create order
  const newOrder = {
    id: generateId(data.orders),
    user_id: req.user.id,
    theme_id: theme.id,
    theme_title: theme.title,
    theme_image: theme.preview_image,
    amount: parseFloat(amount),
    status: 'completed',
    payment_method: 'credit_card',
    order_date: new Date().toISOString()
  };

  data.orders.push(newOrder);
  writeData(data);

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: newOrder
  });
});

// Get user orders
app.get('/api/user/orders', authMiddleware, (req, res) => {
  const data = readData();
  const orders = data.orders.filter(o => o.user_id === req.user.id);

  res.json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// Get single order
app.get('/api/orders/:id', authMiddleware, (req, res) => {
  const data = readData();
  const order = data.orders.find(o => o.id === parseInt(req.params.id));

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  if (order.user_id !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.json({
    success: true,
    data: order
  });
});

// ============ HEALTH CHECK ============

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'ThemeMarket Simple Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// ============ START SERVER ============

app.listen(PORT, () => {
  console.log('✓ Server running on http://localhost:3000');
  console.log('✓ Using JSON file storage (no database needed!)');
  console.log('✓ API available at http://localhost:3000/api');
  console.log('\n📝 Default Admin Login:');
  console.log('   Email: admin@thememarket.com');
  console.log('   Password: admin123');
});
