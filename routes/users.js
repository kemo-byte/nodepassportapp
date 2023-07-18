const express = require("express");
const {redirectIfAuthenticated} = require("../middlewares/redirectIfAuthenticated");


const router = express.Router();
const {loginUser, handleLoginUser, registerUser, handleRegisterUser, logoutUser} = require('../controllers/usersController')
const {uploadImage,removeImage} = require('../controllers/uploadController')





// login page
router.get("/login",redirectIfAuthenticated,loginUser);
// login handle
router.post("/login",handleLoginUser);


// register page
router.get("/register",redirectIfAuthenticated, registerUser);
// register handle
router.post("/register", handleRegisterUser);

// upload handle

router.post('/upload',uploadImage)
// remove upload

router.post('/upload/remove',removeImage)
// Logout Handle 
router.get('/logout',logoutUser)

module.exports = router;
