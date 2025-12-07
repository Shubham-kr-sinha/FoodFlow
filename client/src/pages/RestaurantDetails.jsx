import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import CartContext from '../context/CartContext';

import config from '../config';

import ReviewForm from '../components/ReviewForm';

const RestaurantDetails = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchRestaurantAndReviews = async () => {
            try {
                const [resRestaurant, resReviews] = await Promise.all([
                    axios.get(`${config.API_URL}/api/restaurants/${id}`),
                    axios.get(`${config.API_URL}/api/reviews/${id}`)
                ]);
                setRestaurant(resRestaurant.data);
                setReviews(resReviews.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setLoading(false);
            }
        };

        fetchRestaurantAndReviews();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (!restaurant) return <div className="text-center mt-10 text-xl">Restaurant not found</div>;

    return (
        <div>
            {/* Restaurant Hero */}
            <div className="relative h-80 rounded-3xl overflow-hidden mb-10 shadow-xl">
                <Link to="/" className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur text-gray-800 p-3 rounded-full shadow-md hover:bg-white transition-all flex items-center justify-center hover:scale-105 active:scale-95 group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                        <path d="M19 12H5"></path>
                        <path d="M12 19l-7-7 7-7"></path>
                    </svg>
                </Link>
                <img
                    src={restaurant.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80'}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-8 md:p-12">
                    <div className="text-white">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-2">{restaurant.name}</h1>
                        <p className="text-lg opacity-90 mb-4 max-w-2xl">{restaurant.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm font-medium">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                                {restaurant.cuisine.join(', ')}
                            </span>
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
                                ★ {restaurant.rating}
                            </span>
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                                📍 {restaurant.address.street}, {restaurant.address.city}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {restaurant.menu.map((item) => (
                    <div key={item._id} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex justify-between gap-4 group">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                            <p className="text-gray-500 text-sm mb-3 line-clamp-2">{item.description}</p>
                            <p className="font-bold text-lg text-gray-900">₹{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col justify-between items-end">
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-xl mb-2 bg-gray-100"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'; }}
                                />
                            )}
                            <button
                                onClick={() => addToCart(item, restaurant)}
                                className="bg-white text-primary border border-primary px-6 py-2 rounded-lg font-bold hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Reviews Section */}
            <div className="mt-16 mb-10">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Reviews & Ratings</h2>

                export default RestaurantDetails;
