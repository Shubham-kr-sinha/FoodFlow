const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const auth = require('../middleware/auth'); // We need to create this middleware

// Get all restaurants
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });
        res.json(restaurant);
    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Restaurant not found' });
        res.status(500).send('Server Error');
    }
});

// Create a restaurant (Protected, e.g., for restaurant owners)
// For MVP, we might allow any authenticated user to create one for simplicity, or check role
router.post('/', auth, async (req, res) => {
    try {
        // Basic check if user is a restaurant owner (optional for now)
        // if (req.user.role !== 'restaurant_owner') return res.status(403).json({ msg: 'Not authorized' });

        const { name, description, address, cuisine, image, menu } = req.body;

        const newRestaurant = new Restaurant({
            name,
            description,
            address,
            cuisine,
            image,
            menu,
            owner: req.user.id
        });

        const restaurant = await newRestaurant.save();
        res.json(restaurant);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
