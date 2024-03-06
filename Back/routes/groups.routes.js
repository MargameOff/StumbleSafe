import express from 'express';
import bodyParser from 'body-parser';
import { create, join, get } from '../controllers/users/group.controllers.js';
import checkIfUserIsConnected from '../controllers/middlewares/auth.middleware.js';

const router = express.Router();
let jsonParser = bodyParser.json()



/**
 * @swagger
 * /api/groups/create:
 *   post:
 *     summary: Créer un nouveau groupe
 *     tags:
 *       - Groups
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupInfos:
 *                 type: object
 *                 properties:
 *                   nom:
 *                     type: string
 *                     description: Le nom du nouveau groupe.
 *             required:
 *               - nom
 *     responses:
 *       '201':
 *         description: Groupe créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: L'identifiant unique du groupe.
 *                 nom:
 *                   type: string
 *                   description: Le nom du groupe.
 *                 code:
 *                   type: string
 *                   description: Le code d'accès au groupe.
 *                 actif:
 *                   type: boolean
 *                   description: Indique si le groupe est actif ou non.
 *                 membres:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       membreId:
 *                         type: string
 *                         description: L'identifiant unique du membre.
 *                       proprietaire:
 *                         type: boolean
 *                         description: Indique si le membre est propriétaire du groupe ou non.
 *       '400':
 *         description: Requête invalide. Veuillez vérifier les données fournies.
 *       '401':
 *         description: Non autorisé. L'utilisateur n'est pas connecté.
 *       '500':
 *         description: Erreur serveur. Impossible de créer le groupe.
 */
router.post('/create', checkIfUserIsConnected, jsonParser, create)

/**
 * @swagger
 * /api/groups/:
 *   get:
 *     summary: Tous les groupes auxquelles vous appartenez.
 *     tags:
 *       - Groups
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: false
 *     responses:
 *       '200':
 *         description: Tous les groupes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: L'identifiant unique du groupe.
 *                 nom:
 *                   type: string
 *                   description: Le nom du groupe.
 *                 code:
 *                   type: string
 *                   description: Le code d'accès au groupe.
 *                 actif:
 *                   type: boolean
 *                   description: Indique si le groupe est actif ou non.
 *                 membres:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       membreId:
 *                         type: string
 *                         description: L'identifiant unique du membre.
 *                       nom_affiche:
 *                         type: string
 *                         description: Le nom affiche du membre.
 *                       proprietaire:
 *                         type: boolean
 *                         description: Indique si le membre est propriétaire du groupe ou non.
 *       '400':
 *         description: Requête invalide. Veuillez vérifier les données fournies.
 *       '401':
 *         description: Non autorisé. L'utilisateur n'est pas connecté.
 *       '500':
 *         description: Erreur serveur. Impossible de rejoindre le groupe.
 */
router.get('/', checkIfUserIsConnected, jsonParser, get);

/**
 * @swagger
 * /api/groups/join:
 *   post:
 *     summary: Join a groupe with its code
 *     tags:
 *       - Groups
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupInfos:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     description: Le code du groupe.
 *             required:
 *               - code
 *     responses:
 *       '201':
 *         description: Groupe rejoint.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: L'identifiant unique du groupe.
 *                 nom:
 *                   type: string
 *                   description: Le nom du groupe.
 *                 code:
 *                   type: string
 *                   description: Le code d'accès au groupe.
 *                 actif:
 *                   type: boolean
 *                   description: Indique si le groupe est actif ou non.
 *                 membres:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       membreId:
 *                         type: string
 *                         description: L'identifiant unique du membre.
 *                       proprietaire:
 *                         type: boolean
 *                         description: Indique si le membre est propriétaire du groupe ou non.
 *       '400':
 *         description: Requête invalide. Veuillez vérifier les données fournies.
 *       '401':
 *         description: Non autorisé. L'utilisateur n'est pas connecté.
 *       '404':
 *         description: Le code n'est lié à aucun groupe
 *       '500':
 *         description: Erreur serveur. Impossible de rejoindre le groupe.
 */
router.post('/join', checkIfUserIsConnected, jsonParser, join)


export default router;