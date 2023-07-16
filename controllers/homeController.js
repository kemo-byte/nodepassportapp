const dashboard = (req,res)=> {
   
    res.render('dashboard',{name:req.user.name})

}
const welcome = (req,res)=> res.render('welcome')

module.exports = {dashboard, welcome}