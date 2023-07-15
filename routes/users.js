const bcrypt = require("bcryptjs");
const express = require("express");
const passport = require('passport')
const multer = require('multer')
const path = require('path')

const router = express.Router();
const User = require("../models/User");


// Set Storage Engine 
const storage = multer.diskStorage({
  destination:'./public/uploads/',
  filename: function(req, file, cb) {
      cb(null, file.fieldname+'-'+Date.now()+ path.extname(file.originalname))
  }
})


// Init upload
const upload = multer({
  storage: storage,
  limits:{fileSize:4000000},
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb)
  }
}).single('myImage')

// check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // check extensions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)
  if(mimetype && extname) {
    return cb(null, true)
  } else {
  cb('Error: Images only!')
  }
}



// login page
router.get("/login", (req, res) => {
  const checked = "false"; //  false for login page

  res.render("login", { checked: checked }); // Render the EJS template and pass the checked value
});
// login handle
router.post("/login", (req, res, next) => {
  passport.authenticate('local',{
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// router.post('/login', 
//       passport.authenticate('local', { failureFlash: true,failureRedirect: '/users/login' }),
//       function(req, res) {
//         res.redirect('/dashboard');
//     });

// register page
router.get("/register", (req, res) => {
  const checked = "true"; // true for register page

  res.render("login", { checked: checked }); // Render the EJS template and pass the checked value
});
// register handle
router.post("/register", (req, res) => {
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
});

// upload handle

router.post('/upload',(req, res)=>{
  let errors = [];

  upload(req, res, (err)=>{
    if(err) {
      errors.push({msg:err})
      res.render('welcome',{
        errors
      })
    } else {
      if(req.file == undefined) {
        errors.push({msg:"Error: No File Selected!"})
      res.render('welcome',{
        errors
      })
      } else {

        res.render('welcome',{
          msg:"File Uploaded!",
          file: `/uploads/${req.file.filename}`
        })
      }
    }
  })
})
// Logout Handle 
router.get('/logout', (req,res)=>{
  // req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
})
module.exports = router;
