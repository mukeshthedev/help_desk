const express = require('express');
const router = express.Router();

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        username: ADMIN_USERNAME,
        role: 'admin',
        token: 'admin-token-helpdesk-2024'
      }
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid username or password' });
});

router.post('/verify', (req, res) => {
  const { token } = req.body;
  if (token === 'admin-token-helpdesk-2024') {
    return res.json({ success: true, role: 'admin' });
  }
  return res.status(401).json({ success: false, message: 'Invalid token' });
});

module.exports = router;