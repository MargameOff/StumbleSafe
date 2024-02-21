import express from 'express';
import userRoute from './routes/users.routes.js';

const APP = express()

const PORT = 8080;

APP.listen(PORT, () => {
    console.log(`Stumble app listening on port ${PORT}`)
})

APP.get('/status', (req, res) => {
    res.data = {
        status: 'ok'
    }
    res.json(res.data);
})


userRoute(APP);

//all other routes
APP.get('*', (req, res) => {
    res.status(404).send('404 Not Found, go check the documentation for the available routes.');
})