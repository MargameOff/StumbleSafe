import express from 'express';
import {login, signup} from '../controllers/users/signup.controllers.js';
import bodyParser from 'body-parser';
import checkIfUserIsConnected from '../controllers/middlewares/auth.middleware.js';

import {
    getUserProfile,
    updateDisplayName,
    updatePassword,
} from "../controllers/users/profile.controllers.js";

const router = express.Router();
let jsonParser = bodyParser.json()

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Succès de la requête. Retourne le profil de l'utilisateur.
 *       '401':
 *         description: Non autorisé. L'utilisateur n'est pas connecté.
 *       '404':
 *         description: Utilisateur non trouvé. L'utilisateur n'existe pas dans la base de données.
 *       '500':
 *         description: Erreur serveur. Impossible de récupérer le profil de l'utilisateur.
 */
router.get('/profile', checkIfUserIsConnected, getUserProfile);

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userInfos:
 *                 type: object
 *                 properties:
 *                   nom:
 *                     type: string
 *                     description: Le nom de l'utilisateur.
 *                   nom_affiche:
 *                     type: string
 *                     description: Le nom affiché de l'utilisateur.
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: L'adresse e-mail de l'utilisateur.
 *                   password:
 *                     type: string
 *                     description: Le mot de passe de l'utilisateur.
 *             required:
 *               - userInfos
 *     responses:
 *       '201':
 *         description: Utilisateur créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nom:
 *                   type: string
 *                   description: Le nom de l'utilisateur.
 *                 nom_affiche:
 *                   type: string
 *                   description: Le nom affiché de l'utilisateur.
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: L'adresse e-mail de l'utilisateur.
 *                 token:
 *                   type: string
 *                   description: Le token JWT généré pour l'utilisateur.
 *       '400':
 *         description: Requête invalide. Veuillez vérifier les données fournies.
 *       '500':
 *         description: Erreur serveur. Impossible de créer l'utilisateur.
 */
router.post('/signup', jsonParser, signup);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connexion de l'utilisateur
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userInfos:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: L'adresse e-mail de l'utilisateur.
 *                   password:
 *                     type: string
 *                     description: Le mot de passe de l'utilisateur.
 *             required:
 *               - userInfos
 *     responses:
 *       '200':
 *         description: Connexion réussie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indiquant que la connexion a réussi.
 *                 token:
 *                   type: string
 *                   description: Le token JWT généré pour l'utilisateur.
 *       '400':
 *         description: Identifiants invalides. Veuillez vérifier les données fournies.
 *       '500':
 *         description: Erreur serveur. Impossible de traiter la demande d'authentification.
 */
router.post('/login', jsonParser, login)

/**
 * @swagger
 * /api/users/update/name:
 *   patch:
 *     summary: Mettre à jour le nom affiché de l'utilisateur
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_affiche:
 *                 type: string
 *                 description: Le nouveau nom affiché de l'utilisateur.
 *     responses:
 *       '200':
 *         description: Profil utilisateur mis à jour avec succès.
 *       '401':
 *         description: Non autorisé. L'utilisateur n'est pas connecté.
 *       '404':
 *         description: Utilisateur non trouvé. L'utilisateur n'existe pas dans la base de données.
 *       '500':
 *         description: Erreur serveur. Impossible de mettre à jour le profil utilisateur.
 */
router.patch('/update/name', checkIfUserIsConnected, updateDisplayName)

/**
 * @swagger
 * /api/users/update/password:
 *   patch:
 *     summary: Mettre à jour le mot de passe de l'utilisateur
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Le mot de passe actuel de l'utilisateur.
 *               newPassword:
 *                 type: string
 *                 description: Le nouveau mot de passe de l'utilisateur.
 *             required:
 *               - password
 *               - newPassword
 *     responses:
 *       '200':
 *         description: Profil utilisateur mis à jour avec succès.
 *       '400':
 *         description: Requête invalide. Veuillez vérifier les données fournies.
 *       '401':
 *         description: Non autorisé. L'utilisateur n'est pas connecté.
 *       '404':
 *         description: Utilisateur non trouvé. L'utilisateur n'existe pas dans la base de données.
 *       '500':
 *         description: Erreur serveur. Impossible de mettre à jour le profil utilisateur.
 */
router.patch('/update/password', checkIfUserIsConnected, updatePassword)


// route pour tester le login
router.post('/testlogin', checkIfUserIsConnected, jsonParser, function(req, res) {
    res.json({ok: "hi"})
})

export default router;