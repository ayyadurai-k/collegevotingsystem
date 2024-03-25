import express from "express"
import { createUser } from "../controllers/userCtrl.js";

const authRouter = express.Router()


authRouter.post("/create",createUser)



export default authRouter;