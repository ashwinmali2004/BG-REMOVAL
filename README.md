# Background Removal App - Full Stack AI SaaS

## Overview
**Full Stack AI SaaS Application** using **MongoDB, Express, React, and Node.js (MERN Stack)**.

This application is a **Background Removal App** that allows users to upload an image. The app will process the image using AI to remove the background, and users can then download the image with a transparent background.

## Features
- **AI-powered background removal** for uploaded images.
- **Personal authentication system** (No Clerk, custom user authentication implemented).
- **Credit-based system** for processing images.
- **Online payment integration** for purchasing more credits.
- **Modern UI with React & TailwindCSS**.
- **Secure backend using Node.js, Express, and MongoDB**.

## Tech Stack
- **Frontend**: React.js, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: Custom authentication system (No Clerk used)
- **Deployment**: Vercel (Frontend), Vercel (Backend)
- **AI Processing**: Integrated AI model for background removal
- **Payment Integration**: Stripe (for purchasing credits)

## Setup Instructions
### 1. Clone the Repository
```sh
git clone https://github.com/your-username/bg-removal-app.git
cd bg-removal-app
```

### 2. Install Dependencies
#### Install for Frontend
```sh
cd client
npm install
```

#### Install for Backend
```sh
cd server
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `server` directory and add:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 4. Run the Application
#### Start the Backend
```sh
cd server
npm start
```

#### Start the Frontend
```sh
cd client
npm start
```

### 5. Deploy to Vercel
#### Deploy Frontend
```sh
cd client
vercel --prod
```

#### Deploy Backend
```sh
cd server
vercel --prod
```

## Usage
1. Sign up or log in using the **custom authentication system**.
2. Upload an image to remove the background.
3. Use credits to process the image.
4. Download the image with a transparent background.
5. Purchase more credits if needed.

## Contribution
Feel free to contribute! Fork the repo and submit a pull request.

## License
This project is licensed under the MIT License.

