import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const categories = [
    "Pending",
    "Technology",
    "Health",
    "Business",
    "Entertainment"
];

// Validation patterns
const VALIDATION_PATTERNS = {
    amount: /^\d+(\.\d{1,2})?$/,  // Allows numbers with up to 2 decimal places
    swiftCode: /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/,  // SWIFT code format
    ibanPayee: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/  // Basic IBAN format
};

const VALID_CURRENCIES = ['ZAR', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'];

function CreatePost() {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('ZAR');
    const [provider] = useState('SWIFT');
    const [swiftCode, setSwiftCode] = useState('');
    const [ibanPayee, setIbanPayee] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    const validateField = (name, value) => {
        switch(name) {
            case 'amount':
                const numValue = parseFloat(value);
                if (!VALIDATION_PATTERNS.amount.test(value) || 
                    numValue <= 0 || 
                    numValue > 1000000000) {
                    return 'Invalid amount. Must be between 0 and 1,000,000,000 with max 2 decimal places';
                }
                break;
            case 'currency':
                if (!VALID_CURRENCIES.includes(value)) {
                    return 'Invalid currency selected';
                }
                break;
            case 'swiftCode':
                if (!VALIDATION_PATTERNS.swiftCode.test(value)) {
                    return 'Invalid SWIFT code format';
                }
                break;
            case 'ibanPayee':
                if (!VALIDATION_PATTERNS.ibanPayee.test(value)) {
                    return 'Invalid IBAN format';
                }
                break;
            default:
                return '';
        }
        return '';
    };

    const handleChange = (e, setter) => {
        const { name, value } = e.target;
        setter(value);
        const error = validateField(name, value);
        setValidationErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate all fields before submission
        const errors = {
            amount: validateField('amount', amount),
            currency: validateField('currency', currency),
            swiftCode: validateField('swiftCode', swiftCode),
            ibanPayee: validateField('ibanPayee', ibanPayee)
        };

        const hasErrors = Object.values(errors).some(error => error !== '');
        if (hasErrors) {
            setValidationErrors(errors);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No authentication token found. Please log in.");
                return;
            }

            // Sanitize and format data before sending
            const sanitizedData = {
                amount: parseFloat(amount),
                currency: currency.toUpperCase(),
                provider: provider.toUpperCase(),
                swiftCode: swiftCode.toUpperCase(),
                ibanPayee: ibanPayee.toUpperCase(),
                category: selectedCategory
            };

            const response = await axios.post("/api/posts", sanitizedData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Post created successfully:", response.data);
            navigate("/posts");
        } catch (error) {
            console.error("Error details:", error.response || error);
            if (error.response) {
                setError(`Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
            } else if (error.request) {
                setError("No response received from server. Please check if the server is running.");
            } else {
                setError("Error setting up the request. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Create International Payment
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Amount Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={amount}
                                    onChange={(e) => handleChange(e, setAmount)}
                                    required
                                    min="0.01"
                                    max="1000000000"
                                    step="0.01"
                                    className={`block w-full rounded-md border ${
                                        validationErrors.amount 
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    } shadow-sm p-2`}
                                />
                                {validationErrors.amount && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.amount}</p>
                                )}
                            </div>

                            {/* Currency Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Currency
                                </label>
                                <select
                                    name="currency"
                                    value={currency}
                                    onChange={(e) => handleChange(e, setCurrency)}
                                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {VALID_CURRENCIES.map((curr) => (
                                        <option key={curr} value={curr}>{curr}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Provider Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Provider
                                </label>
                                <input
                                    type="text"
                                    value={provider}
                                    readOnly
                                    className="block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm p-2"
                                />
                            </div>

                            {/* SWIFT Code Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    SWIFT Code
                                </label>
                                <input
                                    type="text"
                                    name="swiftCode"
                                    value={swiftCode}
                                    onChange={(e) => handleChange(e, setSwiftCode)}
                                    required
                                    maxLength={11}
                                    className={`block w-full rounded-md border ${
                                        validationErrors.swiftCode 
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    } shadow-sm p-2`}
                                />
                                {validationErrors.swiftCode && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.swiftCode}</p>
                                )}
                            </div>

                            {/* IBAN Field */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payee IBAN
                                </label>
                                <input
                                    type="text"
                                    name="ibanPayee"
                                    value={ibanPayee}
                                    onChange={(e) => handleChange(e, setIbanPayee)}
                                    required
                                    maxLength={34}
                                    className={`block w-full rounded-md border ${
                                        validationErrors.ibanPayee 
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    } shadow-sm p-2`}
                                />
                                {validationErrors.ibanPayee && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.ibanPayee}</p>
                                )}
                            </div>

                            {/* Category Field */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={Object.keys(validationErrors).some(key => validationErrors[key])}
                                className={`px-4 py-2 rounded-md text-white font-medium ${
                                    Object.keys(validationErrors).some(key => validationErrors[key])
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                } transition-colors duration-200`}
                            >
                                Create Payment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;