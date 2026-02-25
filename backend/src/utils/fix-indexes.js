const mongoose = require('mongoose');
require('dotenv').config();

async function dropUsernameIndex() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to:', mongoose.connection.name);

        const db = mongoose.connection.db;

        // Create the collection first if needed so we can manage indexes
        const collections = await db.listCollections({ name: 'users' }).toArray();

        if (collections.length === 0) {
            console.log('Collection does not exist yet, creating it...');
            await db.createCollection('users');
        }

        const indexes = await db.collection('users').indexes();
        console.log('Current indexes:', indexes.map(i => i.name));

        const badIndex = indexes.find(i => i.name === 'username_1');
        if (badIndex) {
            await db.collection('users').dropIndex('username_1');
            console.log('✅ Dropped username_1 index successfully.');
        } else {
            console.log('✅ username_1 index not found - no action needed.');
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('Done.');
    }
}

dropUsernameIndex();
