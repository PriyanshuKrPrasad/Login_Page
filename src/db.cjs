const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Admin@123',   // Update with your MySQL password
  database: 'login_system',  // Update with your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to check database connection
const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully!');
    connection.release();
  } catch (err) {
    console.error('Database connection failed:', err);
  }
};

module.exports = { pool, checkConnection };
