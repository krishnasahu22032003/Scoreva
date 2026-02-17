import express from "express";

const app = express();

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("ws project")
})


app.listen(3000 , ()=>{
    console.log("App running on port 3000")
})