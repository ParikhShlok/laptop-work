const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Simple JSON File DB fallback when MongoDB is not running
const JSON_DB_DIR = path.join(__dirname, '../../db_fallback');

if (!fs.existsSync(JSON_DB_DIR)) {
  fs.mkdirSync(JSON_DB_DIR, { recursive: true });
}

const localDb = {
  read: (collection) => {
    const filePath = path.join(JSON_DB_DIR, `${collection}.json`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
      return [];
    }
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      return [];
    }
  },
  write: (collection, data) => {
    const filePath = path.join(JSON_DB_DIR, `${collection}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
};

global.localDb = localDb;
global.useMongo = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/swapnaart';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000 // 3 seconds timeout
    });
    console.log('✨ MongoDB Connected Successfully!');
    global.useMongo = true;
  } catch (err) {
    console.warn('\n⚠️  MongoDB Connection Failed!');
    console.warn('⚠️  Reason:', err.message);
    console.warn('🚀 Running in Fallback Mode (using local JSON file database under backend/db_fallback/)');
    console.warn('🚀 No database installation is required for testing!\n');
    global.useMongo = false;
  }
};

module.exports = connectDB;
