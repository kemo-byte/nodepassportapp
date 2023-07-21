const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const uploadModel = require('../models/Upload');
// @desc User login page
// @route GET /users/login
// @access Public

const loginUser = (req, res) => {
  const checked = 'false'; //  false for login page

  res.render('login', { checked }); // Render the EJS template and pass the checked value
};

// @desc login a user if authenticated
// @route POST /users/login
// @access Public
const handleLoginUser = (req, res, next) => {
  passport.authenticate('local', (user) => {
    if (!user) {
      // Handle authentication failure
      req.flash('error', 'Invalid username or password');
      return res.redirect('/users/login');
    }

    return req.logIn(user, async (err) => {
      if (err) {
        // Handle error
        return next(err);
      }

      const query = { user: user.id };
      const photos = await uploadModel.find(query).sort({ _id: -1 });
      req.session.user = user;
      req.session.photos = photos;
      req.flash('success_msg', `Welcome back ${user.name} !`);

      return res.redirect('/dashboard');
    });
  })(req, res, next);
};

// @desc Register User Page
// @route GET /users/register
// @access Public
const registerUser = (req, res) => {
  const checked = 'true'; // true for register page

  res.render('login', { checked }); // Render the EJS template and pass the checked value
};

// @desc Register a new user
// @route POST /users/register
// @access Public
const handleRegisterUser = async (req, res) => {
  const {
    name, email1, password1, password2,
  } = req.body;
  const errors = [];

  // check if all field are empty
  if (!name || !email1 || !password1 || !password2) {
    errors.push({ msg: 'all fields are required' });
  }

  // check password match
  if (password1 !== password2) {
    errors.push({ msg: 'password mismatch !' });
  }

  // check password length

  if (password1.length < 6) {
    errors.push({ msg: 'password should be at lease 6 characters' });
  }

  if (errors.length > 0) {
    const checked = 'true'; // true for register page

    return res.render('login', {
      errors,
      name,
      email1,
      password1,
      password2,
      checked,
    });
  }
  try {
    // validation passed
    const user = await User.findOne({ email: email1 });
    if (user) {
      // user exists
      errors.push({ msg: 'Email already registered !' });

      const checked = 'true'; // true for register page

      return res.render('login', {
        errors,
        name,
        email1,
        password1,
        password2,
        checked,
      });
    }
    const newUser = new User({
      name,
      email: email1,
      password: password1,
    });
    // Hash password

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);
    // set password to hashed
    newUser.password = hash;

    try {
      const user1 = await newUser.save();

      req.flash('success_msg', `${user1.name} registered successfully !`);
      return res.redirect('login');
    } catch (err) {
      return console.log(err);
    }
  } catch (err) {
    return console.log(err);
  }
};

// @desc Logout User
// @route POST /users/logout
// @access Private
const logoutUser = (req, res) => {
  req.logout(() => {
    console.log('logged out ...');
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
};
module.exports = {
  loginUser,
  handleLoginUser,
  registerUser,
  handleRegisterUser,
  logoutUser,
};
