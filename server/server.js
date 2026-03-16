const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const authMiddleware = require('./middleware/auth');

// Routes
const shopRoutes = require('./routes/shopRoutes')(supabase);
const billRoutes = require('./routes/billRoutes')(supabase);
const paymentRoutes = require('./routes/paymentRoutes')(supabase);

app.use('/api/shops', authMiddleware, shopRoutes);
app.use('/api/bills', authMiddleware, billRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);


// Test route
app.get('/api/test', async (req, res) => {
  try {
    const { data, error } = await supabase.from('shops').select('count').limit(1);
    if (error) throw error;
    res.json({ message: 'Rent Manager API is working', supabaseConnected: true });
  } catch (error) {
    console.error('Supabase connection error:', error);
    res.json({ message: 'Rent Manager API is working', supabaseConnected: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;