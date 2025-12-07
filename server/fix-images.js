const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Restaurant = require('./models/Restaurant');

const fixImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Update Spice Route
        await Restaurant.updateOne(
            { name: 'Spice Route' },
            { $set: { image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' } }
        );
        console.log('✓ Updated Spice Route image');

        // Update Tandoori Nights
        await Restaurant.updateOne(
            { name: 'Tandoori Nights' },
            { $set: { image: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' } }
        );
        console.log('✓ Updated Tandoori Nights image');

        console.log('\n✅ All restaurant images fixed!');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

fixImages();
