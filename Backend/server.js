const dotenv=require('dotenv');

const mongoose=require("mongoose");

process.on("uncaughtException" ,(err)=>
{
    console.log("Uncaught Expection");
    console.log(err.name,err.message);
    process.exit(1);
})

dotenv.config({path:"./config.env"});

const app=require("./app");


mongoose.connect(process.env.DB).then(()=>{
    console.log("Db id connected");
})
.catch((err)=>console.log(err));

const port=process.env.PORT || 3000;

const server=app.listen(port,()=>{
    console.log(`App on port http://localhost:${port}`);
});

process.on('unhandledRejection',(err)=>{
    console.log("Unhandle rejection");
    console.log(err.name,err.message);
    server.close(()=>
    {
        process.exit(1);
    });
});