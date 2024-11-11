// frontend/src/components/EmployeeDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('employeeToken');
            if (!token) {
                navigate('/employee/login');
                return;
            }

            const response = await fetch('https://localhost:5000/api/employees/transactions/pending', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }

            const data = await response.json();
            setTransactions(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleVerify = async (transactionId, swiftCode) => {
        try {
            const token = localStorage.getItem('employeeToken');
            const response = await fetch(`https://localhost:5000/api/employees/transactions/verify/${transactionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ swiftCode, verified: true })
            });

            if (!response.ok) {
                throw new Error('Failed to verify transaction');
            }

            // Refresh the transactions list
            fetchTransactions();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Pending Transactions</h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-center">Transaction ID</th>
                            <th className="px-6 py-3 text-center">Payee IBAN</th>
                            <th className="px-6 py-3 text-center">Amount</th>
                            <th className="px-6 py-3 text-center">Currency</th>
                            <th className="px-6 py-3 text-center">SWIFT Code</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction._id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 text-center">{transaction._id}</td>
                                <td className="px-6 py-4 text-center">{transaction.ibanPayee}</td>
                                <td className="px-6 py-4 text-center">{transaction.amount}</td>
                                <td className="px-6 py-4 text-center">{transaction.currency}</td>
                                <td className="px-6 py-4 text-center">{transaction.swiftCode}</td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        // onClick={() => handleVerify(transaction._id, transaction.swiftCode)}
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                    >
                                        Verify & Submit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {transactions.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                        No pending transactions found
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeDashboard;