const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodflow';
console.log('Connecting to:', uri);

const analyze = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected. Analyzing...');

        const restaurants = await mongoose.connection.db.collection('restaurants').find({}).toArray();
        console.log(`Fetched ${restaurants.length} restaurants.`);

        let hugeDocs = [];

        restaurants.forEach(doc => {
            const json = JSON.stringify(doc);
            const size = Buffer.byteLength(json, 'utf8');

            // Check for large images in main doc
            let hasLargeImage = false;
            if (doc.image && doc.image.length > 500) {
                hasLargeImage = true;
            }

            // Check menus
            let largeMenuImages = 0;
            if (doc.menu && Array.isArray(doc.menu)) {
                doc.menu.forEach(item => {
                    if (item.image && item.image.length > 500) {
                        largeMenuImages++;
                        hasLargeImage = true;
                    }
                });
            }

            if (size > 10 * 1024 || hasLargeImage) { // > 10KB or has large image string
                hugeDocs.push({
                    name: doc.name,
                    id: doc._id,
                    sizeKB: (size / 1024).toFixed(2),
                    imageLength: doc.image ? doc.image.length : 0,
                    largeMenuImagesCount: largeMenuImages
                });
            }
        });

        if (hugeDocs.length > 0) {
            console.log('\n!!! FOUND HEAVY DOCUMENTS !!!');
            console.table(hugeDocs);
            console.log('These documents likely contain Base64 images instead of URLs.');
        } else {
            console.log('\nAll documents seem to be of reasonable size (under 10KB and no long image strings).');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

analyze();
