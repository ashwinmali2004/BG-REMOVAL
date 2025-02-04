import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Navbar = () => {
  const { isLoggedIn, userData, handleLogout } = useContext(AuthContext);  // Use context
  const [dropdownOpen, setDropdownOpen] = useState(false);  // State to toggle dropdown visibility on hover
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-between mx-4 py-3 lg:mx-44'>
      <Link to='/'><img className='w-32 sm:w-44' src={assets.logo} alt="Logo" /></Link>

      {isLoggedIn ? (
        <div className='flex items-center gap-2 sm:gap-3'>
          <button onClick={() => navigate('/buy')} className='flex items-center gap-2 bg-blue-100 px-4 sm:px-7 py-1.5 sm:py-2.5 rounded-full hover:scale-105 transition-all duration-700'>
            <img className='w-5' src={assets.credit_icon} alt="" />
            <p className='text-xs sm:text-sm font-medium text-gray-600'>Credits: {userData?.credits || 0}</p>
          </button>

          {/* Show Name on Larger Screens, and move it to dropdown only for small screens (<400px) */}
          <div className="hidden sm:block">
            {userData && userData.name && (
              <p className="text-sm font-medium text-gray-600">Hi, {userData.name}</p>
            )}
          </div>

          <div
            className="relative flex items-center cursor-pointer"
            onMouseEnter={() => setDropdownOpen(true)} // Show dropdown on hover
            onMouseLeave={() => setDropdownOpen(false)} // Hide dropdown when hover ends
          >
            <img className="w-10 h-10 rounded-full" src={assets.profile_icon} alt="Profile" />

            {/* Dropdown Menu */}
            {dropdownOpen && userData && (
              <div className='pt-10'>
                <div className="absolute right-0 pt-4 w-48 sm:w-56 bg-slate-100 text-gray-500 rounded-lg shadow-lg z-10">
                  <div className="flex flex-col gap-1 py-2 px-5">
                    
                    {/* Display Name Only on Small Screens */}
                    {userData && userData.name && (
                      <div className="block sm:hidden mb-2">
                        <p className="text-sm font-medium text-gray-600">Hi, {userData.name}</p>
                      </div>
                    )}

                    {/* Home and Upgrade Buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => navigate('/')}
                        className="text-white bg-gradient-to-r from-blue-300 to-blue-500 hover:from-blue-500 hover:to-blue-700 hover:scale-105 py-1 px-3 rounded-md text-sm font-medium transition-all duration-200"
                      >
                        Home
                      </button>
                      <button
                        onClick={() => navigate('/buy')}
                        className="text-white bg-gradient-to-r from-blue-300 to-blue-500 hover:from-blue-500 hover:to-blue-700 hover:scale-105 py-1 px-3 rounded-md text-sm font-medium transition-all duration-200"
                      >
                        Upgrade
                      </button>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-white bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:to-fuchsia-700 hover:scale-105 py-1 px-3 rounded-md text-sm font-medium transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className='bg-zinc-800 text-white flex items-center gap-4 px-4 py-2 sm:px-8 sm:py-3 text-sm rounded-full'
        >
          Get Started <img className='w-3 sm:w-4' src={assets.arrow_icon} alt="Arrow" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
