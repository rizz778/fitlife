# FitLife - Fitness Blog Website

FitLife is a fitness blog platform where users can create, read, update, and delete their posts. The platform also supports image uploads, category filtering, and user authentication. Built with modern web technologies, FitLife provides a seamless experience for fitness enthusiasts to share and explore content.

## Features

- **CRUD Operations**: Users can create, read, update, and delete their posts.
- **Image Uploads**: Upload and display images within blog posts.
- **Category Filtering**: Easily filter posts by categories such as BodyBuilding, WeightLifting, Sparring, and Yoga.
- **User Authentication**: Secure user authentication using JWT (JSON Web Tokens).
- **Responsive Design**: A clean and responsive design for optimal viewing on all devices.

## Tools & Technologies

- **Frontend**: React.js, Redux
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Image Uploads**: Multer (for handling file uploads)
- **State Management**: Redux
- **API Development**: RESTful APIs

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Log in an existing user.

### Posts
- `GET /api/posts` - Get all posts.
- `GET /api/posts/:id` - Get a single post by ID.
- `POST /api/posts` - Create a new post.
- `PUT /api/posts/:id` - Update a post by ID.
- `DELETE /api/posts/:id` - Delete a post by ID.

### Categories
- `GET /api/categories` - Get all categories.
- `GET /api/categories/:category` - Filter posts by category.

### Images
- `POST /api/upload` - Upload an image for a blog post.

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

