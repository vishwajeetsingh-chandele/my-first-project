# Candidate Notes Backend - MERN Stack

A complete backend solution for the Collaborative Candidate Notes MVP, built with Node.js, Express, MongoDB, and Socket.IO for real-time collaboration.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Real-time Communication**: Socket.IO for live updates, notifications, and collaboration
- **Candidate Management**: Full CRUD operations with assignment and access control
- **Collaborative Notes**: Real-time note creation with @mentions and notifications
- **Smart Notifications**: Tag-based notifications with real-time delivery
- **User Management**: Complete user system with profiles and permissions
- **Security**: Input validation, sanitization, rate limiting, and secure headers

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd candidate-notes-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory with the following variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/candidate-notes

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

4. **Start MongoDB**
Make sure MongoDB is running on your system:
```bash
# Using MongoDB service (Linux/macOS)
sudo systemctl start mongod

# Or using MongoDB directly
mongod
```

5. **Start the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000` (or your specified PORT).

## 📁 Project Structure

```
candidate-notes-backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── middleware/
│   ├── auth.js              # Authentication & authorization middleware
│   ├── socketAuth.js        # Socket.IO authentication middleware
│   └── validation.js        # Input validation & sanitization
├── models/
│   ├── User.js              # User schema & methods
│   ├── Candidate.js         # Candidate schema & methods
│   ├── Note.js              # Note schema with mentions support
│   └── Notification.js      # Notification schema & methods
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── candidates.js        # Candidate CRUD routes
│   ├── notes.js             # Note management routes
│   ├── notifications.js     # Notification routes
│   └── users.js             # User management routes
├── socket/
│   └── socketHandlers.js    # Real-time event handlers
├── .env                     # Environment variables
├── package.json             # Dependencies & scripts
└── server.js                # Main application entry point
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Candidates
- `GET /api/candidates` - List candidates with pagination & filters
- `GET /api/candidates/:id` - Get single candidate
- `POST /api/candidates` - Create new candidate
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Soft delete candidate
- `POST /api/candidates/:id/assign` - Assign users to candidate
- `DELETE /api/candidates/:id/assign/:userId` - Remove assignment
- `GET /api/candidates/:id/stats` - Get candidate statistics

### Notes
- `GET /api/notes/candidate/:candidateId` - Get notes for candidate
- `GET /api/notes/:noteId` - Get single note
- `POST /api/notes/candidate/:candidateId` - Create note with mentions
- `PUT /api/notes/:noteId` - Update note
- `DELETE /api/notes/:noteId` - Delete note
- `POST /api/notes/:noteId/reaction` - Add/update reaction
- `DELETE /api/notes/:noteId/reaction` - Remove reaction
- `GET /api/notes/search` - Search notes

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/by-candidate/:candidateId` - Get candidate notifications
- `GET /api/notifications/stats` - Get notification statistics

### Users
- `GET /api/users` - List users (for autocomplete)
- `GET /api/users/:id` - Get user profile
- `GET /api/users/search/mentions` - Search for mentions
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Deactivate user (Admin only)
- `GET /api/users/stats/overview` - User statistics (Admin only)

## 🔌 WebSocket Events

### Client → Server
- `joinCandidateRoom` - Join candidate's note room
- `leaveCandidateRoom` - Leave candidate's note room
- `createNote` - Create note in real-time
- `updateNote` - Update note in real-time
- `deleteNote` - Delete note in real-time
- `typing` - Send typing indicator
- `updatePresence` - Update user presence status
- `getOnlineUsers` - Get users online in room
- `markNotificationRead` - Mark notification as read

### Server → Client
- `newNote` - New note created
- `noteUpdated` - Note was updated
- `noteDeleted` - Note was deleted
- `userJoinedRoom` - User joined candidate room
- `userLeftRoom` - User left candidate room
- `userTyping` - User typing indicator
- `userPresenceUpdate` - User presence changed
- `notification` - New notification received
- `unreadCountUpdate` - Unread count changed
- `onlineUsers` - List of online users in room

## 🔐 Authentication & Security

### JWT Authentication
- Tokens expire in 7 days (configurable)
- Refresh token endpoint available
- Secure token validation on all protected routes

### Security Features
- **Helmet**: Security headers
- **CORS**: Cross-origin request configuration
- **Rate Limiting**: API rate limiting (100 requests per 15 minutes)
- **Input Validation**: Comprehensive validation using express-validator
- **XSS Protection**: HTML sanitization using DOMPurify
- **Password Security**: bcrypt hashing with salt rounds

### Role-Based Access Control
- **Admin**: Full system access
- **Recruiter**: Can create/manage candidates and notes
- **Hiring Manager**: Can view and comment on assigned candidates

## 🔄 Real-time Features

### Socket.IO Integration
- JWT-based socket authentication
- Room-based communication for candidates
- Real-time presence indicators
- Typing indicators
- Live notifications
- Connection health monitoring

### Mentions & Notifications
- @username tagging in notes
- Automatic notification creation
- Real-time notification delivery
- Email-style notification preview
- Unread count tracking

## 📊 Data Models

### User Model
- Name, email, password (hashed)
- Role-based permissions
- Profile picture support
- Activity tracking

### Candidate Model
- Basic info (name, email, phone)
- Position and status tracking
- Skills and experience
- Assignment to users
- Soft delete support

### Note Model
- Rich content with mention extraction
- Note types (note, feedback, interview_note, decision)
- Privacy controls
- Reaction system
- Edit tracking

### Notification Model
- Type-based notifications
- Read/unread status
- Related entity linking
- Automatic cleanup

## 🧪 Testing

Run the test suite:
```bash
npm test
```

For development with auto-reload:
```bash
npm run dev
```

## 📝 API Usage Examples

### Register a new user
```javascript
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "recruiter"
}
```

### Create a candidate
```javascript
POST /api/candidates
Authorization: Bearer <token>
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "position": "Software Engineer",
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": 5
}
```

### Add a note with mentions
```javascript
POST /api/notes/candidate/[candidateId]
Authorization: Bearer <token>
{
  "content": "Great interview! @john what do you think about their technical skills?",
  "type": "interview_note",
  "priority": "high"
}
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/candidate-notes
JWT_SECRET=your-production-secret-key
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start server.js --name "candidate-notes-api"
pm2 startup
pm2 save
```

### Docker Support
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🛠️ Development

### Code Style
- ESLint configuration included
- Prettier for code formatting
- Consistent error handling
- Comprehensive logging

### Database Indexes
Optimized MongoDB indexes for:
- User email lookups
- Candidate searches and filtering
- Note queries by candidate
- Notification lookups

### Error Handling
- Centralized error handling middleware
- Detailed error logging
- Production-safe error responses
- Validation error formatting

## 📞 Support

For issues and questions:
1. Check the API documentation
2. Review error logs
3. Verify environment configuration
4. Check MongoDB connection

## 🔮 Future Enhancements

If more time was available, these enhancements would be implemented:

### Performance & Scalability
- **Redis Caching**: Cache frequently accessed data and session management
- **Database Optimization**: Advanced indexing and query optimization
- **Horizontal Scaling**: Load balancer and multiple server instances
- **CDN Integration**: File upload and static asset serving

### Advanced Features
- **File Attachments**: Support for resume uploads and note attachments
- **Advanced Search**: Elasticsearch integration for complex queries
- **Email Notifications**: Background job processing for email alerts
- **Audit Logging**: Complete activity tracking and compliance features
- **Analytics Dashboard**: Usage statistics and reporting
- **Interview Scheduling**: Calendar integration and booking system

### Security Enhancements
- **2FA Authentication**: Two-factor authentication support
- **API Versioning**: Versioned API endpoints for backward compatibility
- **Advanced Rate Limiting**: Per-user and per-endpoint rate limiting
- **Security Monitoring**: Intrusion detection and anomaly monitoring

### Mobile & Integration
- **Mobile API**: Optimized endpoints for mobile applications
- **Webhook System**: External system integration capabilities
- **Third-party Auth**: OAuth integration (Google, LinkedIn, etc.)
- **API Documentation**: Interactive Swagger/OpenAPI documentation

---

Built with ❤️ using the MERN stack for efficient and scalable candidate collaboration.