// starting `node src/index.js`

const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const { pool, checkConnection } = require('./db.cjs');
const mysql2 = require('mysql2');

const app = express();

// Middleware to parse the body of POST requests
app.use(express.urlencoded({ extended: true }));

// Use EJS as the view engine
app.set('view engine', 'ejs');

// Static files 
app.use(express.static('public'));

// Check the database connection on server start
checkConnection();

// Render login page
app.get('/', (req, res) => {
  res.render('login');
});

// Render signup page
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Handle user signup
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query('INSERT INTO users2 (username, password) VALUES (?, ?)', [username, hashedPassword]);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering new user. Please try again.');
  }
});

// Handle user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users2 WHERE username = ?', [username]);
    if (rows.length > 0) {
      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.send(`Logged in successfully! Welcome, ${username}`);
      } else {
        res.status(401).send('Invalid username or password');
      }
    } else {
      res.status(401).send('Invalid username or password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in. Please try again.');
  }
});

const port = 5002;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
