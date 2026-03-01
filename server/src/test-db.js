const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); // Adjust path if running from src

console.log("Testing MongoDB Connection...");
console.log("URI:", process.env.MONGO_URI ? "Found" : "Not Found");

if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing in .env");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Successfully connected to MongoDB!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Connection Failed:", err);
        process.exit(1);
    });
