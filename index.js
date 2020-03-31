const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
// Import routes
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts')

dotenv.config();

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to DB")
);

// Middleware
app.use(express.json());

// Routes middleware
app.use('/auth', authRoute);
app.use('/posts', postsRoute);

app.listen(3000, () => console.log('Server up and running'));