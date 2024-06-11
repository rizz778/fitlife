import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt"
// Load Environment variables
dotenv.config();

// Express app connection
const app = express();
const PORT = process.env.PORT || 4000;
const mongodb_url = process.env.MONGODB_URL;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(mongodb_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("Connected To MongoDB") })
    .catch((error) => console.log("Error connecting to MongoDB Database: " + error));

// API Routes
app.get('/', (req, res) => {
    res.send('express app running on port 4000');
});

// Image storage engine
const storage = multer.diskStorage({
    destination: "./upload/images",
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// Creating endpoint for uploading images
app.use('/images', express.static('upload/images'));
app.post("/upload", upload.single('post'), (req, res) => {
  if (req.file) {
    res.json({
      success: 1,
      image_url: `http://localhost:${PORT}/images/${req.file.filename}`
    });
  } else {
    res.json({
      success: 0,
      message: "Image upload failed"
    });
  }
});


// Schema for creating a blog post
const blogSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required:true
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

const Blog = mongoose.model("Blog", blogSchema);
//creating middleware to fetch user
const fetchUser = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    console.log('No authorization header found');
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('No token found in authorization header');
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, 'secret_blog');
    req.user = data.user;
    console.log('Token verified, user:', req.user); // Log the user data from token
    next();
  } catch (error) {
    console.log('Error verifying token:', error); // Log the error
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};

// API Endpoint for adding posts


// API Endpoint for adding posts
app.post('/addpost', fetchUser, async (req, res) => {
  try {
    // Find user first
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Initialize user posts if not already an array
    if (!Array.isArray(user.posts)) {
      user.posts = [];
    }

    // Create the new blog post
    let posts = await Blog.find({});
    let id = posts.length > 0 ? posts[posts.length - 1].id + 1 : 1;

    const post = new Blog({
      id: id,
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      image: req.body.image,
      user: req.user.id  // Associate post with user
    });

    await post.save();

    // Update user with new post
    user.posts.push(post._id);
    await user.save();

    res.json({
      success: true,
      title: req.body.title
    });

  } catch (error) {
   
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating post",
      error: error.message
    });
  }
});


//API endpoint for fetching posts
// API endpoint for fetching posts with user details
app.get('/posts', async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  try {
    const posts = await Blog.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          id: 1,
          title: 1,
          content: 1,
          category: 1,
          image: 1,
          date: 1,
          username: '$userDetails.username',
          profileImage: '$userDetails.profileImage'
        }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    const totalPosts = await Blog.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      posts,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});



// Endpoint to fetch user's personal posts
// Endpoint to fetch user's personal posts
app.get('/myposts', fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('posts');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, posts: user.posts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user posts',
      error: error.message
    });
  }
});
// Endpoint to fetch details of posts by their IDs
app.post('/postsByIds', async (req, res) => {
  const { postIds } = req.body; // Expecting an array of post IDs
  try {
    const posts = await Blog.find({ _id: { $in: postIds } }).populate('user', 'username profileImage');
    res.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching posts by IDs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
});


//Endpoint to update users post
app.put('/updatepost/:id', fetchUser,upload.single('image'), async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Blog.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;
   
    if (req.file) {
      post.image = `http://localhost:${PORT}/images/${req.file.filename}`;
    }


    await post.save();

    res.json({ success: true, post });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ success: false, message: 'Error updating post', error: error.message });
  }
});

//Latest Post Endpoint
app.get('/latestposts', async (req, res) => {
  try {
    // Fetch latest 6 posts
    let posts = await Blog.find({}).sort({ date: -1 }).limit(6); 
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest posts', error });
  }
});
//Endpoint to fetch posts categorically
app.get('/posts/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const posts = await Blog.aggregate([
      { $match: { category } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          id: 1,
          title: 1,
          content: 1,
          category: 1,
          image: 1,
          date: 1,
          username: '$userDetails.username',
          profileImage: '$userDetails.profileImage'
        }
      }
    ]);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts by category', error });
  }
});

//User Schema

const userschema = new mongoose.Schema({
  username: {
    type: String,
    required:true
  },
  profileImage: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required:true
  },
  password: {
    type: String,
    required:true
  },
  posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }],
  date: {
    type: Date,
    default: Date.now,
  }
});

const User = mongoose.model('User', userschema);
  const profileImageStorage = multer.diskStorage({
    destination: "./upload/profileImages",
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const profileImageUpload = multer({ storage: profileImageStorage });

// Serve profile images statically
app.use('/profileImages', express.static('upload/profileImages'));

app.post('/signup', profileImageUpload.single('profileImage'), async (req, res) => {
  try {
    let check = await User.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({ success: false, errors: "Existing user found with same email" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      profileImage: req.file ? `http://localhost:${PORT}/profileImages/${req.file.filename}` : '', // Save image path
    });

    await user.save();

    const data = {
      user: {
        id: user.id
      }
    };
    const token = jwt.sign(data, 'secret_blog');
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, errors: error.message });
  }
});

  // Serving profile images
app.use('/profileImages', express.static('upload/profileImages'));
//creating endpoint for user login
app.post('/login', async (req, res) => {
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
          const data = {
            user: {
              id: user.id
            }
          };
          const token = jwt.sign(data, 'secret_blog');
          res.json({ success: true, token, profileImage: user.profileImage });
        } else {
          alert('Wrong Password');
        }
      } else {
        alert('Wrong Email ID')
      }
    } catch (error) {
      res.status(500).json({ success: false, errors: error.message });
    }
  });
  app.get('/getUser', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, 'secret_blog');
        const user = await User.findById(decoded.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, errors: error.message });
    }
});
  app.listen(PORT,(error)=>{

    if(!error)
        {console.log("Server running on port 4000")}
    else{
        console.log("Error: "+error)
    }
  })