const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')

const app = express()
const PORT = process.env.PORT || 5000

// DB config 

const db = require('./config/keys').MongoURI

// connect to MongoDB 
mongoose.connect(db,{useNewUrlParser:true})
.then(()=>console.log('MongoDB connected...'))
.catch((err)=>console.log(err))

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

// connect flash
app.use(flash())

// Global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
})
// Routes
app.use(express.static('./public'))
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))


app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})