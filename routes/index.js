const express = require('express')

const router = express.Router()

router.get('/',(req,res)=> {
    const user = {
        name:"kamal"
    }
    res.render('dashboard',{user})
})


module.exports = router