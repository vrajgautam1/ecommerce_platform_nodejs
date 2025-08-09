const express = require("express")
const app = express()
const mainRouter = require("./src/routers/index")
const path = require("path")

app.use(express.urlencoded({extended:true}))
app.use(express.json)
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")))

app.use(mainRouter)


const port = process.env.PORT || 3000
app.listen(port, (err)=>{
    if(!err){
        console.log("server is running", "http://localhost:"+port)
    }
})