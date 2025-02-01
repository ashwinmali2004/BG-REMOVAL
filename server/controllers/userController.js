import express from 'express';
import { Webhook } from 'svix';
import User from '../models/userModel.js';

export const clerkWebhooks = async (req, res) => {
  // Add raw body parsing
  const rawBody = req.rawBody; // You'll need to set this up in your express config
  
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!WEBHOOK_SECRET) {
      throw new Error('Missing Clerk webhook secret');
    }

    // Get the headers
    const svix_id = req.headers['svix-id'];
    const svix_timestamp = req.headers['svix-timestamp'];
    const svix_signature = req.headers['svix-signature'];

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required Svix headers'
      });
    }

    // Create webhook instance
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;
    try {
      evt = wh.verify(rawBody, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return res.status(400).json({
        success: false,
        message: 'Webhook verification failed'
      });
    }

    const { type, data } = evt;

    // Prepare user data
    const userData = {
      clerkId: data.id,
      email: data.email_addresses?.[0]?.email_address,
      firstName: data.first_name,
      lastName: data.last_name,
      photo: data.image_url,
    };

    // Handle events
    switch (type) {
      case 'user.created':
        await User.create(userData);
        break;

      case 'user.updated':
        await User.findOneAndUpdate(
          { clerkId: data.id },
          userData,
          { new: true, runValidators: true }
        );
        break;

      case 'user.deleted':
        await User.findOneAndDelete({ clerkId: data.id });
        break;

      default:
        console.log(`Unhandled event type: ${type}`);
    }

    res.status(200).json({
      success: true,
      message: `Webhook handled: ${type}`
    });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};