import express from 'express';
import { loginUser, registerUser, getUserProfile, userCredits } from '../controllers/userController.js';
import authUser from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', getUserProfile);  // New route to fetch user profile
userRouter.get('/credits', authUser, userCredits)

export default userRouter;
