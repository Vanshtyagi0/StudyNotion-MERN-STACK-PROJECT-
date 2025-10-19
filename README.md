# StudyNotion - EdTech Platform

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://studynotionfrontendby.netlify.app/)
[![MERN Stack](https://img.shields.io/badge/stack-MERN-blue.svg)](https://www.mongodb.com/mern-stack)

A fully functional ed-tech platform that enables users to create, consume, and rate educational content. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🌐 Live Demo

Visit the live application: [StudyNotion Platform](https://studynotionfrontendby.netlify.app/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Future Enhancements](#future-enhancements)

## 🎯 Overview

StudyNotion aims to provide:
- **For Students**: A seamless and interactive learning experience, making education more accessible and engaging
- **For Instructors**: A platform to showcase expertise and connect with learners across the globe

## ✨ Features

### For Students

- **Homepage**: Introduction to the platform with quick links to courses and user details
- **Course List**: Browse all available courses with descriptions and ratings
- **Wishlist**: Save courses for later viewing
- **Cart & Checkout**: Seamless course purchase experience with Razorpay integration
- **Course Content**: Access videos and learning materials
- **User Profile**: View and edit account details

### For Instructors

- **Dashboard**: Overview of courses with ratings and feedback
- **Insights**: Detailed analytics including views, clicks, and engagement metrics
- **Course Management**: Create, update, and delete courses
- **Content Management**: Manage course content, pricing, and media
- **Profile Management**: View and edit account information

### For Admin (Future Scope)

- **Platform Dashboard**: Overview of courses, instructors, and students
- **Analytics**: Platform-wide metrics including users, courses, and revenue
- **User Management**: Manage instructors and students
- **Course Oversight**: Platform-wide course management

## 🏗️ System Architecture

StudyNotion follows a client-server architecture with three main components:

### Architecture Diagram

![Architecture](images/architecture.png)

### Components

1. **Frontend (Client)**
   - Built with React.js for dynamic and responsive UI
   - Communicates with backend via RESTful APIs
   - State management using Redux

2. **Backend (Server)**
   - Node.js and Express.js for API services
   - Handles authentication, course management, and business logic
   - Processes and stores course content and user data

3. **Database**
   - MongoDB for flexible, scalable data storage
   - Stores course content, user data, and platform information

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js
- **State Management**: Redux
- **Styling**: CSS, Tailwind CSS
- **Responsive Design**: Mobile-first approach

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: Bcrypt
- **ODM**: Mongoose

### Database
- **Database**: MongoDB (NoSQL)
- **Storage**: Flexible document-based storage

### Additional Services
- **Media Management**: Cloudinary (cloud-based storage for images, videos, documents)
- **Payment Gateway**: Razorpay
- **Content Format**: Markdown for course documents

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd studynotion
```

2. **Install dependencies**

Frontend:
```bash
cd frontend
npm install
```

Backend:
```bash
cd backend
npm install
```

3. **Environment Variables**

Create `.env` file in the backend directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
```

4. **Run the application**

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm start
```

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new user account |
| POST | `/api/auth/login` | Login and generate JWT token |
| POST | `/api/auth/verify-otp` | Verify OTP sent to email |
| POST | `/api/auth/forgot-password` | Send password reset link |

### Course Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:id` | Get specific course by ID |
| POST | `/api/courses` | Create new course |
| PUT | `/api/courses/:id` | Update course by ID |
| DELETE | `/api/courses/:id` | Delete course by ID |
| POST | `/api/courses/:id/rate` | Add rating to course |

### Sample API Request/Response

**GET** `/api/courses/:id`
```json
{
  "success": true,
  "data": {
    "id": "course123",
    "name": "Web Development Bootcamp",
    "description": "Complete web development course",
    "instructor": "John Doe",
    "rating": 4.5,
    "price": 49.99
  }
}
```

## 🗄️ Database Schema

![Database Schema](images/schema.png)

### Core Schemas

1. **Student Schema**
   - Name, email, password
   - Enrolled courses
   - Wishlist
   - Purchase history

2. **Instructor Schema**
   - Name, email, password
   - Created courses
   - Earnings
   - Analytics

3. **Course Schema**
   - Course name and description
   - Instructor details
   - Media content
   - Pricing
   - Ratings and reviews

## 🚀 Future Enhancements

### Planned Features
- **Admin Panel**: Complete administrative dashboard
- **Live Classes**: Real-time video sessions
- **Discussion Forums**: Community interaction
- **Certificates**: Course completion certificates
- **Mobile App**: Native mobile applications
- **Advanced Analytics**: AI-powered insights
- **Gamification**: Badges and achievements
- **Multi-language Support**: International accessibility

### Timeline
- **Phase 1** (Q1): Admin panel and advanced analytics
- **Phase 2** (Q2): Live classes and discussion forums
- **Phase 3** (Q3): Mobile app development
- **Phase 4** (Q4): Gamification and certificates

## 🧪 Testing

### Testing Strategy
- **Unit Testing**: Component and function testing
- **Integration Testing**: API endpoint testing
- **E2E Testing**: User flow testing
- **Performance Testing**: Load and stress testing

### Tools Used
- Jest
- React Testing Library
- Supertest
- Cypress

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For any queries or support, please reach out through the platform's contact form.

---

**Made with ❤️ by Vansh Tyagi, inspired by the Love Babbar Dot Batch Course**