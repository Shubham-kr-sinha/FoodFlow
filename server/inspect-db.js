const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodflow';
console.log('Connecting to:', uri);

const inspect = async () => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        const collection = mongoose.connection.db.collection('restaurants');
        const count = await collection.countDocuments();
        console.log(`Total Restaurants: ${count}`);

        if (count === 0) {
            console.log('No restaurants found.');
            process.exit(0);
        }

        const cursor = collection.find({});
        let totalSize = 0;
        let checked = 0;
        let maxDocSize = 0;
        let maxDocId = null;

        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            const json = JSON.stringify(doc);
            const size = Buffer.byteLength(json, 'utf8');
            totalSize += size;
            checked++;

            if (size > maxDocSize) {
                maxDocSize = size;
                maxDocId = doc._id;
            }

            if (checked <= 5) {
                console.log(`Restaurant ${doc.name} size: ${(size / 1024).toFixed(2)} KB`);
                if (doc.image && doc.image.length > 1000) {
                    console.log(`Warning: Restaurant ${doc.name} has a large image string (${doc.image.length} chars). Starts with: ${doc.image.substring(0, 50)}...`);
                }
                if (doc.menu && doc.menu.length > 0) {
                    doc.menu.forEach(m => {
                        if (m.image && m.image.length > 1000) {
                            console.log(`Warning: Menu item ${m.name} in ${doc.name} has a large image string (${m.image.length} chars).`);
                        }
                    });
                }
            }
        }

        console.log(`\nAverage Size: ${(totalSize / count / 1024).toFixed(2)} KB`);
        console.log(`Max Size: ${(maxDocSize / 1024).toFixed(2)} KB (ID: ${maxDocId})`);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

inspect();
