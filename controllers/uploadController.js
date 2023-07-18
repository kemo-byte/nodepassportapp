const multer = require('multer')
const path = require('path')
const uploadModel = require('../models/Upload')

// Set Storage Engine 
const storage = multer.diskStorage({
    destination:'./public/uploads/',
    filename: (req, file, cb) =>{
        cb(null, file.fieldname+'-'+Date.now()+ path.extname(file.originalname))
    }
  })
  
  
  // Init upload
  const upload = multer({
    storage: storage,
    limits:{fileSize:4000000},
    fileFilter: (req, file, cb) =>{
      checkFileType(file, cb)
    }
  }).single('myImage')
  
  // check file type
  let checkFileType = (file, cb) =>{
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // check extensions
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    if(mimetype && extname) {
      return cb(null, true)
    } else {
    cb('Error: Images only!')
    }
  }

  
const uploadImage = (req, res)=>{
    let errors = [];
  
    upload(req, res, async (err)=>{
      if(err) {
        errors.push({msg:err})
        res.render('dashboard',{
          errors
        })
      } else {
        if(req.file == undefined) {
          errors.push({msg:"Error: No File Selected!"})
        res.render('dashboard',{
          errors
        })
        } else {

          await uploadModel.create({
            name:req.file.filename,
            user:req.user.id
        })
        let query= {user:req.user.id},
       photos = await uploadModel.find(query).sort({_id:-1})
          res.render('dashboard',{
            msg:"File Uploaded!",
            file: `/uploads/${req.file.filename}`,
            photos:photos,
            user:req.user
          })
        }
      }
    })
  }

  module.exports  = {
    uploadImage
  }