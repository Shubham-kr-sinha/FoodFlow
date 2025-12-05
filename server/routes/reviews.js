const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

// @route   POST api/reviews
// @desc    Add a review
// @access  Private
router.post('/', auth, async (req, res) => {
    const { restaurantId, rating, comment } = req.body;

    try {
        const newReview = new Review({
            user: req.user.id,
            restaurant: restaurantId,
            rating,
            comment
        });

        const review = await newReview.save();

        // Update restaurant rating
        const reviews = await Review.find({ restaurant: restaurantId });
        const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

        await Restaurant.findByIdAndUpdate(restaurantId, {
            rating: avgRating.toFixed(1),
            numReviews: reviews.length
        });

        // Populate user details for immediate display
        await review.populate('user', 'name');

        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reviews/:restaurantId
// @desc    Get reviews for a restaurant
// @access  Public
router.get('/:restaurantId', async (req, res) => {
    try {
        const reviews = await Review.find({ restaurant: req.params.restaurantId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
