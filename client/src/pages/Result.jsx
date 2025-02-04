import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; 

const Result = () => {
  const { image, resultImage } = useContext(AuthContext);
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image); // Create a temporary URL for the selected file
      setImageUrl(url);
    }
  }, [image]);

  // Function to handle navigation when "Try another image" is clicked
  const handleTryAnotherImage = () => {
    setImageUrl('');  // Reset the image URL
    navigate('/');     // Navigate to the home page ("/")
  };

  return (
    <div className='mx-4 my-3 lg:mx-44 mt-14 min-h-[75vh]'>
      <div className='bg-white rounded-lg px-8 py-6 drop-shadow-sm'>
        {/* Image Container */}
        <div className='flex flex-col sm:grid grid-cols-2 gap-8'>
          {/* Left Side */}
          <div>
            <p className='font-semibold text-gray-600 mb-2'>Original</p>
            {imageUrl ? (
              <img className='rounded-md border' src={imageUrl} alt="Original" />
            ) : (
              <p className="text-red-500">No image selected</p>
            )}
          </div>

          {/* Right Side */}
          <div className='flex flex-col'>
            <p className='font-semibold text-gray-600 mb-2'>Background Removed</p>
            <div className='rounded-md border border-gray-300 h-full relative bg-layer overflow-hidden'>
              {resultImage ? (
                <img src={resultImage} alt="Background Removed" />
              ) : (
                image && (
                  <div className='absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2'>
                    <div className='border-4 border-violet-600 rounded-full h-12 w-12 border-t-transparent animate-spin'></div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        {resultImage && (
          <div className='flex justify-center sm:justify-end items-center flex-wrap gap-4 mt-6'>
            <button
              className='px-8 py-2.5 text-violet-600 text-sm border border-violet-600 rounded-full hover:scale-105 transition-all duration-700'
              onClick={handleTryAnotherImage} // Call the navigation function on button click
            >
              Try another image
            </button>
            <a
              href={resultImage}
              download
              className='px-8 py-2.5 text-white text-sm bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full cursor-pointer hover:scale-105 transition-all duration-700'
            >
              Download image
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
