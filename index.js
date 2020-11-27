const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

const app = express();

const userRouter = require('./routers/userRouter');
const userController = require('./controllers/userController');

const productRouter = require('./routers/productRouter');
const productController = require('./controllers/productController');
const { db } = require('./modals/user');

app.use(cors());
app.use(express.json());

app.use('/login', userController.login);
app.use('/signup', userController.createUser);

// verifies token for get route
app.use(userController.protectRoute);

app.use('/api/user', userRouter);

// verifies isAdmin or not
app.use(productController.protectRoute);
app.use('/api/product', productRouter);

app.use('*', (req, res) => {
    console.log("handler error here");
    res.status(404).json({
        status: "Failure",
        message: `requested URL ${req.originalUrl} does not exist `
    })
});

mongoose.connect(process.env.DB_URL,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        autoIndex: true,
    }).then(con => {
        console.log("connected..");
    })

app.listen(5000, () => {
    console.log("app started");
});