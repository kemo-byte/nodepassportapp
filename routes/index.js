const express = require('express')
const router = express.Router()
const {ensureAuthenticated} = require('../config/auth')
const {dashboard, welcome} = require('../controllers/homeController')

// Welcome Page 
router.get('/', welcome)
// Dashboard

router.get('/dashboard',ensureAuthenticated,dashboard)


module.exports = router