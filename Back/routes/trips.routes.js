import express from 'express';
import bodyParser from 'body-parser';
import checkIfUserIsConnected from "../controllers/middlewares/auth.middleware.js";
import {cancelTrip, create, getTripInfo, terminateTrip, updateTrip} from "../controllers/trips/trip.controllers.js";

const router = express.Router();
let jsonParser = bodyParser.json();

router.post('/create', checkIfUserIsConnected, jsonParser, create);
router.get('/info', checkIfUserIsConnected, jsonParser, getTripInfo);
router.patch('/update', checkIfUserIsConnected, jsonParser, updateTrip);
router.patch('/terminate', checkIfUserIsConnected, jsonParser, terminateTrip);
router.patch('/cancel', checkIfUserIsConnected, jsonParser, cancelTrip);
export default router;