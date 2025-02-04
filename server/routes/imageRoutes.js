import express from 'express';
import { removeBgImage } from '../controllers/ImageController.js';
import upload from '../middlewares/multer.js';
import authUser from '../middlewares/auth.js';

const imageRouter = express.Router();

// Route to handle the background removal
imageRouter.post('/remove-bg', upload.single('image'), authUser, removeBgImage);

export default imageRouter;
