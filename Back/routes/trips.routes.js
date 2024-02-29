import express from 'express';
import bodyParser from 'body-parser';
import checkIfUserIsConnected from "../controllers/middlewares/auth.middleware.js";
import {create} from "../controllers/trips/trip.controllers.js";

const router = express.Router();
let jsonParser = bodyParser.json();

router.post('/', checkIfUserIsConnected, jsonParser, create);

export default router;