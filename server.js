const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper function to query the database
const query = (text, params) => pool.query(text, params);

// Initialize database with admin user
async function initializeDatabase() {
  try {
    const userExists = await query('SELECT * FROM users WHERE username = $1', ['admin']);
    if (userExists.rows.length === 0) {
      await query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', ['admin', 'password', 'admin']);
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase();

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log(`Attempting login for username: ${username}`);
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log(`User found: ${JSON.stringify(user)}`);
      if (user.password === password) {
        res.json({ token: 'fake-jwt-token', username: user.username, role: user.role });
      } else {
        console.log('Password incorrect');
        res.status(400).json({ message: 'Username or password is incorrect' });
      }
    } else {
      console.log('User not found');
      res.status(400).json({ message: 'Username or password is incorrect' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ... (rest of the server.js code remains unchanged)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
