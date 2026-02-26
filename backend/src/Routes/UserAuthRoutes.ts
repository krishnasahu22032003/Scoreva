import express from "express";
import { GetUserDetails, UserSignIn, UserSignOut, UserSignUp } from "../Controllers/UserAuthController.js";
import { AuthMiddleware } from "../Middlewares/AuthMiddleware.js";
import { AdminSignUp } from "../Controllers/AdminAuthController.js";
import { AdminMiddleware } from "../Middlewares/AdminMiddleware.js";

const UserRouter = express.Router();

UserRouter.post("/signup",UserSignUp);
UserRouter.post("/signin",UserSignIn);
UserRouter.post("/admin/signup",AdminSignUp)
UserRouter.post("/signout",AuthMiddleware,AdminMiddleware,UserSignOut);
UserRouter.get("/user-details",AuthMiddleware,AdminMiddleware,GetUserDetails);

export default UserRouter;
