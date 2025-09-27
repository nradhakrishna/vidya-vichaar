const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/vidyavichara';
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});