import express from 'express';
import Authenticate from '../Middleware/Authenticate.js';
import UserController from "../Controllers/UserController.js";



const router = express.Router();


/*################### Auth Routes ############################*/
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', Authenticate.userAuthenticate, UserController.logout);
router.post('/hardlogout', Authenticate.userAuthenticate, UserController.hardlogout);
router.post('/forgetPassword', UserController.forgetPassword);
router.post('/otpVerification', UserController.otpVerification);
router.post('/resetPassword', UserController.resetPassword);


export default router;

