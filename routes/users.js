const bcrypt = require("bcryptjs");
const express = require("express");

const router = express.Router();
const User = require("../models/User");
// login page
router.get("/login", (req, res) => {
  const checked = "false"; //  false for login page

  res.render("login", { checked: checked }); // Render the EJS template and pass the checked value
});
// login handle
router.post("/login", (req, res) => {});
// register page
router.get("/register", (req, res) => {
  const checked = "true"; // true for register page

  res.render("login", { checked: checked }); // Render the EJS template and pass the checked value
});
// register handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // check if all field are empty
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "all fields are required" });
  }

  // check password match
  if (password != password2) {
    errors.push({ msg: "password mismatch !" });
  }

  // check password length

  if (password.length < 6) {
    errors.push({ msg: "password should be at lease 6 characters" });
  }

  if (errors.length > 0) {
    const checked = "true"; // true for register page

    res.render("login", {
      errors,
      name,
      email,
      password,
      password2,
      checked,
    });
  } else {
    // validation passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        // user exists
        errors.push({ msg: "Email already registered !" });

        const checked = "true"; // true for register page

        res.render("login", {
          errors,
          name,
          email,
          password,
          password2,
          checked,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });
        //Hash password
        bcrypt.genSalt(10,(err,salt)=>
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err) throw err
            // set password to hashed
            newUser.password = hash
            newUser.save()
            .then(user=>{
                res.redirect('login')
            })
            .catch(err=>console.log(err))
        })
        )
      }
    });
  }
});
module.exports = router;
