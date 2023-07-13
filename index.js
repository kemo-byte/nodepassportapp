const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')


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


// Routes
app.use(express.static('./public'))
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))


app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})