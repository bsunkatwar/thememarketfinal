require('dotenv').config();
const mongoose = require('mongoose');

console.log('🧪 Testing MongoDB Connection...\n');
console.log('Connection string:', process.env.MONGODB_URI);
console.log('');

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000
})
  .then(() => {
    console.log('✅ SUCCESS! MongoDB connected successfully!');
    console.log('');
    mongoose.disconnect();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ FAILED! Connection error:');
    console.error('');
    console.error('Error:', err.message);
    console.error('');
    console.error('═══════════════════════════════════════════════');
    console.error('TROUBLESHOOTING STEPS:');
    console.error('═══════════════════════════════════════════════');
    console.error('');
    console.error('1. CHECK NETWORK ACCESS in MongoDB Atlas:');
    console.error('   - Go to: https://cloud.mongodb.com');
    console.error('   - Click "Network Access"');
    console.error('   - Make sure 0.0.0.0/0 is listed');
    console.error('   - If not, click "+ ADD IP ADDRESS"');
    console.error('   - Click "ALLOW ACCESS FROM ANYWHERE"');
    console.error('');
    console.error('2. VERIFY CONNECTION STRING:');
    console.error('   - Go to MongoDB Atlas');
    console.error('   - Click "Database" → "Connect"');
    console.error('   - Select "Connect your application"');
    console.error('   - Copy the EXACT connection string');
    console.error('   - Replace the one in .env file');
    console.error('');
    console.error('3. CHECK DATABASE USER:');
    console.error('   - Go to "Database Access"');
    console.error('   - Verify khushi_db_user exists');
    console.error('   - Check password is correct');
    console.error('');
    console.error('4. CHECK CLUSTER STATUS:');
    console.error('   - Go to "Database"');
    console.error('   - Make sure cluster shows "Running" (green)');
    console.error('   - If paused, click "Resume"');
    console.error('');
    console.error('═══════════════════════════════════════════════');
    console.error('');
    process.exit(1);
  });
