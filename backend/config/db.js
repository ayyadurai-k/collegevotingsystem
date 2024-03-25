import mongoose from "mongoose"

export const connectDatabase = ()=>{
    mongoose.connect(process.env.MONGO_DB_URI).then(()=>{
        console.log("Database Is Connected Successfully...!");
    }).catch(()=>{
        console.log("Database Connection Failed...!");
    })
}