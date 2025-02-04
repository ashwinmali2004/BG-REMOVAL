import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const VerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const success = query.get('success');
    const orderId = query.get('orderId');

    if (success && orderId) {
      verifyPayment(orderId, success);
    } else {
      toast.error('Invalid payment response.');
      navigate('/'); // Redirect to home page if invalid
    }
  }, [location.search, navigate]);

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
        navigate('/'); // Redirect to home on failure
      }
    } catch (error) {
      toast.error('Payment verification failed.');
      navigate('/'); // Redirect to home on error
    }
  };

  return (
    <div className="min-h-[80vh] text-center pt-14 mb-10">
      <h1 className="text-2xl">Verifying your payment...</h1>
    </div>
  );
};

export default VerifyPage;
