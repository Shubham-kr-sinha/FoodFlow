const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


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

        if (req.body.paymentMethod === 'cod') {
            // Existing COD logic
            const newOrder = new Order({
                user: req.user.id,
                restaurant,
                items,
                totalAmount,
                stripePaymentIntentId: 'cod_order',
                paymentStatus: 'Pending'
            });
            const order = await newOrder.save();
            return res.json({ order, type: 'cod' });
        }

        // Razorpay Logic
        const options = {
            amount: Math.round(totalAmount * 100), // Amount in paise, rounded to integer
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };

        const razorpayOrder = await razorpay.orders.create(options);

        const newOrder = new Order({
            user: req.user.id,
            restaurant,
            items,
            totalAmount,
            stripePaymentIntentId: razorpayOrder.id, // Storing razorpay order id here
            paymentStatus: 'Pending'
        });

        const order = await newOrder.save();

        res.json({
            order,
            razorpayOrder,
            key_id: process.env.RAZORPAY_KEY_ID,
            type: 'razorpay'
        });
    } catch (err) {
        console.error("Razorpay Error:", err);
        res.status(500).send(err.message || 'Server Error');
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

// Verify Razorpay Payment
router.post('/verify', auth, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Update order status
            const order = await Order.findOne({ stripePaymentIntentId: razorpay_order_id });
            if (order) {
                order.paymentStatus = 'Paid';
                await order.save();
                return res.json({ success: true, message: 'Payment verified successfully' });
            } else {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }
        } else {
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
