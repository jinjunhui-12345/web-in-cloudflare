import React from 'react';

const Footer = () => (
  <footer className="bg-white border-t border-gray-200 py-8 mt-auto print:hidden">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Life Science Museum. All rights reserved.</p>
      <p className="text-gray-400 text-xs mt-1">Exploring the wonders of biology and nature.</p>
    </div>
  </footer>
);

export default Footer;