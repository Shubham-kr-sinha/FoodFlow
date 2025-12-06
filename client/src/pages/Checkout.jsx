import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

import config from '../config';

const Checkout = () => {
    const { cart, restaurant, cartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    useEffect(() => {
        if (cart.length === 0) {
            navigate('/');
        }
    }, [cart, navigate]);

    const handlePlaceOrder = async () => {
        if (!user) {
            alert('Please login to place order');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?');
                return;
            }

            const orderData = {
                restaurant: restaurant._id,
                items: cart.map(item => ({
                    menuItem: item._id,
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name
                })),
                totalAmount: cartTotal,
                deliveryAddress: user.address || 'Default Address',
                paymentMethod: 'razorpay' // Default to razorpay now
            };

            const result = await axios.post(`${config.API_URL}/api/orders`, orderData, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });

            const { order, razorypayOrder, key_id } = result.data; // Note: Ensure backend returns razorpayOrder and key_id

            // Backend fix had razorpayOrder, let's match it.
            // result.data = { order, razorpayOrder, key_id, type }
            // Let's verify variable names.

            const options = {
                key: key_id,
                amount: result.data.razorpayOrder.amount,
                currency: result.data.razorpayOrder.currency,
                name: "FoodFlow",
                description: "Order Payment",
                order_id: result.data.razorpayOrder.id,
                handler: async function (response) {
                    try {
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        };

                        const verifyRes = await axios.post(`${config.API_URL}/api/orders/verify`, verifyData, {
                            headers: { 'x-auth-token': localStorage.getItem('token') }
                        });

                        if (verifyRes.data.success) {
                            clearCart();
                            navigate('/payment-success');
                        } else {
                            alert('Payment verification failed');
                        }
                    } catch (err) {
                        console.error(err);
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error(err);
            const msg = err.response?.data || err.message || 'Failed to initiate payment';
            alert(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-4 mb-6">
                        {cart.map((item) => (
                            <div key={item._id} className="flex justify-between items-center text-sm">
                                <div>
                                    <span className="font-bold">{item.quantity}x</span> {item.name}
                                </div>
                                <div className="font-bold text-gray-700">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
                        <span>Total</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Payment & Delivery</h2>
                    <p className="text-gray-600 mb-6">
                        Payment Method: <span className="font-bold text-gray-800">Razorpay (Cards, UPI, Netbanking)</span>
                    </p>
                    <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                    <p className="text-xs text-gray-400 mt-4 text-center">
                        Secure checkout via Razorpay. Pay with any method.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
