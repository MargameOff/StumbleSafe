import express from 'express';
import {login, signup} from '../controllers/users/signup.controllers.js';
import bodyParser from 'body-parser';
import checkIfUserIsConnected from '../controllers/middlewares/auth.middleware.js';
import extractUserIdFromToken from "../controllers/middlewares/jwt_id.middleware.js";
import {
    getUserProfile,
    updateDisplayName,
    updatePassword,
} from "../controllers/users/profile.controllers.js";

const router = express.Router();
let jsonParser = bodyParser.json()

router.post('/signup', jsonParser, signup);
router.post('/login', jsonParser, login)
router.get('/profile', extractUserIdFromToken, getUserProfile);
router.patch('/update/name', extractUserIdFromToken, updateDisplayName)
router.patch('/update/password', extractUserIdFromToken, updatePassword)


// route pour tester le login
router.post('/testlogin', checkIfUserIsConnected, jsonParser, function(req, res) {
    res.json({ok: "hi"})
})

export default router;