import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Atom, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-science-700 bg-science-50 font-semibold' : 'text-gray-600 hover:text-science-600 hover:bg-gray-50';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-science-600 rounded-lg flex items-center justify-center text-white">
                <Atom size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">生命科学馆</h1>
                <p className="text-xs text-science-600 font-medium">Life Science Museum</p>
              </div>
            </Link>
          </div>
          
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm transition-colors ${isActive('/')}`}>
              预约参观
            </Link>
            <Link to="/admin" className={`px-3 py-2 rounded-md text-sm transition-colors ${isActive('/admin')}`}>
              管理入口
            </Link>
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden bg-white border-b border-gray-100">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/')}`}
            >
              预约参观
            </Link>
            <Link 
              to="/admin" 
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin')}`}
            >
              管理入口
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;