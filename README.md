# FitLife - Fitness Blog Website 🏋️‍♂️💪

FitLife is a fitness blog platform where users can create, read, update, and delete their posts. The platform also supports image uploads, category filtering, and user authentication. Built with modern web technologies, FitLife provides a seamless experience for fitness enthusiasts to share and explore content.

## Overview 📝
FitLife is a fitness blog platform where users can create, read, update, and delete (CRUD) their posts, upload images, and categorize posts into different fitness topics such as **BodyBuilding, WeightLifting, Sparring, and Yoga**. The platform provides a seamless experience for fitness enthusiasts to share and explore workout routines, training tips, and wellness advice.

## Features🚀

- 🔒 **User Authentication**: Secure login and signup with JWT authentication.
- ✍️ **CRUD Operations**: Users can create, view, edit, and delete their blog posts.
- 🖼️ **Image Uploads**: Upload and display images within blog posts.
- 📂 **Category Filtering**: Browse posts by categories such as **BodyBuilding, WeightLifting, Sparring, and Yoga**.
- 🗂️ **State Management**: Redux is used for efficient global state management.
- 📊 **Aggregation Pipelines**: MongoDB aggregation pipelines are utilized for advanced filtering and analytics.


## Tools & Technologies

- **Frontend**: React.js ⚛️, Redux
- **Backend**: Node.js 🟢, Express.js 🚀
- **Database**: MongoDB 🍃
- **Authentication**: JWT 🔑 (JSON Web Tokens)

## API Endpoints

### Authentication
- **POST `/api/auth/register`**: Register a new user.
- **POST `/api/auth/login`**: Log in an existing user.

### Posts
- **GET `/api/posts`**: Get all posts (paginated).
- **GET `/api/posts/:id`**: Get a single post by ID.
- **POST `/api/posts`**: Create a new post.
- **PUT `/api/posts/:id`**: Update a post by ID.
- **DELETE `/api/posts/:id`**: Delete a post by ID.

### Categories
- **GET `/api/categories`**: Get all categories.
- **GET `/api/categories/:category`**: Filter posts by category.

### Images
- **POST `/api/upload`**: Upload an image for a blog post.
- **POST `/api/upload/profileImage`**: Upload a profile image for a user.

### User
- **GET `/api/user`**: Get authenticated user details.
- **GET `/api/user/posts`**: Fetch posts created by the authenticated user.

---

## Installation

Follow these steps to set up the project locally:

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud-based)
- Git

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rizz778/fitlife.git

2. **Install Dependencies**:
   For the backend:
   ```bash
   cd backend
   npm install
   
   For the frontend:
   ```bash
   cd frontend
   npm install
3. **Set up environment variables**:
   Create a .env file in the backend directory and add the following:
   ```bash
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
4. **Run the backend server:**:
   ```bash
   cd backend
   npm start
5. **Run the frontend development server:**:
   ```bash
   cd frontend
   npm run dev

