import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/users.routes.js';
import groupRoutes from './routes/groups.routes.js';
import consentRoutes from './routes/consents.routes.js';
import notificationRoutes from './routes/notifications.routes.js';
import tripRoutes from './routes/trips.routes.js';
import positionRoutes from './routes/positions.routes.js';
import alertRoutes from './routes/alerts.routes.js';
import logRoutes from './routes/logs.routes.js';
import cors from 'cors';

import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './swagger.js';


//Constants
const APP = express();
const PORT = 8080;

//Set up the .env file
dotenv.config({ path: "../.env" });

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
APP.use(cors()); 

//Routes
APP.use('/api/users', userRoutes);
APP.use('/api/groups', groupRoutes);
APP.use('/api/consents', consentRoutes);
APP.use('/api/notifications', notificationRoutes);
APP.use('/api/trips', tripRoutes);
APP.use('/api/positions', positionRoutes);
APP.use('/api/alerts', alertRoutes);
APP.use('/api/logs', logRoutes);

// Integrate Swagger Middleware
APP.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

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

export default APP;