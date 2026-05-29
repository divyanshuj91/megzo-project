import React from 'react';

export default function Footer() {
  return (
    <footer className="glass-header mt-16 border-t border-white/20">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-800">
        <div className="flex flex-col gap-3">
          <h3 className="font-bold uppercase tracking-wider text-xs text-gray-500">About</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-blue-600 transition duration-200">Contact Us</a></li>
            <li><a href="#" className="hover:text-blue-600 transition duration-200">About Us</a></li>
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-bold uppercase tracking-wider text-xs text-gray-500">Help</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-blue-600 transition duration-200">Payments</a></li>
            <li><a href="#" className="hover:text-blue-600 transition duration-200">Shipping</a></li>
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-bold uppercase tracking-wider text-xs text-gray-500">Policy</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-blue-600 transition duration-200">Return Policy</a></li>
            <li><a href="#" className="hover:text-blue-600 transition duration-200">Terms Of Use</a></li>
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-bold uppercase tracking-wider text-xs text-gray-500">Social</h3>
          <div className="flex gap-4">
            <a 
              href="#" 
              className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition duration-200 font-bold"
            >
              f
            </a>
            <a 
              href="#" 
              className="w-8 h-8 rounded-full bg-sky-400 text-white flex items-center justify-center hover:bg-sky-500 transition duration-200 font-bold"
            >
              t
            </a>
          </div>
        </div>
      </div>
      <div className="text-center py-6 border-t border-white/10 text-xs text-gray-500">
        &copy; {new Date().getFullYear()} MEGZO. All rights reserved.
      </div>
    </footer>
  );
}
