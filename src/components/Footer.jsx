import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Fashion Store</h3>
          <p className="text-gray-400">Your one-stop shop for the latest trends and timeless classics.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">Shop</a></li>
            <li><a href="#" className="hover:text-white">About</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Support</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">FAQ</a></li>
            <li><a href="#" className="hover:text-white">Shipping</a></li>
            <li><a href="#" className="hover:text-white">Returns</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <FaFacebook className="text-2xl cursor-pointer hover:text-blue-500" />
            <FaTwitter className="text-2xl cursor-pointer hover:text-blue-400" />
            <FaInstagram className="text-2xl cursor-pointer hover:text-pink-500" />
            <FaLinkedin className="text-2xl cursor-pointer hover:text-blue-700" />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
        &copy; 2025 Fashion Store. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;