import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-extrabold text-primary tracking-tight flex items-center gap-2">
                    <span className="text-3xl">🍔</span> FoodFlow
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-600 focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8 font-medium text-gray-600">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <Link to="/cart" className="relative hover:text-primary transition-colors flex items-center gap-1">
                        Cart
                        {cart.length > 0 && (
                            <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {cart.reduce((acc, item) => acc + item.quantity, 0)}
                            </span>
                        )}
                    </Link>
                    {user ? (
                        <>
                            <Link to="/orders" className="hover:text-primary transition-colors">My Orders</Link>
                            <div className="flex items-center gap-4 ml-4">
                                <span className="text-sm text-gray-500">Hi, {user.name}</span>
                                <button
                                    onClick={logout}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
                            <Link to="/signup" className="bg-primary text-white px-6 py-2.5 rounded-full hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-4">
                    <Link to="/" className="block text-gray-600 hover:text-primary" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/cart" className="block text-gray-600 hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                        Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                    </Link>
                    {user ? (
                        <>
                            <Link to="/orders" className="block text-gray-600 hover:text-primary" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
                            <button
                                onClick={() => { logout(); setIsMenuOpen(false); }}
                                className="block w-full text-left text-red-500 hover:text-red-700"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block text-gray-600 hover:text-primary" onClick={() => setIsMenuOpen(false)}>Login</Link>
                            <Link to="/signup" className="block text-primary font-bold" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
