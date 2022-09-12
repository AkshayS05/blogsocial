const router = require('express').Router();
const User = require('../models/User');
//to hide the password/encypt it we use bcrypt
const bcrypt = require('bcrypt');
//Register
//we will use our cutom inpits to post in the response than taking the whole req.body
router.post('/register', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });
    //if everything goes well, now we can save this user
    const user = await newUser.save();
    //send the response
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
    console.log(err.message);
  }
});
//login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json('wrong credentials!');
    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json('wrong credentials');
    //to hide the password in the output/response
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
