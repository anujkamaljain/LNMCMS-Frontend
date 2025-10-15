<div align="center">

# 🏫 LNMCMS Frontend
### **LNM Complaint Management System - Frontend**

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.8-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.8.2-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

**A modern, responsive, and feature-rich complaint management system built for educational institutions**

[🚀 Live Demo](https://lnmcms-frontend.vercel.app) • [📚 Backend Repository](https://github.com/anujkamaljain/LNMCMS-Backend) • [🐛 Report Bug](https://github.com/anujkamaljain/LNMCMS-Frontend/issues) • [✨ Request Feature](https://github.com/anujkamaljain/LNMCMS-Frontend/issues)

</div>

---

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [🧪 Demo Credentials](#-demo-credentials)
- [🏗️ Project Structure](#️-project-structure)
- [🎨 UI/UX Features](#-uiux-features)
- [📊 Analytics & Charts](#-analytics--charts)
- [💬 Real-time Chat](#-real-time-chat)
- [🌐 Internationalization](#-internationalization)
- [🤝 Contributing](#-contributing)
- [👥 Authors](#-authors)
- [📄 License](#-license)

---

## 🌟 Features

### 🎯 **Role-Based Access Control**
- **👨‍🎓 Student Dashboard**: Submit complaints, track status, discover public complaints
- **🧑‍💼 Admin Dashboard**: Manage department-specific complaints, analytics, user management
- **👑 SuperAdmin Dashboard**: Global oversight, bulk operations, system analytics

### 📝 **Complaint Management**
- **Smart Complaint Submission**: Rich text editor with media attachments
- **Category-based Routing**: Automatic department assignment based on complaint tags
- **Status Tracking**: Pending → Accepted → Resolved workflow
- **Media Support**: Upload images, documents, and videos (up to 3 files per complaint)
- **Public/Private Visibility**: Students can make complaints discoverable to others
- **Upvoting System**: Community-driven complaint prioritization

### 💬 **Real-time Communication**
- **Live Chat System**: Direct communication between students and admins
- **Socket.IO Integration**: Instant message delivery and read receipts
- **Complaint-specific Chats**: Contextual conversations linked to specific complaints
- **Unread Message Tracking**: Red dot notifying unread messages of a specific user on a complaint

### 📊 **Advanced Analytics**
- **Interactive Charts**: Bar charts, pie charts, doughnut charts, and line graphs
- **Department-wise Statistics**: Visual breakdown of complaint distribution
- **Monthly Trends**: Time-based analysis of complaint patterns
- **Real-time Dashboard**: Live updates of key metrics

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach with perfect tablet and desktop support
- **Dark/Light Theme**: Automatic theme switching with system preference detection
- **Smooth Animations**: Framer Motion powered micro-interactions
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Loading States**: Skeleton loaders and progress indicators

### 🌐 **Internationalization**
- **Multi-language Support**: English and Hindi translations
- **Dynamic Language Switching**: Real-time language change without page reload
- **Context-aware Translations**: Role-specific and feature-specific translations

### 🔐 **Security & Authentication**
- **JWT-based Authentication**: Secure token-based authentication
- **Protected Routes**: Role-based route protection
- **Session Management**: Automatic token refresh and logout
- **Input Validation**: Client-side and server-side validation

---

## 🛠️ Tech Stack

### **Frontend Core**
- **⚛️ React 19.1.0** - Latest React with concurrent features
- **🎨 Tailwind CSS 4.1.8** - Utility-first CSS framework
- **🎭 DaisyUI 5.0.43** - Component library for Tailwind
- **⚡ Vite 6.3.5** - Lightning-fast build tool

### **State Management & Data**
- **🔄 Redux Toolkit 2.8.2** - Predictable state container
- **🌐 Axios 1.9.0** - HTTP client for API calls
- **📡 Socket.IO Client 4.8.1** - Real-time communication

### **UI/UX Libraries**
- **🎬 Framer Motion 12.17.0** - Production-ready motion library
- **📊 Chart.js 4.4.9** - Beautiful, responsive charts
- **🎯 Lucide React 0.545.0** - Beautiful & consistent icons
- **🔥 React Hot Toast 2.5.2** - Elegant notifications
- **⏰ React Clock 6.0.0** - Real-time clock components

### **Development Tools**
- **🔍 ESLint 9.25.0** - Code linting and formatting
- **📦 Nodemon** - Development server with hot reload
- **🌐 Vercel Analytics** - Performance monitoring

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v20 or higher)
- npm 
- Git

### **Installation**

```bash
# Clone the repository
git clone https://github.com/anujkamaljain/LNMCMS-Frontend.git
cd LNMCMS-Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Build for Production**

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

---

## 🧪 Demo Credentials

### 👨‍🎓 **Student Account**
```
Email: 23ucs540@lnmiit.ac.in
Password: Anuj@1234
```

### 🧑‍💼 **Admin Account**
```
Email: anujkjain@lnmiit.ac.in
Password: Anuj@1234
```

### 🔒 **SuperAdmin Account**
> SuperAdmin credentials are restricted for security reasons to prevent unauthorized bulk operations and system modifications.

---

## 🏗️ Project Structure

```
LNMCMS-Frontend/
├── 📁 public/                 # Static assets
│   ├── 🖼️ Logo.png
│   ├── 📄 sample_students.csv
│   └── 📄 sample_students_delete.csv
├── 📁 src/
│   ├── 📁 components/         # React components
│   │   ├── 🎛️ AdminDashboard.jsx
│   │   ├── 👑 SuperAdminDashboard.jsx
│   │   ├── 👨‍🎓 StudentDashboard.jsx
│   │   ├── 💬 Chat.jsx
│   │   ├── 📊 Chart.jsx
│   │   ├── 🖼️ MediaViewer.jsx
│   │   ├── ⭐ StarRatingModal.jsx
│   │   └── ... (30+ components)
│   ├── 📁 utils/              # Utilities and stores
│   │   ├── 🔐 authSlice.js
│   │   ├── 📡 socket.js
│   │   ├── 🌐 translations.js
│   │   ├── 🎨 themeSlice.js
│   │   └── ... (10+ utility files)
│   ├── 📄 App.jsx             # Main application component
│   ├── 📄 main.jsx            # Application entry point
│   └── 📄 index.css           # Global styles
├── 📄 package.json            # Dependencies and scripts
├── 📄 vite.config.js          # Vite configuration
└── 📄 vercel.json             # Deployment configuration
```

---

## 🎨 UI/UX Features

### **🎭 Design System**
- **Consistent Color Palette**: Carefully chosen colors for accessibility
- **Typography Scale**: Responsive font sizes with proper hierarchy
- **Spacing System**: Consistent margins and padding using Tailwind's scale
- **Component Library**: Reusable components with consistent styling

### **📱 Responsive Design**
- **Mobile First**: Optimized for mobile devices 
- **Tablet Support**: Perfect layout for tablets 
- **Desktop Experience**: Enhanced features for desktop 

### **🎬 Animations & Interactions**
- **Page Transitions**: Smooth route transitions
- **Hover Effects**: Subtle micro-interactions
- **Form Validation**: Real-time feedback with animations

---

## 📊 Analytics & Charts

### **📈 Chart Types**
- **Bar Charts**: Department-wise complaint distribution
- **Pie Charts**: Status breakdown visualization
- **Doughnut Charts**: Category-wise analysis
- **Line Charts**: Monthly trend analysis
- **Reflection Charts**: Custom analytics views

### **📊 Dashboard Metrics**
- **Real-time Counters**: Live complaint statistics

---

## 💬 Real-time Chat

### **🔗 Features**
- **Instant Messaging**: Real-time message delivery
- **Complaint Context**: Chat linked to specific complaints
- **Message History**: Persistent chat history

### **🎯 Use Cases**
- **Student-Admin Communication**: Direct resolution discussions
- **Status Updates**: Real-time complaint progress updates
- **Clarifications**: Quick question-answer sessions
- **Follow-ups**: Post-resolution feedback and support

---

## 🌐 Internationalization

### **🌍 Supported Languages**
- **English**: Complete translation coverage
- **Hindi (हिंदी)**: Full Hindi language support

### **🔄 Dynamic Switching**
- **Real-time Translation**: No page reload required
- **Context-aware**: Role and feature-specific translations
- **Persistent Selection**: Language preference saved in localStorage
- **Fallback Support**: Graceful fallback to English

---

## 🔧 Development

### **📝 Code Quality**
- **ESLint Configuration**: Strict linting rules
- **Prettier Integration**: Consistent code formatting

### **🚀 Performance**
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Component-level lazy loading

### **🧪 Testing Ready**
- **Test Structure**: Organized for easy testing setup
- **Error Boundaries**: Graceful error handling

---


### **📊 Performance Monitoring**
- **Vercel Analytics**: Built-in performance monitoring
- **Core Web Vitals**: Automatic performance tracking
- **Error Tracking**: Real-time error monitoring
- **User Analytics**: Usage pattern analysis

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### **🐛 Bug Reports**
1. Check existing issues first
2. Use the bug report template
3. Provide detailed reproduction steps
4. Include screenshots if applicable

### **✨ Feature Requests**
1. Check existing feature requests
2. Use the feature request template
3. Describe the use case clearly
4. Consider implementation complexity

### **💻 Code Contributions**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 👥 Authors

<div align="center">

### **Anuj Jain**
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/anujkamaljain)

### **Anmol Sanger**
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AnmolSanger)

</div>

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

### **⭐ Star this repository if you found it helpful!**

**Built with ❤️ for the LNMIIT community**

[🚀 Live Demo](https://lnmcms-frontend.vercel.app) • [🐛 Report Issue](https://github.com/anujkamaljain/LNMCMS-Frontend/issues)

</div>