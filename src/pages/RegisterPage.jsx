import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../utils/Api';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaPoll } from 'react-icons/fa';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Api.post('/user/signup', { name, email, password });
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/* --- Left Side: Hero Section --- */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-indigo-900 to-indigo-900"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-20 right-20 w-60 h-60 bg-indigo-400 rounded-full blur-3xl opacity-20"></div>

        <div className="relative z-10 text-center px-10">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl inline-block mb-6 shadow-xl">
                <FaPoll className="text-white text-5xl" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Join SurveyApp</h1>
            <p className="text-indigo-100 text-lg max-w-md mx-auto leading-relaxed">
                Start creating professional surveys and analyzing results in minutes.
            </p>
        </div>
      </div>

      {/* --- Right Side: Register Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md">
            
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-500">Sign up for free to get started.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
                
                {/* Name Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="text-gray-400" />
                        </div>
                        <input 
                            type="text" 
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white"
                            placeholder="type your name..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>

                {/* Email Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-gray-400" />
                        </div>
                        <input 
                            type="email" 
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                        </div>
                        <input 
                            type="password" 
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating Account...' : (
                        <>Sign Up <FaArrowRight /></>
                    )}
                </button>

            </form>

            <p className="mt-8 text-center text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 transition">
                    Sign in here
                </Link>
            </p>

        </div>
      </div>
    </div>
  );
}