import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/users.routes.js';
import dotenv from 'dotenv';

//Constants
const APP = express();
const PORT = 8080;
//Set up the .env file
dotenv.config({ path: '../.env' });

//Check the connection to the database and start the server
mongoose.connect("mongodb://" + process.env.MONGODB_USER + ":" + process.env.MONGODB_PASSWORD + "@" + process.env.MONGODB_HOST + ":" + process.env.MONGODB_LOCAL_PORT + "/" + process.env.MONGODB_DATABASE + "?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, authSource: 'admin' })
    .then(() => {
        console.log('Connected to MongoDB');
        // Start the server
        APP.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

//Middleware
APP.use(express.json());


//Routes
APP.use('/api/users', userRoutes);
APP.use('/api/groups', groupRoutes);
APP.use('/api/consents', consentRoutes);
APP.use('/api/notifications', notificationRoutes);
APP.use('/api/trip', tripRoutes);
APP.use('/api/position', positionRoutes);
APP.use('/api/alert', alertRoutes);
APP.use('/api/log', logRoutes);

APP.get('/status', (req, res) => {
    res.data = {
        status: 'ok'
    }
    res.json(res.data);
})

//all other routes
APP.get('*', (req, res) => {
    res.status(404).send('404 Not Found, go check the documentation for the available routes.');
})

