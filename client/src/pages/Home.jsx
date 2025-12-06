import { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';

import config from '../config';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const res = await axios.get(`${config.API_URL}/api/restaurants`);
                setRestaurants(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching restaurants:', err);
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Hero Section */}
            <div className="relative bg-gray-900 rounded-3xl overflow-hidden mb-12 text-white">
                <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
                    alt="Food Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="relative z-10 px-8 py-20 md:py-32 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        Delicious Food, <br />
                        <span className="text-primary">Delivered to You</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                        Order from your favorite restaurants and track your delivery in real-time.
                    </p>
                    <div className="flex justify-center gap-4">
                        <input
                            type="text"
                            placeholder="Search for restaurants or cuisines..."
                            className="px-6 py-3 rounded-full text-gray-900 w-full max-w-md focus:outline-none focus:ring-4 focus:ring-primary/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-orange-500/30">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Restaurant Grid */}
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Popular Restaurants</h2>
            {filteredRestaurants.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-500">No restaurants found matching "{searchTerm}"</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredRestaurants.map((restaurant) => (
                        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
