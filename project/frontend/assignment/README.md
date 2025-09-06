# Candidate Notes Frontend

A modern React frontend application for collaborative candidate management with real-time features.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Real-time Communication**: Socket.IO for live updates, notifications, and collaboration
- **Candidate Management**: Full CRUD operations with assignment and access control
- **Collaborative Notes**: Real-time note creation with @mentions and notifications
- **Smart Notifications**: Tag-based notifications with real-time delivery
- **User Management**: Complete user system with profiles and permissions
- **Modern UI**: Built with Tailwind CSS and Headless UI components

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on port 5000

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd candidate-notes-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory with the following variables:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Application Configuration
VITE_APP_NAME=Candidate Notes
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

4. **Start the development server**
```bash
npm run dev
```

The application will start on `http://localhost:3000` (or your specified port).

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── candidates/      # Candidate-related components
│   ├── common/           # Shared components
│   ├── notes/            # Note-related components
│   ├── notifications/   # Notification components
│   └── users/            # User-related components
├── context/              # React Context providers
│   ├── AuthContext.js    # Authentication state
│   ├── SocketContext.js # Socket.IO state
│   └── NotificationContext.js # Notification state
├── hooks/                # Custom React hooks
├── pages/                # Page components
│   ├── auth/             # Authentication pages
│   ├── candidates/       # Candidate pages
│   ├── dashboard/        # Dashboard page
│   ├── notifications/    # Notification pages
│   └── users/            # User pages
├── services/             # API service functions
│   ├── api.js           # Axios configuration
│   ├── auth.js          # Authentication API
│   ├── candidates.js    # Candidate API
│   ├── notes.js         # Notes API
│   ├── notifications.js # Notification API
│   ├── socket.js        # Socket.IO service
│   └── users.js         # User API
├── utils/                # Utility functions
│   ├── constants.js     # Application constants
│   ├── formatters.js    # Data formatting utilities
│   ├── helpers.js       # Helper functions
│   └── validation.js    # Form validation
└── styles/               # CSS styles
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 UI Components

The application uses a comprehensive set of reusable components:

### Authentication Components
- `LoginForm` - User login form
- `RegisterForm` - User registration form
- `ProfileSettings` - User profile management
- `ProtectedRoute` - Route protection wrapper

### Common Components
- `Layout` - Main application layout
- `Loading` - Loading spinner component
- `ErrorBoundary` - Error handling component
- `Header` - Application header
- `Sidebar` - Navigation sidebar

### Candidate Components
- `CandidateCard` - Candidate display card
- `CandidateForm` - Candidate creation/edit form
- `CandidateList` - Candidate listing
- `CandidateFilters` - Filtering controls
- `AssignmentModal` - User assignment modal

### Note Components
- `NoteCard` - Note display card
- `NoteForm` - Note creation/edit form
- `NoteEditor` - Rich text editor
- `MentionInput` - @mention input component
- `NoteReactions` - Reaction system
- `TypingIndicator` - Real-time typing indicator

### Notification Components
- `NotificationCard` - Notification display
- `NotificationList` - Notification listing
- `NotificationBadge` - Unread count badge

## 🔌 Real-time Features

The application includes comprehensive real-time functionality:

### Socket.IO Events
- **Client → Server**: `joinCandidateRoom`, `leaveCandidateRoom`, `createNote`, `updateNote`, `deleteNote`, `typing`, `updatePresence`
- **Server → Client**: `newNote`, `noteUpdated`, `noteDeleted`, `userJoinedRoom`, `userLeftRoom`, `userTyping`, `notification`, `unreadCountUpdate`

### Real-time Features
- Live note updates across all connected users
- Typing indicators
- User presence tracking
- Instant notifications
- Online user lists

## 🎯 Key Features

### Authentication System
- JWT-based authentication
- Role-based access control (Admin, Recruiter, Hiring Manager)
- Protected routes
- Profile management
- Password change functionality

### Candidate Management
- Create, read, update, delete candidates
- Advanced filtering and search
- User assignment system
- Status tracking
- Skills and experience management

### Collaborative Notes
- Real-time note creation and editing
- @mention system for user notifications
- Note types (note, feedback, interview_note, decision)
- Priority levels
- Reaction system
- Edit history tracking

### Notification System
- Real-time notification delivery
- Unread count tracking
- Notification types (mention, note_created, candidate_assigned, etc.)
- Mark as read functionality
- Notification history

## 🛡️ Security Features

- JWT token authentication
- Role-based access control
- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure API communication

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_SOCKET_URL=https://your-api-domain.com
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

### Deployment Options
- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist` folder
- **AWS S3**: Upload the `dist` folder to an S3 bucket
- **Docker**: Use the included Dockerfile

## 🔧 Configuration

### API Configuration
The application connects to a backend API. Make sure your backend is running and accessible at the configured URL.

### Socket.IO Configuration
Real-time features require a Socket.IO server. The frontend will automatically connect to the configured socket URL.

### Feature Flags
Control application features using environment variables:
- `VITE_ENABLE_ANALYTICS` - Enable/disable analytics
- `VITE_ENABLE_DEBUG` - Enable/disable debug mode
- `VITE_MOCK_API` - Use mock API responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review the code comments
3. Check the browser console for errors
4. Verify API connectivity
5. Check environment configuration

## 🔮 Future Enhancements

- Dark mode support
- Advanced search with filters
- File upload support
- Email notifications
- Mobile app (React Native)
- Advanced analytics dashboard
- Integration with external HR systems