import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { removeBg } = useContext(AuthContext); // Make sure removeBg is available here
  const navigate = useNavigate();

  // Prevent file selection if the user is not logged in
  const handleUploadClick = (e) => {
    const token = localStorage.getItem('token');
    if (!token) {
      e.preventDefault();
      navigate('/login'); // Redirect to login page
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // console.log(file);
    if (file) {
      removeBg(file); // Call removeBg here instead of handleImageUpload
    }
  };

  return (
    <div className='flex items-center justify-between max-sm:flex-col-reverse gap-y-10 px-4 mt-10 lg:px-44 sm:mt-20'>
      
      {/* Left Side */}
      <div>
        <h1 className='text-4xl xl:text-5xl 2xl:text-6xl font-bold text-neutral-700 leading-tight'>
          Remove the <br className='max-md:hidden' />
          <span className='bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent'>
            background
          </span>{' '}

          from <br className='max-md:hidden' /> images for free.
        </h1>
        <p className='my-6 text-[15px] text-gray-500'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. <br className='max-sm:hidden' />
          Ut possimus maiores itaque numquam eligendi?
        </p>

        {/* Upload Button */}
        <div>
          <input 
            type="file" 
            accept="image/*" 
            id="upload1" 
            hidden 
            onClick={handleUploadClick} 
            onChange={handleFileChange} 
          />
          <label 
            className='inline-flex gap-3 px-8 py-3.5 rounded-full cursor-pointer bg-gradient-to-r from-violet-600 to-fuchsia-500 m-auto hover:to-fuchsia-700 hover:scale-105 transition-all duration-700' 
            htmlFor="upload1"
          >
            <img width={20} src={assets.upload_btn_icon} alt="Upload Icon" />
            <p className='text-white text-sm'>Upload your image</p>
          </label>
        </div>
      </div>

      {/* Right Side */}
      <div className='w-full max-w-md'>
        <img src={assets.header_img} alt="Header" />
      </div>
      
    </div>
  );
};

export default Header;
