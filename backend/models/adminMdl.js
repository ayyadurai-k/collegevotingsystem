import { Schema,model } from "mongoose";


const adminSchema = new Schema({
    name : {
        type : String,
        required : [true,"Name Is Required...!"]
    },
    email : {
        type : String,
        required : [true,"Email Is Required...!"]
    },
    admin:{
        type:Boolean,
        default : true
    },
    password:{
        type:String,
        required:[true,"Password Is Required....!"]
    }
})


const Admin = model("admin",adminSchema)
export default Admin