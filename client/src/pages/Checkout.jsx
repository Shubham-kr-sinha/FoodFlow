import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Checkout = () => {
    const { cart, restaurant, cartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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
                paymentMethod: 'cod'
            };

            await axios.post('http://localhost:5000/api/orders', orderData, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });

            clearCart();
            // Redirect to success page
            navigate('/payment-success');
        } catch (err) {
            console.error(err);
            alert('Failed to place order');
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
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Payment & Delivery</h2>
                    <p className="text-gray-600 mb-6">
                        Payment Method: <span className="font-bold text-gray-800">Cash on Delivery</span>
                    </p>
                    <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                    <p className="text-xs text-gray-400 mt-4 text-center">
                        Secure checkout. Pay when you receive your food.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
