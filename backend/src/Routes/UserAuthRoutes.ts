import express from "express";
import { GetUserDetails, UserSignIn, UserSignOut, UserSignUp } from "../Controllers/UserAuthController.js";

const UserRouter = express.Router();

UserRouter.post("/signup",UserSignUp);
UserRouter.post("/signin",UserSignIn);
UserRouter.post("/signout",UserSignOut);
UserRouter.get("/user-details",GetUserDetails);

export default UserRouter;
