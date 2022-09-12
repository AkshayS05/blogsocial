const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');

//create Post
router.post('/', async (req, res) => {
  //here we created the post
  const newPost = await new Post(req.body);
  try {
    //saving the post
    const savedPost = await newPost.save();
    //sending it as a response
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
//update Post
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //if we have found that id exists, comapre the provided username with the username available in the database
    if (post.username === req.body.username) {
      try {
        //find the post we are required to update using id in the parameter
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            //set the new content provided in the body
            $set: req.body,
          },
          {
            new: true,
          },
        );
        //response should be the new content
        res.status(200).json(updatedPost);
        //in case it fails, throw an error
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      //if username doesn't match
      res.status(404).json('You can only update your posts!');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete Post
router.delete('/:id', async (req, res) => {
  try {
    //find the post in the post collection from the database using id from the parameter
    const post = await Post.findById(req.params.id);
    //cmpare the username provided with the one in the database for that id
    if (post.username === req.body.username) {
      try {
        //if exists, delete that post
        await post.delete();
        //response in 200 ok status code
        res.status(200).json('Post has been deleted...');
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json('You can delete only your post!');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET POST
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get All Posts
router.get('/', async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
