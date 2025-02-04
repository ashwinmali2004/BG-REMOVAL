import transactionModel from '../models/transactionModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';

// Global Variable
const currency = 'USD';

// Gateway
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing Order Using Stripe
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, planId } = req.body;
        const { origin } = req.headers;

        const userData = await userModel.findById(userId);
        if (!userData || !planId) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials' });
        }

        const plans = {
            'Basic': { credits: 100, amount: 10 },
            'Advanced': { credits: 500, amount: 50 },
            'Business': { credits: 5000, amount: 250 }
        };

        if (!plans[planId]) {
            return res.status(400).json({ success: false, message: 'Invalid Plan Selected' });
        }

        const { credits, amount } = plans[planId];

        const transaction = await transactionModel.create({
            userId,
            plan: planId,
            amount,
            credits,
            date: Date.now(),
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${origin}/verify?success=true&orderId=${transaction._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${transaction._id}`,
            line_items: [{
                price_data: {
                    currency,
                    product_data: { name: planId },
                    unit_amount: amount * 100,
                },
                quantity: 1,
            }],
            metadata: {
                transactionId: transaction._id.toString(),
                userId: userId.toString(),
            },
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify Stripe Payment
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;

    try {
        if (success === "true") {
            // Find the transaction and update it to reflect payment status
            const transaction = await transactionModel.findById(orderId);
            if (!transaction) {
                return res.status(404).json({ success: false, message: 'Transaction not found' });
            }

            // Add credits to the user's balance
            const userData = await userModel.findById(userId);
            if (!userData) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const newCreditBalance = userData.creditBalance + transaction.credits;
            console.log('Current Credit Balance:', userData.creditBalance);
            console.log('Credits to Add:', transaction.credits);

            // Update user balance and get the updated user object
            const updatedUser = await userModel.findByIdAndUpdate(
                userData._id,
                { creditBalance: newCreditBalance },
                { new: true }
            );
            console.log('Updated User:', updatedUser);

            // Update the transaction to mark the payment as successful
            await transactionModel.findByIdAndUpdate(orderId, { payment: true });

            res.json({ success: true, message: 'Credits Added' });
        } else {
            // If payment failed or was cancelled, remove the transaction
            await transactionModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: 'Payment failed or was cancelled' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


export { placeOrderStripe, verifyStripe };
