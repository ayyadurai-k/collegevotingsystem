import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import asyncError from "../utils/asyncError.js";
import { validateId } from "../utils/validate.js";
import Admin from "../models/adminMdl.js";

export const isAuthenticatedAdmin = asyncError(async (req, res, next) => {

    //GET TOKEN FROM "cookies"
    const { adminToken } = req.cookies;
    if (!adminToken) {
        return next(new ErrorHandler('Login first to handle this resource...!', 401))
    }

    jwt.verify(
        adminToken,
        process.env.ACCESS_TOKEN_SECRET,
        async (error, decoded) => {
            if (error) {
                return next(new ErrorHandler('Login first , Invalid Token...!', 401))
            }
            if (decoded) {
                if (!validateId(decoded._id)) return next(new ErrorHandler('Login first , Invalid Token...!', 401))
                const admin = await Admin.findById(decoded._id)
                if (!admin) return next(new ErrorHandler('Login first , Invalid Token...!', 401))
                req.admin = admin
                next();
            }
        }
    );

})