import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaHeart, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import { SunIcon, MoonIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useProducts } from "../contexts/ProductContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./LoginModal";


const Navbar = () => {
  const { user, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showMobileUserDropdown, setShowMobileUserDropdown] = useState(false);

  const handleLoginSignupClick = () => {
    if (!user) { // put not (!user) to show login modal if not logged in
      setIsLoginModalOpen(true);
    } else {
      navigate("/LoginPage");
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.theme === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const navigate = useNavigate();
  const { searchProducts, searchQuery, selectedCategory } = useProducts();
  const { wishlistItems } = useWishlist();
  const { getCartItemCount } = useCart();

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      root.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDark]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const category = formData.get('category');
    const query = formData.get('search');
    
    searchProducts(query, category);
    navigate('/search');
  };

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  const LoginSignupButton = (
      <div className="relative hidden md:block" onMouseEnter={() => setShowUserDropdown(true)} onMouseLeave={() => setShowUserDropdown(false)}>
        <button type="button" onClick={handleLoginSignupClick} aria-label="Login or Signup" className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300">
          {user ? <img src={user.avatar} alt="avatar" className="w-5 h-5 rounded-full object-cover border border-gray-300 dark:border-gray-700"/> : <FaUser className="w-5 h-5"/>}
          <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">{user ? user.name : "Login / Signup"}</span>
        </button>
        {user && showUserDropdown && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border z-50 p-4 flex flex-col items-center">
            <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border mb-2" />
            <div className="font-semibold mb-2 text-center">{user.name}</div>
            <button className="w-full flex items-center gap-2 px-4 py-2 mb-2 bg-blue-600 text-white rounded hover:bg-blue-700 justify-center" onClick={() => {setShowUserDropdown(false); navigate("/account");}}><FaCog/> Manage Account</button>
            <button className="w-full flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 justify-center" onClick={() => {logout(); setShowUserDropdown(false);}}><FaSignOutAlt/> Logout</button>
          </div>
        )}
      </div>
      
  );

  const MobileSignupButton = (
    <div>
      <button type="button" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 w-full" aria-label="Login or Signup" onClick={() => setShowMobileUserDropdown((prev) => !prev)}>
        <img src={user?.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-700"/>
        <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
          {user ? user.name : "Login / Signup"}
        </span>
      </button>
      {user && showMobileUserDropdown && (
        <div className="ml-8 mt-2 flex flex-col gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 justify-start" onClick={() => {setShowMobileUserDropdown(false); setIsOpen(false); navigate("/account");}}><FaCog/> Manage Account</button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 justify-start" onClick={() => {logout(); setShowMobileUserDropdown(false); setIsOpen(false);}}><FaSignOutAlt/> Logout</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-black text-2xl md:text-3xl text-gray-900 dark:text-white">
            MAYUR HAMSA
          </Link>

          {/* Search bar hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-xl mx-4">
            <div className="relative flex-1">
              <select 
                name="category"
                defaultValue={selectedCategory}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm focus:outline-none border-r pr-2"
              >
                <option value="all">All Categories</option>
                <option value="paintings">Paintings</option>
                <option value="incense-boxes">Incense Boxes</option>
                <option value="incense-holders">Incense Holders</option>
                <option value="pots">Pots</option>
                <option value="wall-alters">Wall Alters</option>
              </select>
              <input
                type="search"
                name="search"
                placeholder="Search Products..."
                defaultValue={searchQuery}
                className="w-full pl-36 pr-12 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                aria-label="Search"
              >
                <FaSearch className="w-5 h-5" />
              </button>
            </div>
          </form>

          {LoginSignupButton}

          <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

          <div className="flex items-center gap-7">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>
            <Link 
              to="/wishlist" 
              className="relative text-gray-900 dark:text-white hover:text-gray-600"
            >
              <FaHeart size={24} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link 
              to="/cart" 
              className="relative text-gray-900 dark:text-white hover:text-gray-600"
            >
              <FaShoppingCart size={24} />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {getCartItemCount()}
                </span>
              )}
            </Link>
            
            {/* Mobile menu button */}
            <button
              className="block md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-0.5 bg-gray-900 dark:bg-white mb-1.5" />
              <div className="w-6 h-0.5 bg-gray-900 dark:bg-white mb-1.5" />
              <div className="w-6 h-0.5 bg-gray-900 dark:bg-white" />
            </button>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/" className={({isActive}) => `${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-600 dark:hover:text-blue-400`}>
                Home
              </NavLink>
              <NavLink to="/products" className={({isActive}) => `${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-600 dark:hover:text-blue-400`}>
                Products
              </NavLink>
              <NavLink to="/about" className={({isActive}) => `${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-600 dark:hover:text-blue-400`}>
                About
              </NavLink>
              <NavLink to="/contact" className={({isActive}) => `${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-600 dark:hover:text-blue-400`}>
                Contact
              </NavLink>
            </div>
          </div>
        </div>

        {/* Mobile search - visible only on mobile */}
        <form onSubmit={handleSearch} className="lg:hidden mt-4">
          <div className="relative">
            <select 
              name="category"
              defaultValue={selectedCategory}
              className="w-full mb-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="paintings">Paintings</option>
              <option value="incense-boxes">Incense Boxes</option>
              <option value="incense-holders">Incense Holders</option>
              <option value="pots">Pots</option>
              <option value="wall-alters">Wall Alters</option>
            </select>
            <div className="relative">
              <input
                type="search"
                name="search"
                placeholder="Search Products..."
                defaultValue={searchQuery}
                className="w-full pl-4 pr-12 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                aria-label="Search"
              >
                <FaSearch className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsOpen(false)}>
          <div
            className={`fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg p-4 transition-transform duration-900 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-2xl font-bold"
              aria-label="Close menu"
            >
              ×
            </button>
            <div className="absolute right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg">
              <div className="p-4">
                <button onClick={toggleMenu} className="mb-4">
                  <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
                <div className="flex flex-col space-y-4">
                  <NavLink to="/" className={({isActive}) => `${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-600 dark:hover:text-blue-400`} onClick={toggleMenu}>
                    Home
                  </NavLink>
                  <NavLink to="/products" className={({isActive}) => `${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-600 dark:hover:text-blue-400`} onClick={toggleMenu}>
                    Products
                  </NavLink>
                  <NavLink to="/about" className={({isActive}) => `${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-600 dark:hover:text-blue-400`} onClick={toggleMenu}>
                    About
                  </NavLink>
                  <NavLink to="/contact" className={({isActive}) => `${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-600 dark:hover:text-blue-400`} onClick={toggleMenu}>
                    Contact
                  </NavLink>
                  <div className="mt-4">{MobileSignupButton}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;