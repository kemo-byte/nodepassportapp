const uploadModel = require('../models/Upload')


const dashboard = async (req,res)=> {
    let query= {user:req.user.id},
    photos = await uploadModel.find(query).sort({_id:-1})
    res.render('dashboard',{user:req.user,photos})

}
const welcome = (req,res)=> res.render('welcome')

module.exports = {dashboard, welcome}