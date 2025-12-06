import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import config from '../config';

const ReviewForm = ({ restaurantId, onReviewAdded }) => {
    const { user } = useContext(AuthContext);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${config.API_URL}/api/reviews`, {
                restaurantId,
                rating,
                comment
            });
            onReviewAdded(res.data);
            setComment('');
            setRating(5);
            setError('');
        } catch (err) {
            setError(err.response?.data?.msg || 'Error adding review');
        }
    };

    if (!user) {
        return (
            <div className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100">
                <p className="text-gray-600 mb-2">Please sign in to leave a review.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <h3 className="text-xl font-bold mb-4">Write a Review</h3>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <select
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                        className="input-field w-32"
                    >
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Good</option>
                        <option value="3">3 - Average</option>
                        <option value="2">2 - Poor</option>
                        <option value="1">1 - Terrible</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="input-field min-h-[100px]"
                        placeholder="Share your experience..."
                        required
                    />
                </div>
                <button type="submit" className="btn-primary px-8">
                    Submit Review
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
