const uploadModel = require('../models/Upload')


const dashboard = async (req,res)=> {
    let query= {user:req.user.id},
    photos = await uploadModel.find(query).sort({_id:-1})
    res.render('dashboard',{user:req.user,photos})

}


const show = async (req,res)=> {
    let query = req.query.id,
     photo = await uploadModel.find({_id:`${query}`}).sort({_id:-1})
    res.render('show',{photo})

}
const welcome = (req,res)=> res.render('welcome')

module.exports = {dashboard, welcome, show}