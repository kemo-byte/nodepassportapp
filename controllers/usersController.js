const passport = require('passport')
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const loginUser = (req, res) => {
    const checked = "false"; //  false for login page
  
    res.render("login", { checked: checked }); // Render the EJS template and pass the checked value
  }
const handleLoginUser = (req, res, next) => {
    passport.authenticate('local',{
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  }
const registerUser = (req, res) => {
    const checked = "true"; // true for register page
  
    res.render("login", { checked: checked }); // Render the EJS template and pass the checked value
  }

  const handleRegisterUser = (req, res) => {
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
      // validation passed
      User.findOne({ email: email1 }).then((user) => {
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
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err
              // set password to hashed
              newUser.password = hash
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are successfully registered !')
                  res.redirect('login')
                })
                .catch(err => console.log(err))
            })
          )
        }
      });
    }
  }

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