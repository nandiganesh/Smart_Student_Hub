import  {Router} from 'express';
import { loginUser, registerUser } from '../controllers/user.controller.js';
import { logoutUser, getCurrentUser, getUserPoints } from '../controllers/user.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';
 const router = Router();
 router.route("/register").post(registerUser);
 router.route("/login").post(loginUser);
 //secure routes
 router.route("/logout").post(verifyJWT,logoutUser);
 router.route("/me").get(verifyJWT,getCurrentUser);
 router.route("/points").get(verifyJWT,getUserPoints);

 export default router;