# UniSportX 🏆

A modern social platform designed for university students, athletes, and sports enthusiasts to share sports-related content, connect with peers, and celebrate athletic achievements.

## 🌟 Features

### Social Features
- **Post Creation** - Share photos, text, and sports moments
- **Reactions & Comments** - Engage with posts using sports-themed reactions (🔥, ⚽, 🏆, 💪, etc.)
- **Feed System** - Browse and filter posts by category
- **User Profiles** - Personalized user experience with avatars

### Video Management
- **YouTube Integration** - Upload videos directly to YouTube
- **Video Gallery** - Browse and watch sports videos
- **Faculty Categorization** - Organize content by university faculties

### User Experience
- **Dark/Light Mode** - Toggle between themes
- **Responsive Design** - Works seamlessly on all devices
- **Real-time Updates** - Optimistic UI updates for better performance
- **Authentication** - Secure login/signup with password reset

### Content Management
- **Image Upload** - Cloudinary integration for image storage
- **Post Editing** - Edit and delete your own posts
- **Category Filtering** - Filter posts by sports categories
- **Tag System** - Add tags to organize content

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **Cloudinary** - Cloud image storage
- **YouTube Data API** - Video upload integration

### Development Tools
- **Vite** - Fast build tool
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Git** - Version control

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Cloudinary account
- YouTube Data API credentials

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Backend Setup
```bash
cd server
npm install
npm start
```

### Environment Variables

#### Frontend (.env)
```env
VITE_SERVER_URL=http://localhost:5000
```

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
YOUTUBE_REDIRECT_URI=your_youtube_redirect_uri
```

## 🏗️ Project Structure

```
unisportX/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── layout/        # Layout components
│   │   ├── global/        # Redux store and actions
│   │   ├── utils/         # Utility functions
│   │   └── assets/        # Static assets
│   └── public/            # Public assets
├── server/                # Backend Node.js application
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   └── utils/            # Utility functions
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset

### Posts
- `GET /posts` - Get all posts
- `POST /posts` - Create new post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `POST /posts/:id/react` - Add reaction
- `DELETE /posts/:id/react` - Remove reaction
- `POST /posts/:id/comments` - Add comment
- `DELETE /posts/:id/comments/:commentId` - Delete comment

### Videos
- `GET /videos` - Get all videos
- `POST /videos/upload-youtube` - Upload video to YouTube

## 🎨 UI Components

### Core Components
- **Header** - Navigation and user controls
- **PostCard** - Individual post display with reactions
- **CreatePost** - Post creation form
- **VideoGrid** - Video gallery display
- **EditPost** - Post editing modal
- **DeletePostConfirm** - Post deletion confirmation
- **LogoutConfirm** - Logout confirmation
- **ScrollToTopBtn** - Scroll to top button

### Pages
- **Home** - Landing page
- **Login/Signup** - Authentication pages
- **Feed** - Social feed
- **Videos** - Video gallery
- **Terms & Conditions** - Legal terms
- **Privacy Policy** - Privacy information

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt password encryption
- **CORS Protection** - Cross-origin request handling
- **Input Validation** - Server-side validation
- **File Upload Security** - Secure file handling
- **Rate Limiting** - API request limiting

## 🌐 Deployment

### Frontend Deployment
```bash
cd client
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd server
npm start
# Deploy to your server or cloud platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@unisportx.com or create an issue in this repository.

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For smooth animations
- **Cloudinary** - For cloud image storage
- **YouTube Data API** - For video integration

---

**UniSportX** - Connecting athletes, fans, and everyone in the university community! 🏃‍♂️⚽🏀
