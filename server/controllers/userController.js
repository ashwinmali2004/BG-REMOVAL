import { Webhook } from 'svix';
import User from '../models/userModel.js';

/**
 * Controller function to handle Clerk webhook events
 * Manages user data synchronization between Clerk and local database
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export const clerkWebhooks = async (req, res) => {
  try {
    // Extract webhook headers
    const webhookHeaders = {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    };

    // Validate required headers
    if (!webhookHeaders['svix-id'] || !webhookHeaders['svix-timestamp'] || !webhookHeaders['svix-signature']) {
      throw new Error('Missing required Svix headers');
    }

    // Initialize webhook with secret
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');
    
    // Verify webhook signature
    const payload = JSON.stringify(req.body);
    webhook.verify(payload, webhookHeaders);

    const { data, type } = req.body;

    // Prepare common user data structure
    const userData = {
      clerkId: data.id,
      email: data.email_addresses[0]?.email_address,
      firstName: data.first_name,
      lastName: data.last_name,
      photo: data.image_url,
    };

    // Handle different webhook events
    switch (type) {
      case 'user.created': {
        await User.create(userData);
        console.log(`User created: ${data.id}`);
        break;
      }

      case 'user.updated': {
        const updatedUser = await User.findOneAndUpdate(
          { clerkId: data.id },
          userData,
          { new: true }
        );
        
        if (!updatedUser) {
          throw new Error(`User not found for update: ${data.id}`);
        }
        
        console.log(`User updated: ${data.id}`);
        break;
      }

      case 'user.deleted': {
        const deletedUser = await User.findOneAndDelete({ clerkId: data.id });
        
        if (!deletedUser) {
          throw new Error(`User not found for deletion: ${data.id}`);
        }
        
        console.log(`User deleted: ${data.id}`);
        break;
      }

      default: {
        console.warn(`Unhandled webhook event type: ${type}`);
        return res.status(400).json({
          success: false,
          message: `Unhandled webhook event type: ${type}`,
        });
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook Error:', error.message || 'Unknown error');
    
    return res.status(400).json({
      success: false,
      message: error.message || 'Unknown error occurred',
    });
  }
};