import express from 'express';
import { placeOrderStripe, verifyStripe } from '../controllers/orderController.js';
import authUser from '../middlewares/auth.js';

const orderRouter = express.Router();

orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/verifyStripe', verifyStripe)

export default orderRouter;
