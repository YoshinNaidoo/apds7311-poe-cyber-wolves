import React, { useState, useEffect } from 'react';
//npm run build
//import { useNavigate, useSearchParams } from 'react-router-dom';
//import api from '../../utils/axiosConfig';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

function Login() {
   
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [ibanPayer, setIbanPayer] = useState('');
    const [error, setError] = useState('');
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let timer;
        if (blockTimeRemaining > 0) {
            timer = setInterval(() => {
                setBlockTimeRemaining(time => {
                    if (time <= 1) {
                        setIsBlocked(false);
                        return 0;
                    }
                    return time - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [blockTimeRemaining]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isBlocked) {
            setError(`Please wait ${Math.ceil(blockTimeRemaining / 60)} minutes before trying again.`);
            return;
        }

        try {
            const response = await axios.post('/api/auth/login', {
                username,
                password,
                ibanPayer
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/post');
            }
        } catch (err) {
            console.error('Login error:', err);
            
            if (err.response?.status === 429) {
                setIsBlocked(true);
                const minutes = err.response.data.minutesUntilNextTry || 5;
                setBlockTimeRemaining(minutes * 60);
                setError(`Too many login attempts. Please try again in ${minutes} minutes.`);
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.request) {
                setError('Could not connect to server. Please try again.');
            } else {
                setError('An error occurred during login.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                Login to your account
            </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                        {isBlocked && (
                            <div className="mt-2 text-sm">
                                Time remaining: {Math.ceil(blockTimeRemaining / 60)} minutes
                            </div>
                        )}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label 
                                htmlFor="username" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label 
                                htmlFor="password" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label 
                                htmlFor="ibanPayer" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Account Number (IBAN)
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="ibanPayer"
                                    name="ibanPayer"
                                    value={ibanPayer}
                                    onChange={(e) => setIbanPayer(e.target.value)}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your IBAN"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isBlocked}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                    isBlocked ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                } transition-colors`}
                            >
                                {isBlocked ? `Try again in ${Math.ceil(blockTimeRemaining / 60)} minutes` : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;