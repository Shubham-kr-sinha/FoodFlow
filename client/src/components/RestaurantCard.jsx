import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={restaurant.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80';
                    }}
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                    {restaurant.deliveryTime || '30-40 min'}
                </div>
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{restaurant.name}</h3>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                        {restaurant.rating} ★
                    </span>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-1">{restaurant.cuisine.join(', ')}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                    <span className="text-gray-400 text-sm">{restaurant.address.city}</span>
                    <Link
                        to={`/restaurant/${restaurant._id}`}
                        className="text-primary font-semibold text-sm hover:underline"
                    >
                        View Menu →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;
