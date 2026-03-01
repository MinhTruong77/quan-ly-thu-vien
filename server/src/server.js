require('dotenv').config();

const express = require('express');
const app = express();

const connectDB = require('./config/connectDB');
const routes = require('./routes/index.routes');

const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 5000;

connectDB();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ MỞ FULL CORS (TEST PRODUCTION)
app.use(
    cors({
        origin: true,
        credentials: true,
    }),
);

routes(app);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Lỗi server!',
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
