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
const { createServer } = require('http');
const { Server } = require('socket.io');

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
    exposedHeaders: ['Set-Cookie'],
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT' ]
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

const server = require('http').createServer(app);

// Initialize Socket.IO
// const io = require('socket.io')(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || 'http://localhost:3000',
//     credentials: true,
//     methods: ['GET', 'POST']
//   }
// });

const io = new Server(server, { cors: corsOptions} );

// Make Socket.IO instance available to controllers
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a post room for real-time comments
  socket.on('join-post', (postId) => {
    socket.join(`post-${postId}`);
    console.log(`User ${socket.id} joined post room: post-${postId}`);
  });

  // Leave a post room
  socket.on('leave-post', (postId) => {
    socket.leave(`post-${postId}`);
    console.log(`User ${socket.id} left post room: post-${postId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const port = process.env.PORT || 5000;

// Start server only after DB connection
connectDB().then(() => {
  server.listen(port, () => console.log(`Server started on port ${port}`));
}).catch(() => {
  console.error('Failed to connect to MongoDB. Server not started.');
  process.exit(1);
});

// cd client && npm run dev
// cd server && npm start