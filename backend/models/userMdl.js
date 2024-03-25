import { Schema,model } from "mongoose";


const userSchema = new Schema({
    name : {
        type : String,
        required : [true,"Name Is Required...!"]
    },
    regno : {
        type : String,
        required : [true,"RegNo Is Required...!"]
    },
    email : {
        type : String,
        required : [true,"Email Is Required...!"]
    },
    gender : {
        type : String,
        required : [true,"Gender Is Required...!"]
    },
    class : {
        type : String,
        required : [true,"Class Is Required...!"]
    },
    otp:{
        num : {
            type : String
        },
        expiresTime : {
            type : Date
        }
    }
})


const User = model("user",userSchema)
export default User