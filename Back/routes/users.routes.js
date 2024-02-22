import express from 'express';
import {signup} from '../controllers/users/signup.controllers.js';
import bodyParser from 'body-parser';

const router = express.Router();
let jsonParser = bodyParser.json()

router.post('/signup', jsonParser, signup);

export default router;