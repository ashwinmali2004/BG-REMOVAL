import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { assets, plans } from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';

const BuyCredit = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const location = useLocation();

    // Function to initiate Stripe payment
    const paymentStripe = async (planId) => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage

            const response = await axios.post(
                `${backendUrl}/api/order/stripe`,
                { planId, userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                window.location.href = response.data.session_url;
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Payment initiation failed');
        }
    };

    // Function to verify payment success
    const verifyPayment = async (orderId, success) => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            const response = await axios.post(
                `${backendUrl}/api/order/verifyStripe`,
                { orderId, success, userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('Credits have been added to your account!');
                navigate('/'); // Redirect to home after success
            } else {
                toast.error('Payment failed or was cancelled.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Payment verification failed.');
        }
    };

    // Effect to check for payment verification on component mount
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const success = query.get('success');
        const orderId = query.get('orderId');

        if (success && orderId) {
            verifyPayment(orderId, success);
        }
    }, [location.search]);

    return (
        <div className='min-h-[80vh] text-center pt-14 mb-10'>
            <button className='border border-gray-400 px-10 py-2 rounded-full mb-6'>Our Plans</button>
            <h1 className='text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent mb-6 sm:mb-10'>
                Choose the plan that's right for you
            </h1>
            <div className='flex flex-wrap justify-center gap-6 text-left'>
                {plans.map((item, index) => (
                    <div className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-700 hover:scale-105 transition-all duration-500' key={index}>
                        <img width={40} src={assets.logo_icon} alt="" />
                        <p className='mt-3 font-semibold'>{item.id}</p>
                        <p className='text-sm'>{item.desc}</p>
                        <p className='mt-6'>
                            <span className='text-3xl font-medium'>${item.price}</span> / {item.credits} credits
                        </p>
                        <button onClick={() => paymentStripe(item.id)} className='w-full hover:bg-gray-900 bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52'>
                            Purchase
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuyCredit;
