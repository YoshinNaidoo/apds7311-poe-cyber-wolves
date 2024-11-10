import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [firstName, setFirstname] = useState('');
    const [lastName, setLastname] = useState('');
    const [idNumber, setIdnumber] = useState('');
    const [ibanPayer, setIbanPayer] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validatePassword = (value) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regex.test(value)) {
            setPasswordError('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setPasswordError('');

        if (!validatePassword(password)) {
            return;
        }

        try {
            const response = await axios.post('/api/auth/register', {
                username, firstName, lastName, idNumber, ibanPayer, password
            });
            if (response.status === 201) {
                navigate('/');
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Registration failed');
                if (err.response.data.errors) {
                    setError(err.response.data.errors.join(', '));
                }
            } else {
                setError('Something went wrong, try again.');
            }
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md">
                <h2 className="mb-6 text-center text-2xl font-bold">Create your account</h2>
                
                <div className="rounded-lg bg-white p-6 shadow-md">
                    {(error || passwordError) && (
                        <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
                            {error || passwordError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstname(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    autoComplete="given-name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastname(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    autoComplete="family-name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">ID Number</label>
                            <input
                                type="text"
                                value={idNumber}
                                onChange={(e) => setIdnumber(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Account Number (IBAN)</label>
                            <input
                                type="text"
                                value={ibanPayer}
                                onChange={(e) => setIbanPayer(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    validatePassword(e.target.value);
                                }}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Create Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;