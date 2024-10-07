import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-6">Welcome to Test App</h1>
      <p className="text-xl mb-4">Please sign in or create an account to get started.</p>
      <div>
        <Link
          to="/login"
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Signup
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
