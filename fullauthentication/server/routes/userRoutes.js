import { Router } from "express";
import userAuth from "../middleware/userauth.js";
import { getuserdata } from "../controllers/usercontroller.js";

const userRouter=Router();

userRouter.get('/data',userAuth,getuserdata);

export default userRouter;