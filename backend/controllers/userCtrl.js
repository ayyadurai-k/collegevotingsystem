import User from "../models/userMdl.js";
import asyncError from "../utils/asyncError.js";
import sendResponse from "../utils/sendResponse.js";

export const createUser = asyncError(async(req,res,next)=>{
    const user = await User.create(req.body)
    sendResponse(res,201,"User Created Successfully....!",user);
})


