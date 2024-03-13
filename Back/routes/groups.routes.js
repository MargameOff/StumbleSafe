import express from 'express';
import bodyParser from 'body-parser';
import {create, join, get, update_group, quit, delete_group} from '../controllers/users/group.controllers.js';
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
 *     summary: Rejoindre un groupe avec le code associé
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


/**
 * @swagger
 * /api/groups/quit:
 *   post:
 *     summary: Quitter un groupe
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
 *                   code:
 *                     type: string
 *                     description: Le code du groupe à quitter.
 *                 required:
 *                   - code
 *             required:
 *               - groupInfos
 *     responses:
 *       '200':
 *         description: L'utilisateur a quitté le groupe avec succès. Seul les membres d'un groupe non propriétaire du groupe peuvent le quitter
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
 *                   type: number
 *                   description: Le code du groupe.
 *                 actif:
 *                   type: boolean
 *                   description: L'état d'activation du groupe.
 *                 membres:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: L'identifiant unique du membre du groupe.
 *                       nom_affiche:
 *                         type: string
 *                         description: Le nom affiché du membre.
 *                       proprietaire:
 *                         type: boolean
 *                         description: Indique si le membre est propriétaire du groupe.
 *       '400':
 *         description: Les informations du groupe à quitter sont manquantes.
 *       '403':
 *         description: Vous n'avez pas le droit de quitter ce groupe. Les propriétaires de groupe ne peuvent pas quitter leurs groupes. Ils doivent le supprimer
 *       '404':
 *         description: Vous ne pouvez pas quitter un groupe auquel vous n'appartenez pas.
 *       '500':
 *         description: Erreur serveur. Impossible de quitter le groupe.
 */
router.post('/quit', checkIfUserIsConnected, jsonParser, quit)



/**
 * @swagger
 * /api/groups/group-info:
 *   patch:
 *     summary: Mettre à jour les informations d'un groupe, nom du groupe
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
 *                     description: Le nouveau nom du groupe.
 *                   code:
 *                     type: string
 *                     description: Le code du groupe à mettre à jour.
 *                 required:
 *                   - code
 *             required:
 *               - groupInfos
 *     responses:
 *       '200':
 *         description: Les informations du groupe ont été mises à jour avec succès. Tout les membres appartenant au groupe peuvent modifier le nom du groupe.
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
 *                   description: Le nom mis à jour du groupe.
 *                 code:
 *                   type: string
 *                   description: Le code du groupe.
 *                 actif:
 *                   type: boolean
 *                   description: L'état d'activation du groupe.
 *                 membres:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: L'identifiant unique du membre du groupe.
 *                       nom_affiche:
 *                         type: string
 *                         description: Le nom affiché du membre.
 *                       proprietaire:
 *                         type: boolean
 *                         description: Indique si le membre est propriétaire du groupe.
 *       '404':
 *         description: Ce code n'existe pas parmi les groupes auxquels vous appartenez.
 *       '500':
 *         description: Erreur serveur. Impossible de mettre à jour les informations du groupe.
 */
router.patch('/group-info', checkIfUserIsConnected, jsonParser, update_group);

/**
 * @swagger
 * /api/groups/delete:
 *   delete:
 *     summary: Supprimer un groupe
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
 *                   code:
 *                     type: string
 *                     description: Le code du groupe à supprimer.
 *                 required:
 *                   - code
 *             required:
 *               - groupInfos
 *     responses:
 *       '200':
 *         description: Le groupe a été supprimé avec succès. Seul le propriétaire du groupe peut supprimer le groupe. Le groupe n'apparaitera plus pour les membres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de confirmation indiquant que le groupe a été supprimé.
 *       '400':
 *         description: Les informations du groupe à supprimer sont manquantes.
 *       '403':
 *         description: Vous n'avez pas le droit de supprimer ce groupe. Vous devez être son propriétaire pour le pouvoir.
 *       '404':
 *         description: Vous ne pouvez pas supprimer un groupe auquel vous n'appartenez pas.
 *       '500':
 *         description: Erreur serveur. Impossible de supprimer le groupe.
 */
router.delete('/delete', checkIfUserIsConnected, jsonParser, delete_group);
export default router;