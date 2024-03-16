import express from 'express';
import bodyParser from 'body-parser';
import checkIfUserIsConnected from "../controllers/middlewares/auth.middleware.js";
import { cancelTrip, create, getTripInfo, getTrips, terminateTrip, updateTrip } from "../controllers/trips/trip.controllers.js";

const router = express.Router();
let jsonParser = bodyParser.json();


/**
 * @swagger
 * /api/trips/create:
 *   post:
 *     summary: Créer un nouveau trajet
 *     tags:
 *       - Trajets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom du nouveau trajet.
 *               groupIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Les identifiants uniques des groupes associés au trajet.
 *               startLocation:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     format: double
 *                     description: La latitude du lieu de départ.
 *                   longitude:
 *                     type: number
 *                     format: double
 *                     description: La longitude du lieu de départ.
 *               finishLocation:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     format: double
 *                     description: La latitude du lieu d'arrivée.
 *                   longitude:
 *                     type: number
 *                     format: double
 *                     description: La longitude du lieu d'arrivée.
 *               estimatedTime:
 *                 type: string
 *                 format: date-time
 *                 description: L'heure d'arrivée estimée du trajet.
 *     responses:
 *       '201':
 *         description: Trajet créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: L'identifiant unique du trajet.
 *                 name:
 *                   type: string
 *                   description: Le nom du trajet.
 *                 groupIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Les identifiants uniques des groupes associés au trajet.
 *                 start:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       description: La date et l'heure de départ du trajet.
 *                     location:
 *                       type: object
 *                       properties:
 *                         latitude:
 *                           type: number
 *                           format: double
 *                           description: La latitude du lieu de départ.
 *                         longitude:
 *                           type: number
 *                           format: double
 *                           description: La longitude du lieu de départ.
 *                 finish:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       description: L'heure d'arrivée estimée du trajet.
 *                     location:
 *                       type: object
 *                       properties:
 *                         latitude:
 *                           type: number
 *                           format: double
 *                           description: La latitude du lieu d'arrivée.
 *                         longitude:
 *                           type: number
 *                           format: double
 *                           description: La longitude du lieu d'arrivée.
 *       '400':
 *         description: Requête invalide. Veuillez vérifier les données fournies.
 *       '401':
 *         description: Non autorisé. L'utilisateur n'est pas connecté.
 *       '500':
 *         description: Erreur serveur. Impossible de créer le trajet.
 */
router.post('/create', checkIfUserIsConnected, jsonParser, create);

/**
 * @swagger
 * /api/trips/info:
 *   get:
 *     summary: Récupérer des informations sur un trajet
 *     tags:
 *       - Trajets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trip_id:
 *                 type: string
 *                 description: L'identifiant unique du trajet.
 *             required:
 *               - trip_id
 *     responses:
 *       '200':
 *         description: Informations sur le trajet récupérées avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: L'identifiant unique du trajet.
 *                 nom:
 *                   type: string
 *                   description: Le nom du trajet.
 *                 statut:
 *                   type: string
 *                   description: Le statut du trajet (en cours, terminé, annulé).
 *                 utilisateur:
 *                   type: string
 *                   description: L'identifiant unique de l'utilisateur associé au trajet.
 *                 groupes:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Les identifiants uniques des groupes associés au trajet.
 *                 depart:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       format: double
 *                       description: La latitude du lieu de départ.
 *                     longitude:
 *                       type: number
 *                       format: double
 *                       description: La longitude du lieu de départ.
 *                     _id:
 *                       type: string
 *                       description: L'identifiant unique du lieu de départ.
 *                 arrivee:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       format: double
 *                       description: La latitude du lieu d'arrivée.
 *                     longitude:
 *                       type: number
 *                       format: double
 *                       description: La longitude du lieu d'arrivée.
 *                     _id:
 *                       type: string
 *                       description: L'identifiant unique du lieu d'arrivée.
 *                 date_depart:
 *                   type: string
 *                   format: date-time
 *                   description: La date et l'heure de départ du trajet.
 *                 date_arrivee_estimee:
 *                   type: string
 *                   format: date-time
 *                   description: La date et l'heure d'arrivée estimée du trajet.
 *       '403':
 *         description: Accès refusé. Seul l'utilisateur concerné par le trajet peut obtenir des informations dessus.
 *       '404':
 *         description: Trajet non trouvé. Le trajet correspondant à l'identifiant fourni n'existe pas.
 *       '500':
 *         description: Erreur serveur. Impossible de récupérer les informations du trajet.
 */
router.get('/info', checkIfUserIsConnected, jsonParser, getTripInfo);

/**
 * @swagger
 * /api/trips/update:
 *   patch:
 *     summary: Mettre à jour les informations sur un trajet
 *     tags:
 *       - Trajets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trip_id:
 *                 type: string
 *                 description: L'identifiant unique du trajet.
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur pour confirmer la mise à jour.
 *               startLocation:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     format: double
 *                     description: La latitude du lieu de départ.
 *                   longitude:
 *                     type: number
 *                     format: double
 *                     description: La longitude du lieu de départ.
 *                 description: Les nouvelles coordonnées du lieu de départ.
 *               finishLocation:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     format: double
 *                     description: La latitude du lieu d'arrivée.
 *                   longitude:
 *                     type: number
 *                     format: double
 *                     description: La longitude du lieu d'arrivée.
 *                 description: Les nouvelles coordonnées du lieu d'arrivée.
 *               estimatedTime:
 *                 type: string
 *                 format: date-time
 *                 description: La nouvelle heure d'arrivée estimée du trajet.
 *             required:
 *               - trip_id
 *               - password
 *     responses:
 *       '200':
 *         description: Les informations sur le trajet ont été mises à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: L'identifiant unique du trajet mis à jour.
 *                 nom:
 *                   type: string
 *                   description: Le nom du trajet mis à jour.
 *                 statut:
 *                   type: string
 *                   description: Le statut mis à jour du trajet (en cours, terminé, annulé).
 *                 utilisateur:
 *                   type: string
 *                   description: L'identifiant unique de l'utilisateur associé au trajet mis à jour.
 *                 groupes:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Les identifiants uniques des groupes associés au trajet mis à jour.
 *                 depart:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       format: double
 *                       description: La latitude du lieu de départ mis à jour.
 *                     longitude:
 *                       type: number
 *                       format: double
 *                       description: La longitude du lieu de départ mis à jour.
 *                     _id:
 *                       type: string
 *                       description: L'identifiant unique du lieu de départ mis à jour.
 *                 arrivee:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       format: double
 *                       description: La latitude du lieu d'arrivée mis à jour.
 *                     longitude:
 *                       type: number
 *                       format: double
 *                       description: La longitude du lieu d'arrivée mis à jour.
 *                     _id:
 *                       type: string
 *                       description: L'identifiant unique du lieu d'arrivée mis à jour.
 *                 date_depart:
 *                   type: string
 *                   format: date-time
 *                   description: La date et l'heure de départ du trajet mis à jour.
 *                 date_arrivee_estimee:
 *                   type: string
 *                   format: date-time
 *                   description: La date et l'heure d'arrivée estimée du trajet mis à jour.
 *       '403':
 *         description: Accès refusé. Seul l'utilisateur concerné par le trajet peut le modifier.
 *       '404':
 *         description: Trajet non trouvé. Le trajet correspondant à l'identifiant fourni n'existe pas.
 *       '500':
 *         description: Erreur serveur. Impossible de mettre à jour les informations du trajet.
 */
router.patch('/update', checkIfUserIsConnected, jsonParser, updateTrip);

/**
 * @swagger
 * /api/trips/terminate:
 *   patch:
 *     summary: Terminer un trajet
 *     tags:
 *       - Trajets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trip_id:
 *                 type: string
 *                 description: L'identifiant unique du trajet à terminer.
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur pour confirmer la terminaison du trajet.
 *             required:
 *               - trip_id
 *               - password
 *     responses:
 *       '200':
 *         description: Le trajet a été terminer avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: L'identifiant unique du trajet.
 *                 nom:
 *                   type: string
 *                   description: Le nom du trajet.
 *                 statut:
 *                   type: string
 *                   description: Le statut actuel du trajet (en cours, terminé, annulé).
 *                 utilisateur:
 *                   type: string
 *                   description: L'identifiant de l'utilisateur associé au trajet.
 *                 groupes:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Les identifiants des groupes associés au trajet.
 *                 depart:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       description: La latitude du lieu de départ.
 *                     longitude:
 *                       type: number
 *                       description: La longitude du lieu de départ.
 *                 arrivee:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       description: La latitude du lieu d'arrivée.
 *                     longitude:
 *                       type: number
 *                       description: La longitude du lieu d'arrivée.
 *                 date_depart:
 *                   type: string
 *                   format: date-time
 *                   description: La date de départ du trajet.
 *                 date_arrivee_estimee:
 *                   type: string
 *                   format: date-time
 *                   description: La date d'arrivée estimée du trajet.
 *       '400':
 *         description: Mot de passe incorrect. Le mot de passe fourni est incorrect.
 *       '403':
 *         description: Accès refusé. Seul l'utilisateur concerné par le trajet peut le terminer.
 *       '404':
 *         description: Trajet non trouvé. Le trajet correspondant à l'identifiant fourni n'existe pas.
 *       '500':
 *         description: Erreur serveur. Impossible de terminer le trajet.
 */
router.patch('/terminate', checkIfUserIsConnected, jsonParser, terminateTrip);


/**
 * @swagger
 * /api/trips/cancel:
 *   patch:
 *     summary: Annuler un trajet
 *     tags:
 *       - Trajets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trip_id:
 *                 type: string
 *                 description: L'identifiant unique du trajet à annuler.
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur pour confirmer l'annulation du trajet.
 *             required:
 *               - trip_id
 *               - password
 *     responses:
 *       '200':
 *         description: Le trajet a été annuler avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: L'identifiant unique du trajet.
 *                 nom:
 *                   type: string
 *                   description: Le nom du trajet.
 *                 statut:
 *                   type: string
 *                   description: Le statut actuel du trajet (en cours, terminé, annulé).
 *                 utilisateur:
 *                   type: string
 *                   description: L'identifiant de l'utilisateur associé au trajet.
 *                 groupes:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Les identifiants des groupes associés au trajet.
 *                 depart:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       description: La latitude du lieu de départ.
 *                     longitude:
 *                       type: number
 *                       description: La longitude du lieu de départ.
 *                 arrivee:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       description: La latitude du lieu d'arrivée.
 *                     longitude:
 *                       type: number
 *                       description: La longitude du lieu d'arrivée.
 *                 date_depart:
 *                   type: string
 *                   format: date-time
 *                   description: La date de départ du trajet.
 *                 date_arrivee_estimee:
 *                   type: string
 *                   format: date-time
 *                   description: La date d'arrivée estimée du trajet.
 *       '400':
 *         description: Mot de passe incorrect. Le mot de passe fourni est incorrect.
 *       '403':
 *         description: Accès refusé. Seul l'utilisateur concerné par le trajet peut l'annuler.
 *       '404':
 *         description: Trajet non trouvé. Le trajet correspondant à l'identifiant fourni n'existe pas.
 *       '500':
 *         description: Erreur serveur. Impossible d'annuler le trajet.
 */
router.patch('/cancel', checkIfUserIsConnected, jsonParser, cancelTrip);

/**
 * @swagger
    * /api/trips/getTrips:
    *  get:
    *   summary: Récupérer les trajets de l'utilisateur
    *  tags:
    *   - Trajets
    * security:
    *  - bearerAuth: []
    * requestBody:
        * required: false
            * content:
                * application/json:
                *  groupIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Les identifiants uniques des groupes associés au trajet.
    * responses:
    *  '200':
    *       description: Succès de la requête. Retourne les trajets de l'utilisateur.
    * '401':
    *       description: Non autorisé. L'utilisateur n'est pas connecté.
    * '500':
    *       description: Erreur serveur. Impossible de récupérer les trajets de l'utilisateur.
    */
router.get('/getTrips', checkIfUserIsConnected, jsonParser, getTrips);

export default router;