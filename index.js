const express = require("express")
const app = express()
const mainRouter = require("./src/routers/index")

app.use(express.urlencoded({extended:true}))
app.use(express.json)

app.use(mainRouter)


const port = process.env.PORT || 3000
app.listen(port, (err)=>{
    if(!err){
        console.log("server is running", "http://localhost:"+port)
    }
})