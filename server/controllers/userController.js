import { Webhook } from 'svix';
import userModel from '../models/userModel.js';

// API Controller Function to Manage Clerk with database
// Endpoint: http://localhost:4000/api/user/webhooks
const clerkWebhooks = async (req, res) => {
    try {
        // Verify the webhook using Svix Webhook with Clerk's secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const payload = JSON.stringify(req.body); // Parse body as string
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        // Verify the webhook signature
        whook.verify(payload, headers);

        const { data, type } = req.body;

        switch (type) {
            case "user.created": {
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0]?.email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url,
                };

                // Save user to the database
                await userModel.create(userData);
                console.log(`User created: ${data.id}`);
                break;
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0]?.email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url,
                };

                // Update user in the database
                await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
                console.log(`User updated: ${data.id}`);
                break;
            }

            case "user.deleted": {
                // Delete user from the database
                await userModel.findOneAndDelete({ clerkId: data.id });
                console.log(`User deleted: ${data.id}`);
                break;
            }

            default: {
                console.log(`Unhandled webhook event type: ${type}`);
                break;
            }
        }

        // Send a success response to the webhook
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Webhook Error:', error.message);
        // Send a failure response for debugging in webhook logs
        res.status(400).json({ success: false, message: error.message });
    }
};

export { clerkWebhooks };
