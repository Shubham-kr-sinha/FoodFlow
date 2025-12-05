import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
    useEffect(() => {
        // Any post-success logic if needed (e.g. analytics)
    }, []);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <div className="bg-green-100 p-6 rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-md">
                Thank you for your order. We have received it and the restaurant will start preparing your food shortly.
            </p>
            <div className="flex gap-4">
                <Link to="/orders" className="btn-primary">
                    View Orders
                </Link>
                <Link to="/" className="px-6 py-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all">
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
