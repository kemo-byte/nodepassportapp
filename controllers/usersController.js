const passport = require('passport')
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// @desc User login page
// @route GET /users/login
// @access Public

const loginUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('dashboard')
  }
    const checked = "false"; //  false for login page
  
    res.render("login", { checked: checked }); // Render the EJS template and pass the checked value
  }
  

// @desc login a user if authenticated
// @route POST /users/login
// @access Public
const handleLoginUser = (req, res, next) => {
    passport.authenticate('local',{
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  }


// @desc Register User Page
// @route POST /users/register
// @access Public
const registerUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard')
  }
    const checked = "true"; // true for register page
  
    res.render("login", { checked: checked }); // Render the EJS template and pass the checked value
  }

// @desc Register a new user
// @route POST /users/register
// @access Public
  const handleRegisterUser = async (req, res) => {
    const { name, email1, password1, password2 } = req.body;
    let errors = [];
  
    // check if all field are empty
    if (!name || !email1 || !password1 || !password2) {
      errors.push({ msg: "all fields are required" });
    }
  
    // check password match
    if (password1 != password2) {
      errors.push({ msg: "password mismatch !" });
    }
  
    // check password length
  
    if (password1.length < 6) {
      errors.push({ msg: "password should be at lease 6 characters" });
    }
  
    if (errors.length > 0) {
      const checked = "true"; // true for register page
  
      res.render("login", {
        errors,
        name,
        email1,
        password1,
        password2,
        checked,
      });
    } else {
      try {
      // validation passed
      let user = await User.findOne({ email: email1 })
        if (user) {
          // user exists
          errors.push({ msg: "Email already registered !" });
  
          const checked = "true"; // true for register page
  
          res.render("login", {
            errors,
            name,
            email1,
            password1,
            password2,
            checked,
          });
        } else {
          const newUser = new User({
            name,
            email:email1,
            password:password1,
          });
          //Hash password
          
         let salt= await bcrypt.genSalt(10)
            let hash = await bcrypt.hash(newUser.password, salt)
              // set password to hashed
              newUser.password = hash

               let user = await newUser.save()
               if(user){
                req.flash('success_msg', `${user.name} registered successfully !`)
                res.redirect('login')
               }
              
        }
    }catch(err) {
      console.log(err);
    }
    }
  }

// @desc Logout User
// @route POST /users/logout
// @access Private
  const logoutUser =  (req,res)=>{
    // req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  }
module.exports = {
    loginUser,
    handleLoginUser,
    registerUser,
    handleRegisterUser,
    logoutUser
}