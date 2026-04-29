require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3004;
const JWT_SECRET = process.env.JWT_SECRET || 'thememarket-secret-key-2024';

// PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============ DATABASE SETUP ============

async function initializeDatabase() {
  try {
    await pool.connect();
    console.log('✅ Supabase Database Connected Successfully');

    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'USER',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS themes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        short_description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100),
        preview_image VARCHAR(255),
        theme_file VARCHAR(255),
        features JSONB DEFAULT '[]',
        preview_url VARCHAR(255),
        demo_url VARCHAR(255),
        download_count INTEGER DEFAULT 0,
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        theme_id INTEGER REFERENCES themes(id),
        theme_title VARCHAR(255),
        theme_image VARCHAR(255),
        amount DECIMAL(10, 2),
        status VARCHAR(50) DEFAULT 'completed',
        payment_method VARCHAR(100),
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS downloads (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        theme_id INTEGER REFERENCES themes(id),
        theme_title VARCHAR(255),
        download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database tables initialized');

    // Seed admin user if not exists
    const adminExists = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@thememarket.com']);
    
    if (adminExists.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        ['Admin User', 'admin@thememarket.com', hashedPassword, 'ADMIN']
      );
      console.log('✅ Default admin created: admin@thememarket.com / admin123');
    }

    // Seed sample themes if empty
    const themesCount = await pool.query('SELECT COUNT(*) FROM themes');
    if (parseInt(themesCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO themes (title, description, short_description, price, category, preview_image, features, preview_url, demo_url) VALUES
        ('Kalium - Creative Theme', 'Creative portfolio theme with modern design', 'A sleek creative theme', 59, 'Creative', 'kalium.jpeg', '["Feature 1", "Feature 2"]', 'https://kalium.qodeinteractive.com/', 'https://kalium-demo.qodeinteractive.com/'),
        ('Avada - Business Theme', 'Professional business theme', 'Bold professional theme', 69, 'Business', 'avada.jpeg', '["Feature 1", "Feature 2"]', 'https://avada.theme-fusion.com/', 'https://avada-demo.theme-fusion.com/'),
        ('TheGem - Multi-Purpose', 'Versatile multi-purpose theme', 'Conversion-optimized theme', 59, 'Multi-Purpose', '2.png', '["Feature 1", "Feature 2"]', 'https://thegem.stylemixthemes.net/', 'https://thegem-demo.stylemixthemes.net/')
      `);
      console.log('✅ Sample themes added');
    }

  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
  }
}

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
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, 'USER']
    );

    const user = newUser.rows[0];

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
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

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = userResult.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

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

// Get current user
app.get('/api/user/me', authMiddleware, async (req, res) => {
  try {
    const userResult = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [req.user.id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: userResult.rows[0]
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
    const themesResult = await pool.query('SELECT * FROM themes WHERE is_published = true ORDER BY created_at DESC');
    
    res.json({
      success: true,
      count: themesResult.rows.length,
      data: themesResult.rows
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
    const themeResult = await pool.query('SELECT * FROM themes WHERE id = $1', [req.params.id]);

    if (themeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }

    res.json({
      success: true,
      data: themeResult.rows[0]
    });
  } catch (error) {
    console.error('Get theme error:', error);
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
    const themeResult = await pool.query('SELECT * FROM themes WHERE id = $1', [req.params.id]);

    if (themeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }

    const theme = themeResult.rows[0];

    // Record download
    await pool.query(
      'INSERT INTO downloads (user_id, theme_id, theme_title) VALUES ($1, $2, $3)',
      [req.user.id, theme.id, theme.title]
    );

    // Increment download count
    await pool.query('UPDATE themes SET download_count = download_count + 1 WHERE id = $1', [theme.id]);

    res.json({
      success: true,
      message: 'Download recorded'
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
    const downloadsResult = await pool.query(
      'SELECT * FROM downloads WHERE user_id = $1 ORDER BY download_date DESC',
      [req.user.id]
    );

    res.json({
      success: true,
      count: downloadsResult.rows.length,
      data: downloadsResult.rows
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

    const themeResult = await pool.query('SELECT * FROM themes WHERE id = $1', [theme_id]);

    if (themeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }

    const theme = themeResult.rows[0];

    // Create order
    const newOrder = await pool.query(
      'INSERT INTO orders (user_id, theme_id, theme_title, theme_image, amount, status, payment_method) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.id, theme.id, theme.title, theme.preview_image, parseFloat(amount), 'completed', 'credit_card']
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder.rows[0]
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
    const ordersResult = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY order_date DESC',
      [req.user.id]
    );

    res.json({
      success: true,
      count: ordersResult.rows.length,
      data: ordersResult.rows
    });
  } catch (error) {
    console.error('Get orders error:', error);
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
    // Get user-specific stats
    const ordersCount = await pool.query('SELECT COUNT(*) FROM orders WHERE user_id = $1', [req.user.id]);
    const downloadsCount = await pool.query('SELECT COUNT(*) FROM downloads WHERE user_id = $1', [req.user.id]);
    const totalSpentResult = await pool.query('SELECT SUM(amount) as total FROM orders WHERE user_id = $1', [req.user.id]);
    
    const totalSpent = parseFloat(totalSpentResult.rows[0].total || 0);

    // Get user info
    const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
    const userRole = userResult.rows[0].role;

    let adminStats = {};
    if (userRole === 'ADMIN') {
      const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
      const totalThemes = await pool.query('SELECT COUNT(*) FROM themes');
      const totalOrders = await pool.query('SELECT COUNT(*) FROM orders');
      const totalRevenue = await pool.query('SELECT SUM(amount) as total FROM orders');

      adminStats = {
        totalUsers: parseInt(totalUsers.rows[0].count),
        totalThemes: parseInt(totalThemes.rows[0].count),
        totalOrders: parseInt(totalOrders.rows[0].count),
        totalRevenue: parseFloat(totalRevenue.rows[0].total || 0)
      };
    }

    res.json({
      success: true,
      data: {
        ordersCount: parseInt(ordersCount.rows[0].count),
        downloadsCount: parseInt(downloadsCount.rows[0].count),
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
    message: 'ThemeMarket Backend is running with Supabase (PostgreSQL)!',
    timestamp: new Date().toISOString()
  });
});

// ============ START SERVER ============

const server = app.listen(PORT, async () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🗄️  Database: Supabase (PostgreSQL)`);
  console.log('\n📝 Default Admin Login:');
  console.log('   Email: admin@thememarket.com');
  console.log('   Password: admin123\n');
  
  // Initialize database
  await initializeDatabase();
});

module.exports = app;
