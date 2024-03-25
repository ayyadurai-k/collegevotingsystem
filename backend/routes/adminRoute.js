import express from "express"
import { createAdmin, loginAdmin, logoutAdmin } from "../controllers/adminCrtl.js";
import { isAuthenticatedAdmin } from "../middlewares/authenticate.js";

const adminRouter = express.Router()


adminRouter.post("/create",createAdmin)
adminRouter.post("/login",loginAdmin)
adminRouter.post("/logout",isAuthenticatedAdmin,logoutAdmin)



export default adminRouter;