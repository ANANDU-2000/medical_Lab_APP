import mongoose from 'mongoose';

const uri = "mongodb+srv://suragsunil2023_db_user:RlrH7H0DGAUiTNF4@labdb.qjokknr.mongodb.net/?appName=Labdb";

async function testConnection() {
    try {
        console.log('🔄 Attempting to connect to MongoDB...');
        console.log('URI:', uri.replace(/:[^:@]+@/, ':****@')); // Hide password in logs

        await mongoose.connect(uri);

        console.log('✅ Successfully connected to MongoDB!');
        console.log('📊 Connection state:', mongoose.connection.readyState);
        console.log('🗄️  Database name:', mongoose.connection.db.databaseName);

        // Test a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📁 Collections:', collections.map(c => c.name).join(', ') || 'No collections yet');

        await mongoose.disconnect();
        console.log('✅ Test completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed!');
        console.error('Error:', error.message);
        if (error.code) console.error('Error Code:', error.code);
        process.exit(1);
    }
}

testConnection();
