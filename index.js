const express = require('express');
const app = express();
const port = 8080;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/authRoutes');
const userRoute = require('./routes/userRoutes');
const postRoute = require('./routes/postRoutes');
const categoryRoute = require('./routes/categoryRoutes');
//to upload images we use multer
const multer = require('multer');
const path = require('path');

dotenv.config();
//to send json object inside body
app.use(express.json());
//to access images-->making images folder public
app.use('/images', express.static(path.join(__dirname, '/images')));

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));
//
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //where cb will handle the errors
    cb(null, 'images'); //where images is our destination
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name); //here we will use react so req.body.name
  },
});
const upload = multer({ storage: storage });
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.status(200).json('File has been uploaded!');
});
//route to auth
app.use('/api/auth', authRoute);
//route to user
app.use('/api/users', userRoute);
//route to post
app.use('/api/posts', postRoute);
//route to category
app.use('/api/categories', categoryRoute);

// app.use(express.static(path.join(__dirname, 'build')));

if (process.env.NODE_ENV) {
  //static folder add
  app.use(express.static('app/client/build'));
  app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'app/client/build', 'index.html'));
  });
}
app.listen(process.env.PORT || port, () => {
  console.log('Server is listening on port', port);
});
