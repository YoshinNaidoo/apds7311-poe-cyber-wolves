import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

function GetPosts() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPosts(response.data);
            } catch (err) {
                setError('You are not authorized to view the posts');
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                    <NavLink
                        to="/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 inline-flex items-center"
                    >
                        Create Transaction
                    </NavLink>
                </div>

                {error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {posts.map(post => (
                            <div 
                                key={post._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden"
                            >
                                {post.postImage && (
                                    <img 
                                        src={post.postImage} 
                                        alt={post.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                        Transaction Details
                                    </h2>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Amount:</span>
                                            <span className="font-medium">{post.amount}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Currency:</span>
                                            <span className="font-medium">{post.currency}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Provider:</span>
                                            <span className="font-medium">{post.provider}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">SWIFT Code:</span>
                                            <span className="font-medium">{post.swiftCode}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Recipient's Account:</span>
                                            <span className="font-medium">{post.ibanPayee}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 flex justify-end space-x-3">
                                        <NavLink
                                            to={`/edit/${post._id}`}
                                            className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200"
                                        >
                                            Edit
                                        </NavLink>
                                        <NavLink
                                            to={`/delete/${post._id}`}
                                            className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
                                        >
                                            Delete
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Loading...</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GetPosts;