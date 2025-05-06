const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 MongoDB Setup Helper');
console.log('This script will help you set up your MongoDB connection.\n');

rl.question('Enter your MongoDB connection string from MongoDB Atlas (mongodb+srv://...): ', (mongoUri) => {
  if (!mongoUri || !mongoUri.startsWith('mongodb+srv://')) {
    console.error('❌ Invalid MongoDB connection string. It should start with mongodb+srv://');
    rl.close();
    return;
  }

  const envContent = `MONGODB_URI=${mongoUri}
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
`;

  fs.writeFileSync(path.join(__dirname, '.env.local'), envContent);
  console.log('\n✅ Created .env.local file with your MongoDB connection string.');
  console.log('🚀 You can now restart your Next.js server to apply the changes.');
  
  rl.close();
}); 