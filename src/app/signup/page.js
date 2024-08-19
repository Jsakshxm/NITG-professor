"use client"
import { useState } from 'react';
import { supabase } from '../utils/supabase'; // Make sure this path is correct
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      console.error('Error signing up:', error);
    } else {
      router.push('/Confirm'); // Redirect to the dashboard after successful signup
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-blue-700">Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errorMessage && <p className="mb-4 text-sm text-red-600">{errorMessage}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
