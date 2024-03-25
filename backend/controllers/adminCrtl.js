import Admin from "../models/adminMdl.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import asyncError from "../utils/asyncError.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import sendResponse from "../utils/sendResponse.js";
import sendToken from "../utils/sendToken.js";
import { checkEmpty } from "../utils/validate.js";

export const createAdmin = asyncError(async(req,res,next)=>{
    const {password} = req.body;
    const hashedPassword = await hashPassword(password)
    const admin = await Admin.create({...req.body,password:hashedPassword})
    return sendResponse(res,201,"User Created Successfully....!",admin);
})

export const loginAdmin = asyncError(async(req,res,next)=>{
    const {email , password} = req.body;
    const admin = await Admin.findOne({email})
    if (checkEmpty([email, password])) {
        return next(new ErrorHandler("All Fields Are Must Required....!", 400))
    }
    
    if(!admin){
        return next(new ErrorHandler("Invalid Credentials...!",400))
    }
    if(! await comparePassword(password,admin.password)){
        return next(new ErrorHandler("Invalid Credentials...!",400))
    }
    return sendToken(res,"adminToken",admin)
})

export const logoutAdmin = asyncError(async (req, res, next) => {
    res.cookie('adminToken', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
        .status(200)
        .json({
            success: true,
            message: "Admin Logged Out Successfully...!"
        })
})