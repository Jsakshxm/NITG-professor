import React from 'react';

const Confirmation = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-center text-gray-700">Confirm Your Email</h2>
        <p className="mb-6 text-center text-gray-600">
          Thank you for signing up! We've sent a confirmation link to your registered email address. Please check your inbox and click on the link to confirm your email.
        </p>
        <p className="text-center text-gray-600">
          If you don't see the email, be sure to check your spam or junk folder.
        </p>
      </div>
    </div>
  );
};

export default Confirmation;
