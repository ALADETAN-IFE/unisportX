const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const videoRoutes = require('./routes/videosRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const postRoutes = require('./routes/postRoutes');
const sitemap = require('./routes/sitemap')
const hipolabsUniRoutes = require('./routes/hipolabsUniRoutes')
const helmet = require('helmet');
const morgan = require('morgan');

const fs = require('fs');
const path = require('path');

// Connect to Database
// connectDB();

const app = express();

// Init Middleware
// Using Helmet as a global middleware
app.use(helmet());

// Use morgan for request logging. The 'dev' format is good for development.
app.use(morgan('dev'));

// Configure CORS for multiple environments
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Set-Cookie']
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/universities', hipolabsUniRoutes);
app.use('/', sitemap);


// // Default route
// app.get('/', (req, res) => {
//   res.send(`

//   `);
// });

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'htmladn', 'welcome.html');
  fs.readFile(filePath, 'utf8', (err, html) => {
    if (err) {
      res.status(500).send('Error loading page');
      return;
    }
    res.send(html);
  });
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

// Start server only after DB connection
connectDB().then(() => {
  app.listen(port, () => console.log(`Server started on port ${port}`));
}).catch(() => {
  console.error('Failed to connect to MongoDB. Server not started.');
  process.exit(1);
});
