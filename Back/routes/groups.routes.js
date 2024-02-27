import express from 'express';
import bodyParser from 'body-parser';
import { create } from '../controllers/users/group.controllers.js';
import checkIfUserIsConnected from '../controllers/middlewares/auth.middleware.js';

const router = express.Router();
let jsonParser = bodyParser.json()

router.post('/create', checkIfUserIsConnected, jsonParser, create)

export default router;