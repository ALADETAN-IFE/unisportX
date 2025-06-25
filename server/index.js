const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const videoRoutes = require('./routes/videosRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect to Database
connectDB();

const app = express();

// Init Middleware

corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);


// Default route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>UnisportX API</title>
      <link rel="icon" href="http://res.cloudinary.com/dserpv6p5/image/upload/v1750828847/elkerqp2puqenfu1b5bi.png" type="image/x-icon">
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          background-color: #f5f5f5;
        }
        .container {
          text-align: center;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #333;
          margin-bottom: 1.5rem;
        }
        .docs-button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          transition: background-color 0.3s;
        }
        .docs-button:hover {
          background-color: #45a049;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to the uniSportX API!</h1>
        <img src="http://res.cloudinary.com/dserpv6p5/image/upload/v1750828847/elkerqp2puqenfu1b5bi.png" alt="UniSportX Logo" style="width: 150px; height: auto; margin-bottom: 20px;">
      </div>
    </body>
    </html>
  `);
});


// Handle invalid HTTP methods for existing routes
app.use('/', (req, res, next) => {
  const allowedMethods = ['GET', 'POST']; // Add allowed methods as needed
  if (!allowedMethods.includes(req.method)) {
    res.status(405).send('Method Not Allowed');
    return;
  }
  next();
});

// 404 - after all valid routes
app.use((req, res) => {
  res.status(404).send('Page not found');
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
