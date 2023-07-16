const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')


const app = express()
const PORT = process.env.PORT || 5000



// passport config
require('./config/passport')(passport)
// DB config 

const db = require('./config/keys').MongoURI

const mdb = (async()=>{
// connect to MongoDB 
return  await mongoose.connect(db,{useNewUrlParser:true})

})();
// EJS

app.use(expressLayouts)
app.set('view engine','ejs')

// Body parser
app.use(express.urlencoded({extended:false}))

// Express Session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))
// passport middleware 
app.use(passport.initialize())
app.use(passport.session())
// connect flash
app.use(flash())

// Global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error= req.flash('error')
    next()
})
// Routes
app.use(express.static('./public'))
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))


app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})