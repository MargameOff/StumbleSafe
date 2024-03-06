import express from 'express';
import bodyParser from 'body-parser';
import { create } from '../controllers/users/group.controllers.js';
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
 *       - bearerAuth: []
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

export default router;