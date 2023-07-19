const express = require('express')
const router = express.Router()
const {ensureAuthenticated} = require('../config/auth')
const {dashboard, welcome,show} = require('../controllers/homeController')

// Welcome Page 
router.get('/', welcome)
// Dashboard

router.get('/dashboard',ensureAuthenticated,dashboard)
router.get('/show',ensureAuthenticated,show)


module.exports = router