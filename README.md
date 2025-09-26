<div align="center">
  <img src="https://raw.githubusercontent.com/anuragsamota/quizup-client/refs/heads/main/public/logo.svg" alt="QuizUp Logo" width="120" height="120">
  
  # QuizUp🎯
  
  **A Modern, Interactive Quiz Platform**
  
  *Create, organize, and participate in real-time quizzes with a beautiful, responsive interface*
  
  [![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.1.6-purple?logo=vite)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.13-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
  [![DaisyUI](https://img.shields.io/badge/DaisyUI-5.1.13-5A67D8?logo=daisyui)](https://daisyui.com/)
  
</div>

---

## ✨ Features

### 🎓 **For Students**
- **Join Quizzes**: Enter quiz codes to participate in live sessions
- **Real-time Experience**: Answer questions and see results instantly  
- **Performance Tracking**: View your quiz history and scores
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile

### 👨‍🏫 **For Teachers/Organizers**
- **Create Quizzes**: Build custom quizzes with multiple question types
- **Question Management**: Support for MCQ, MSQ, and Text-based questions
- **Live Sessions**: Start and manage real-time quiz sessions
- **Analytics Dashboard**: Track participant performance and quiz statistics
- **Session Control**: Manage quiz flow with start/stop controls

### 🔧 **Technical Features**
- **Service-Oriented Architecture (SOA)**: Modular backend with separate services
- **JWT Authentication**: Secure user authentication and authorization
- **Real-time Updates**: Live quiz sessions with instant feedback
- **Responsive UI**: Modern design with TailwindCSS and DaisyUI
- **API Integration**: Seamless communication with backend services

---

## 🏗️ Architecture Overview

QuizUp follows a **Service-Oriented Architecture** with three main backend services:

- **🔐 User Management Service** : Handle user authentication, profiles, and authorization
- **📝 Quiz Management Service** : Manage quiz creation, questions, and metadata
- **⚡ Quiz Runtime Service**: Handle live quiz sessions, submissions, and real-time features

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **pnpm** (recommended)
- **Git**

### 📋 Backend Services Setup

**Important**: This client requires three backend services to be running. Please ensure all backend services are set up and running before starting the client.

1. **User Management Service** - `http://localhost:8080`
2. **Quiz Management Service** - `http://localhost:6586`  
3. **Quiz Runtime Service** - `http://localhost:5642`

### 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anuragsamota/quizup-client.git
   cd quizup-client
   ```

2. **Install dependencies**
   ```bash
   # Using pnpm (recommended)
   pnpm install
   
   # Or using npm
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Update the environment variables:
   ```env
   # Backend Service URLs
   VITE_USER_API=http://localhost:8080
   VITE_QUIZ_MANAGE_API=http://localhost:6586  
   VITE_QUIZ_RUNTIME_API=http://localhost:5642
   
   # Other configurations
   VITE_APP_NAME=QuizUp
   ```

4. **Start the development server**
   ```bash
   # Using pnpm
   pnpm dev
   
   # Or using npm
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application running! 🎉

---

## 🏃‍♂️ Available Scripts

```bash
# Development
pnpm dev          # Start development server with hot reload
pnpm build        # Build for production
pnpm preview      # Preview production build locally
pnpm lint         # Run ESLint for code quality checks
```

---

## 📁 Project Structure

```
src/
├── 📱 components/          # Reusable UI components
│   ├── Footer.jsx
│   ├── MessageToast.jsx
│   ├── MobileMenu.jsx
│   ├── Navbar.jsx
│   └── PrivateRoute.jsx
├── 🎯 contexts/           # React Context providers
│   ├── AuthContext.jsx    # Authentication state management
│   └── MessageContext.jsx # Toast notifications
├── 📄 pages/              # Application pages and routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # User dashboard and management
│   ├── home/             # Landing and quiz joining
│   ├── quiz/             # Quiz taking interface
│   └── profile/          # User profile management
├── 🔧 utils/              # API utilities and helpers
│   ├── authApi.js        # Authentication API calls
│   ├── quizManageApi.js  # Quiz management API calls
│   ├── quizRuntimeApi.js # Quiz runtime API calls
│   └── userApi.js        # User data API calls
├── 🎨 styles/             # Global styles and CSS
└── 📦 assets/             # Static assets and components
```

---

## 🔌 API Integration

The client integrates with three backend services:

### Authentication APIs
```javascript
// Login/Register
POST /api/auth/login
POST /api/auth/register

// Profile Management  
GET /api/profile
PUT /api/profile
DELETE /api/profile
```

### Quiz Management APIs
```javascript
// Quiz CRUD
GET /api/quizzes
POST /api/quizzes
PUT /api/quizzes/:id
DELETE /api/quizzes/:id

// Question Management
GET /api/quizzes/:id/questions  
POST /api/questions
PUT /api/questions/:id
```

### Quiz Runtime APIs
```javascript
// Session Management
POST /api/sessions/start
POST /api/sessions/join
POST /api/sessions/submit

// Real-time Updates
GET /api/sessions/:id/status
```

---

## 🎨 UI Components & Styling

### Design System
- **🎨 TailwindCSS**: Utility-first CSS framework for rapid UI development
- **🌈 DaisyUI**: Beautiful component library built on Tailwind
- **📱 Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **🌙 Theme Support**: Built-in dark/light theme switching capability

### Key Components
- **Navigation**: Responsive navbar with mobile hamburger menu
- **Authentication**: Secure login/register forms with validation
- **Quiz Interface**: Clean, distraction-free quiz taking experience
- **Dashboard**: Comprehensive teacher/student dashboard with analytics
- **Forms**: Accessible form components with proper validation

---

## 🛡️ Security Features

- **🔐 JWT Authentication**: Secure token-based authentication
- **🔒 Protected Routes**: Route-level authentication guards
- **🛡️ Input Validation**: Client and server-side input validation
- **🚫 XSS Protection**: Sanitized user inputs and outputs
- **🔑 Secure Storage**: Encrypted localStorage for sensitive data

---

## 🔄 Development Workflow

### Code Quality
- **ESLint**: Automated code linting and formatting
- **React Hooks**: Modern React patterns with hooks
- **Component Architecture**: Modular, reusable component design
- **Error Boundaries**: Graceful error handling and recovery

### Performance Optimization
- **Code Splitting**: Lazy loading for better performance
- **Bundle Optimization**: Vite's efficient bundling and tree-shaking
- **Image Optimization**: Optimized asset delivery
- **Caching Strategy**: Efficient API response caching

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create your feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and patterns
- Write clear, descriptive commit messages  
- Add tests for new features when possible
- Update documentation for any API changes

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Vite Team** - For the lightning-fast build tool
- **TailwindCSS** - For the utility-first CSS framework
- **DaisyUI** - For the beautiful component library
- **Lucide React** - For the beautiful icon library

---

<div align="center">
  
  **Made with ❤️ by [Anurag Samota](https://github.com/anuragsamota) and [Shubham Jindal](https://github.com/sj141200)**
  
  ⭐ **Star this repo if you find it helpful!**
  
</div>
