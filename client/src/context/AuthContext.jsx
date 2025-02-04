import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [creditBalance, setCreditBalance] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      axios
        .get(`${backendUrl}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUserData(res.data);
          setCreditBalance(res.data.creditBalance);
        })
        .catch((err) => console.error('Error fetching user data:', err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
    navigate('/login');
  };

  const removeBg = async (selectedImage) => {
    try {
      if (!selectedImage) {
        toast.error('Please select an image');
        return;
      }
      setImage(selectedImage);
      setResultImage(null);

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('User not authenticated');
        navigate('/login');
        return;
      }

      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('id', userData?._id);

      const { data } = await axios.post(`${backendUrl}/api/image/remove-bg`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setResultImage(data.resultImage);
        setCreditBalance(data.creditBalance);
        navigate('/result');
      } else {
        toast.error(data.message);
        if (data.creditBalance === 0) {
          navigate('/buy');
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStripePayment = async (amount) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('User not authenticated');
        navigate('/login');
        return;
      }

      const { data } = await axios.post(`${backendUrl}/api/order/stripe`, {
        amount,
        userId: userData?._id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe checkout
      } else {
        toast.error('Failed to initiate payment');
      }
    } catch (error) {
      toast.error('Payment error: ' + error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        removeBg,
        handleStripePayment,
        isLoggedIn,
        userData,
        handleLogout,
        image,
        resultImage,
        creditBalance,
        backendUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
