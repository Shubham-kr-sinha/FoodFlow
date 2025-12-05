const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');


// Get user's orders
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create an order
router.post('/', auth, async (req, res) => {
    try {
        const { restaurant, items, totalAmount } = req.body;

        // Bypass Stripe for now
        // const paymentIntent = await stripe.paymentIntents.create({ ... });

        const newOrder = new Order({
            user: req.user.id,
            restaurant,
            items,
            totalAmount,
            stripePaymentIntentId: 'cod_order',
            paymentStatus: 'Pending'
        });

        const order = await newOrder.save();

        res.json({ order, clientSecret: 'bypass_secret' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update order status (Restaurant/Admin)
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        // In a real app, verify if user is restaurant owner or admin

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        order.status = status;
        await order.save();

        // Emit socket event for real-time update
        // We need access to 'io' here. One way is to pass it to the route or attach to req.
        // For now, we'll assume the frontend polls or we'll refactor to pass io.
        // Ideally: req.app.get('io').emit('orderStatusUpdated', { orderId: order.id, status });
        const io = req.app.get('io');
        if (io) {
            io.to(order.user.toString()).emit('orderStatusUpdated', { orderId: order.id, status });
        }

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
