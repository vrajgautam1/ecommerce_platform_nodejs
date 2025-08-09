const multer = require("multer");
const path = require("path")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"))  //where to store
  },
  filename: function (req, file, cb) {
    const{id} = req.user
    const sanitized = file.originalname.replace(/\s+/g, '-')
    cb(null, id+"-"+Date.now() + "-" + path.basename(sanitized));  //what will be the name of the files
  }
})

function fileFilter(req, file, cb){
    const allowedTypes = [".jpeg", ".jpg", ".png"]
    const ext = path.extname(file.originalname).toLowerCase()
    if(!allowedTypes.includes(ext)){
        return cb(new Error("only jpg, jpeg, and png images are allowed "))
    }
}

const upload = multer({ 
    storage: storage,
    limits:{
    files: 5,
    fileSize: 5*1024*1024
    },
    fileFilter
})
.fields([
    {name: "displayImage", maxCount:1},
    {name: "productImages", maxCount:10}
]) //single chhe ke array chhe? su naam apvanu chhe "image", "images", "files", "etc"

function uploadsMiddleware(req, res, next){
    upload(req, res, function(err){

        if(err instanceof multer.MulterError){
            if(err.code === "LIMIT_FILE_COUNT"){
                return res.status(400).json({error:"cant upload more than 5 images"})
            }

            if(err.code === "LIMIT_FILE_SIZE"){
                return res.status(400).json({error: "cant upload image larger than 5mb"})
            }

            return res.status(400).json({error: err.message})
        }else if(err instanceof Error){
            return res.status(400).json({error: err.message})
        }
        next()
    })

}

module.exports = uploadsMiddleware

