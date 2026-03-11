const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*'
}));

app.use(express.json());
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/email', require('./routes/email'));
app.use('/api/auth', require('./routes/auth'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'College Helpdesk API running' });
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_helpdesk';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;