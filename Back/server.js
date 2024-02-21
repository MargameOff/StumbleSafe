import express from 'express';
import defaultroute from './route/default.route.js';

const APP = express()

const PORT = 8080;

APP.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

defaultroute(APP);