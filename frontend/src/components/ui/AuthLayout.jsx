import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white-50 to-white-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden animate-fadeIn">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <img src="image/logo.png" className="rounded-[10px] w-100 h-50" />
          </div>

          <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">{title}</h2>

          {subtitle && <p className="text-center text-gray-500 mb-8">{subtitle}</p>}

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
