const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: String }, // e.g., "Starters", "Main Course"
    isAvailable: { type: Boolean, default: true }
});

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    address: {
        street: String,
        city: String,
        zip: String
    },
    cuisine: [String], // e.g., ["Italian", "Pizza"]
    image: { type: String },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    menu: [menuItemSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
