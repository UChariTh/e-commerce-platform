const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });

async function demoteSupport() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const result = await db.collection('users').updateOne(
            { email: 'support@gmail.com' },
            { $set: { role: 'support' } }
        );
        console.log('Demote result:', result);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

demoteSupport();
