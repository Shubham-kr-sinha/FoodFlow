import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';

const Cart = () => {
    const { cart, restaurant, removeFromCart, updateQuantity, cartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            alert("Please sign in or sign up to place your order.");
            navigate('/login', { state: { from: '/checkout' } }); // Carry forward the intended destination
            return;
        }
        navigate('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-6">🛒</div>
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                <button onClick={() => navigate('/')} className="btn-primary">
                    Browse Restaurants
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                        <img
                            src={restaurant?.image || 'https://via.placeholder.com/100'}
                            alt={restaurant?.name}
                            className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{restaurant?.name}</h3>
                            <p className="text-sm text-gray-500">{restaurant?.address?.street}, {restaurant?.address?.city}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {cart.map((item) => (
                            <div key={item._id} className="flex justify-between items-center">
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                                    <p className="text-gray-500 text-sm">₹{item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            className="px-3 py-1 hover:bg-gray-200 rounded-l-lg transition-colors font-bold text-gray-600"
                                        >
                                            -
                                        </button>
                                        <span className="px-3 font-medium text-gray-900">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            className="px-3 py-1 hover:bg-gray-200 rounded-r-lg transition-colors font-bold text-gray-600"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-right min-w-[80px]">
                                        <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-red-500 text-xs hover:text-red-700 font-medium mt-1"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                        <button
                            onClick={clearCart}
                            className="text-red-500 hover:text-red-700 font-medium text-sm"
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-96 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
                    <h3 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h3>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Delivery Fee</span>
                            <span>₹5.00</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax (5%)</span>
                            <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-100 pt-3 flex justify-between text-xl font-bold text-gray-900">
                            <span>Total</span>
                            <span>₹{(cartTotal + 5 + (cartTotal * 0.05)).toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="w-full btn-primary py-4 text-lg"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
