import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const userRole = localStorage.getItem('userRole');
    const isEmployee = userRole === 'employee';

    return (
        <nav className="bg-blue-600 p-4 shadow-lg">
            <div className="container mx-auto">
                <ul className="flex space-x-6 justify-center items-center">
                    {/* <li>
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                `px-4 py-2 rounded-lg transition ${
                                    isActive 
                                        ? 'bg-white text-blue-600' 
                                        : 'text-white hover:bg-blue-500'
                                }`
                            }
                        >
                            Home
                        </NavLink>
                    </li> */}
                    {!isEmployee ? (
                        <>
                            <li>
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg transition ${isActive
                                            ? 'bg-white text-blue-600'
                                            : 'text-white hover:bg-blue-500'
                                        }`
                                    }
                                >
                                    Login
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/register"
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg transition ${isActive
                                            ? 'bg-white text-blue-600'
                                            : 'text-white hover:bg-blue-500'
                                        }`
                                    }
                                >
                                    Register
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/employee/login"
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg transition ${isActive
                                            ? 'bg-white text-blue-600'
                                            : 'text-white hover:bg-blue-500'
                                        }`
                                    }
                                >
                                    Employee Login
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <NavLink
                                    to="/employee/dashboard"
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg transition ${isActive
                                            ? 'bg-white text-blue-600'
                                            : 'text-white hover:bg-blue-500'
                                        }`
                                    }
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('employeeToken');
                                        localStorage.removeItem('employeeId');
                                        localStorage.removeItem('userRole');
                                        
                                        localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                    window.location.href = '/employee/login';
                                    }}
                                    className="px-4 py-2 rounded-lg transition text-white hover:bg-blue-500"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                    <li>
                        <NavLink
                            to="/posts"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg transition ${isActive
                                    ? 'bg-white text-blue-600'
                                    : 'text-white hover:bg-blue-500'
                                }`
                            }
                        >
                            Transactions
                        </NavLink>
                    </li>


                    {!isEmployee && (
                        <li>
                            <button
                                    onClick={() => {
                                        localStorage.removeItem('employeeToken');
                                        localStorage.removeItem('employeeId');
                                        localStorage.removeItem('userRole');
                                        window.location.href = '/employee/login';
                                        localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                    window.location.href = '/login';
                                    }}
                                    className="px-4 py-2 rounded-lg transition text-white hover:bg-blue-500"
                                >
                                    Logout
                                </button>
                        </li>
                    )}


                    {/* <li>
                        <NavLink 
                            to="/protected" 
                            className={({ isActive }) => 
                                `px-4 py-2 rounded-lg transition ${
                                    isActive 
                                        ? 'bg-white text-blue-600' 
                                        : 'text-white hover:bg-blue-500'
                                }`
                            }
                        >
                            Protected
                        </NavLink>
                    </li> */}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;