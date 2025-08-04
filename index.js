const express = require("express")
const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json)

const port = process.env.PORT || 3000
app.listen(port, (err)=>{
    if(!err){
        console.log("server is running", "http://localhost:"+port)
    }
})