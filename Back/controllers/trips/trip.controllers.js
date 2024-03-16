import GroupModel from "../../models/group.models.js";
import TripModel from "../../models/trip.models.js";
import PositionModel from "../../models/position.models.js";
import RequestParsingError from "../../tools/error.js";
import {ObjectId} from "bson";
import bcrypt from "bcrypt";
import UserModel from "../../models/user.models.js";

/**
 * Création d'un trajet.
 * Le trajet contient notamment la liste des groupes associé, ainsi que le lieu de départ, arrivée et heure d'arrivée estimé
 *
 * Request Body :
 * {
 *    name: String,
 *    groupIds: ObjectID[]
 *    startLocation: {
 *        latitude: Number
 *        longitude: Number
 *    },
 *    finishLocation: {
 *        latitude: Number
 *        longitude: Number
 *    }
 *    estimatedTime: Date
 * }
 *
 * Response Body :
 * {
 *    id: ObjectID
 *    name: String,
 *    groupIds: ObjectID[]
 *    start: {
 *        timestamp: Date
 *        location:  {
 *            latitude: Number
 *            longitude: Number
 *        }
 *    },
 *    finish: {
 *        timestamp: Date
 *        location:  {
 *            latitude: Number
 *            longitude: Number
 *        }
 *    }
 * }
 */
const create = async (req, res) => {
    try {
        const { name, groupIds, startLocation, finishLocation, estimatedTime } = req.body;
        const userId = req.user.id;
        const estimatedTimeDate = Date.parse(estimatedTime);
        const uniqueGroupIds = Array.from(new Set(groupIds));
        const currentDate = Date.now();

        // Vérifier la validité des paramètres
        checkNameValidity(name);
        await checkGroupsValidity(uniqueGroupIds, userId);
        checkLocationsValidity(startLocation, 'lieu de départ');
        checkLocationsValidity(finishLocation, 'lieu d\'arrivée');
        checkEstimatedTimeValidity(estimatedTimeDate, currentDate);

        // Ajouter le trajet dans la base de donnée
        const newTrip = new TripModel({
            nom: name,
            utilisateur:userId,
            groupes: uniqueGroupIds,
            depart: { latitude: startLocation.latitude, longitude: startLocation.longitude},
            arrivee: { latitude: finishLocation.latitude, longitude: finishLocation.longitude},
            date_depart: currentDate,
            date_arrivee_estimee: estimatedTime
        });

        const trip = await newTrip.save();


        // Ajouter le départ à la base de donnée
        // Remarque : on n'ajoute pas l'arrivée à la base de données car c'est une arrivée ESTIMEE, et donc pas une véritable localisation
        // Pour simplification : on fait l'hypothèse que la localisation de départ est réelle
        const newStart = new PositionModel({
            coordonnees: { latitude: startLocation.latitude, longitude: startLocation.longitude },
            timestamp: currentDate,
            trajet: trip.id
        });

        const start = await newStart.save();


        // Créer la réponse et la renvoyer
        const response = {
            id: trip.id,
            name: trip.nom,
            groupIds: trip.groupes,
            start: {
                timestamp: trip.date_depart,
                location:  {
                    latitude: trip.depart.latitude,
                    longitude: trip.depart.longitude
                }
            },
            finish: {
                timestamp: trip.date_arrivee_estimee,
                location:  {
                    latitude: trip.arrivee.latitude,
                    longitude: trip.arrivee.longitude,
                }
            }
        };
        res.status(201).json(response);
    } catch (error) {
        // Gérer les erreurs
        if (error instanceof RequestParsingError) {
            res.status(error.code).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Erreur lors de la création du trajet.', error: error.message });
        }
    }
}

/**
 * Recupère des informations sur le trajet correspondant à l'id 'trip_id'
 * Les informations sont affiché seulement si l'utilisateur qui effectue la requete à effectué ou effectue le trajet
 * Pour l'instant, les membres de groupe ne peuvent pas voir les infos sur le trajet
 * Cela sera implémenté lors des gestions de confidentialité
 *
 *  Request Body :
 *  {
 *      trip_id: ObjectID[]
 *  }
 *
 *  Response Body :
 *  {
 *     "_id": ObjectID[],
 *     "nom": String,
 *     "statut": String,
 *     "utilisateur": ObjectID[],
 *     "groupes": [
 *         ObjectID[]
 *     ],
 *     "depart": {
 *         "latitude": Number,
 *         "longitude": Number,
 *         "_id": ObjectID[]
 *     },
 *     "arrivee": {
 *         "latitude": Number,
 *         "longitude": Number,
 *         "_id": ObjectID[]
 *     },
 *     "date_depart": Date,
 *     "date_arrivee_estimee": Date,
 *  }
 */
const getTripInfo = async (req, res) => {
    try {
        // L'ID de l'utilisateur est extrait à partir du token JWT
        const userId = req.user.id
        const {trip_id} = req.body;

        const trip = await TripModel.findById(trip_id)

        // Cas où le trajet n'est pas trouvé
        if (!trip)
        {
            return res.status(404).json({message: "Trajet non trouvé"});
        }

        // TODO pour l'instant, seul l'utilisateur effectuant le trajet, ou ayant effectué le trajet peut avoir des informations dessus
        //  a l'avenir, il y aura des questions de confidentialité a gerer, avec des membres de groupe qui pourront voir les trajet des autres
        if (trip.utilisateur.toString() !== userId)
        {
            return res.status(403).json({message : "Seul l'utilisateur concerné par le trajet peut avoir des informations dessus"})
        }
        else
        {
            console.log("Trajet trouvé")
            res.status(200).json(trip)
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des informations du trajet', error:error.message})
    }
}

/**
 * Mettre a jour les informations sur le trajet correspondant à l'id 'trip_id'
 * Mise a jour seulement si l'utilisateur effectue le trajet, et que son mot de passe est correct
 * Mise a jour seulement si le trajet est "en cours"
 * Données pouvant être mise a jour :
 *  - Lieu de départ
 *  - Lieu d'arrivée
 *  - Heure d'arrivée estimé
 *  Seul les champs fournis sont mis a jour
 *
 *  Request Body :
 *  {
 *      trip_id: ObjectID[],
 *      password: String,
 *      startLocation : {
 *          latitude: Number,
 *          longitude: Number
 *      },
 *      finishLocation: {
 *          latitude: Number
 *          longitude: Number
 *      },
 *      estimatedTime : Date
 *  }
 *
 *  Response Body :
 *  {
 *     "_id": ObjectID[],
 *     "nom": String,
 *     "statut": String,
 *     "utilisateur": ObjectID[],
 *     "groupes": [
 *         ObjectID[]
 *     ],
 *     "depart": {
 *         "latitude": Number,
 *         "longitude": Number,
 *         "_id": ObjectID[]
 *     },
 *     "arrivee": {
 *         "latitude": Number,
 *         "longitude": Number,
 *         "_id": ObjectID[]
 *     },
 *     "date_depart": Date,
 *     "date_arrivee_estimee": Date,
 *  }
 */
const updateTrip = async (req, res) => {
    try {
        // L'ID de l'utilisateur est extrait à partir du token JWT
        const userId = req.user.id
        const user = await UserModel.findById(userId);

        const { trip_id, password, startLocation, finishLocation, estimatedTime } = req.body;

        // On récupère le trajet correspondant
        const trip = await TripModel.findById(trip_id)

        // Cas où le trajet n'est pas trouvé
        if (!trip)
        {
            return res.status(404).json({message: "Trajet non trouvé"});
        }

        // On vérifie que l'utilisateur qui souhaite modifier le trajet est bien l'utilisateur concerné
        if (trip.utilisateur.toString() !== userId)
        {
            return res.status(403).json({message : "Seul l'utilisateur concerné par le trajet peut le modifier"})
        }
        else
        {
            console.log("Trajet trouvé")

            // On vérifie que le trajet est bien "en cours" pour pouvoir le modifier
            if (trip.statut !== 'en cours')
            {
                return res.status(403).json({message: "Seul un trajet 'en cours' peut être modifié"});
            }

            // On peut mettre à jour le trajet seulement si on fournit notre mot de passe et qu'il est correct
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({message: "Mot de passe incorrect"})
            }

            // Modification du trajet (si mot de passe correct)
            // Seuls les champs renseignés subissent une modification
            if (startLocation)
            {
                console.log("start : ", startLocation)
                trip.depart.longitude = startLocation.longitude
                trip.depart.latitude = startLocation.latitude
            }
            if (finishLocation)
            {
                console.log("finish : ",finishLocation)
                trip.arrivee.longitude = finishLocation.longitude
                trip.arrivee.latitude = finishLocation.latitude
            }
            if (estimatedTime)
            {
                // On vérifie que la date d'arrivée estimé est cohérente avant de faire des modifications
                const estimatedTimeDate = Date.parse(estimatedTime);
                const startTimeDate = Date.parse(trip.date_depart)
                checkEstimatedTimeValidity(estimatedTimeDate, startTimeDate);

                // Modification de la date d'arrivée estimée
                console.log("estimated time :", estimatedTime)
                trip.date_arrivee_estimee = estimatedTime
            }

            // Enregistrer les modifications
            await trip.save();
            res.status(200).json(trip)
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la modification du trajet', error:error.message})
    }
}

/**
 * Annulation du trajet correspondant à l'id 'trip_id'
 * L'utilisateur doit fournir un mot de passe correct pour annuler le trajet
 * Fait passer le status du trajet de 'en cours' a 'annulé'
 *
 *  Request Body :
 *  {
 *      trip_id: ObjectID[]
 *      password: String
 *  }
 *
 *  Response Body :
 *  {
 *     "_id": ObjectID[],
 *     "nom": String,
 *     "statut": String,
 *     "utilisateur": ObjectID[],
 *     "groupes": [
 *         ObjectID[]
 *     ],
 *     "depart": {
 *         "latitude": Number,
 *         "longitude": Number,
 *         "_id": ObjectID[]
 *     },
 *     "arrivee": {
 *         "latitude": Number,
 *         "longitude": Number,
 *         "_id": ObjectID[]
 *     },
 *     "date_depart": Date,
 *     "date_arrivee_estimee": Date,
 *  }
 */
const cancelTrip = async (req, res) => {
    try {
        // L'ID de l'utilisateur est extrait à partir du token JWT
        const userId = req.user.id
        const user = await UserModel.findById(userId);

        const { trip_id, password } = req.body;

        // On récupère le trajet correspondant
        const trip = await TripModel.findById(trip_id)

        // Cas où le trajet n'est pas trouvé
        if (!trip)
        {
            return res.status(404).json({message: "Trajet non trouvé"});
        }

        // On vérifie que l'utilisateur qui souhaite annuler le trajet est bien l'utilisateur concerné
        if (trip.utilisateur.toString() !== userId)
        {
            return res.status(403).json({message : "Seul l'utilisateur concerné par le trajet peut l'annuler"})
        }
        else
        {
            console.log("Trajet trouvé")

            // On vérifie que le trajet est bien "en cours" pour pouvoir l'annuler
            if (trip.statut !== 'en cours')
            {
                return res.status(403).json({message: "Seul un trajet 'en cours' peut être annulé"});
            }

            // On peut annuler trajet seulement si on fournit notre mot de passe et qu'il est correct
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({message: "Mot de passe incorrect"})
            }

            // Annulation du trajet (si mot de passe correct)
            trip.statut = 'annulé'

            // Enregistrer les modifications
            await trip.save();
            res.status(200).json(trip)
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'annulation du trajet', error:error.message})
    }
}

/**
 * Terminer le trajet correspondant à l'id 'trip_id'
 * L'utilisateur doit fournir un mot de passe correct pour terminer le trajet
 * Fait passer le status du trajet de 'en cours' a 'terminé'
 * Un trajet 'terminé' est un trajet qui s'est effectué sans problème, l'utilisateur est bien arrivé au lieu d'arrivée prévu
 *
 *  Request Body :
 *  {
 *      trip_id: ObjectID[]
 *      password: String
 *  }
 *
 *  Response Body :
 *  {
 *     "_id": ObjectID[],
 *     "nom": String,
 *     "statut": String,
 *     "utilisateur": ObjectID[],
 *     "groupes": [
 *         ObjectID[]
 *     ],
 *     "depart": {
 *         "latitude": Number,
 *         "longitude": Number,
 *         "_id": ObjectID[]
 *     },
 *     "arrivee": {
 *         "latitude": Number,
 *         "longitude": Number,
 *         "_id": ObjectID[]
 *     },
 *     "date_depart": Date,
 *     "date_arrivee_estimee": Date,
 *  }
 */
const terminateTrip = async (req, res) => {
    try {
        // L'ID de l'utilisateur est extrait à partir du token JWT
        const userId = req.user.id
        const user = await UserModel.findById(userId);

        const { trip_id, password } = req.body;

        // On récupère le trajet correspondant
        const trip = await TripModel.findById(trip_id)

        // Cas où le trajet n'est pas trouvé
        if (!trip)
        {
            return res.status(404).json({message: "Trajet non trouvé"});
        }

        // On vérifie que l'utilisateur qui souhaite terminer le trajet est bien l'utilisateur concerné
        if (trip.utilisateur.toString() !== userId)
        {
            return res.status(403).json({message : "Seul l'utilisateur concerné par le trajet peut le terminé"})
        }
        else
        {
            console.log("Trajet trouvé")

            // On vérifie que le trajet est bien "en cours" pour pouvoir le terminer
            if (trip.statut !== 'en cours')
            {
                return res.status(403).json({message: "Seul un trajet 'en cours' peut être terminé"});
            }

            // On peut annuler trajet seulement si on fournit notre mot de passe et qu'il est correct
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({message: "Mot de passe incorrect"})
            }

            // On termine le trajet (si mot de passe correct)
            trip.statut = 'terminé'

            // Enregistrer les modifications
            await trip.save();
            res.status(200).json(trip)
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur pour terminer le trajet', error:error.message})
    }
}

const getTrips = async (req, res) => {
    try {
        //si la requête ne contient pas de groupeId, on renvoie tous les trajets des membres des groupes de l'utilisateur
        if (!req.body.groupId) {
            const userId = req.user.id;
            const user = await UserModel.findById(userId);
            const groupIds = user.groupes;
            const trips = await TripModel.find({groupes: {$in: groupIds}});
            res.status(200).json(trips);
        }
        //sinon on renvoie tous les trajets du groupe
        else {
            const groupId = req.body.groupId;
            const trips = await TripModel.find({groupes: groupId, statut: "en cours"});
            res.status(200).json(trips);
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des trajets', error: error.message });
    }
        
}



const checkNameValidity = (name) => {
    if (!name) {
        throw new RequestParsingError(400, 'Le nom du trajet est manquant.');
    }
    if (name.length > 50) {
        throw new RequestParsingError(400, 'Le nom du trajet est trop long.');
    }
};

const checkGroupsValidity = async (groupIds, userId) => {
    if (!groupIds) {
        throw new RequestParsingError(400, 'La liste des groupes est manquante.');
    }
    if (groupIds.length === 0) {
        throw new RequestParsingError(400, 'La liste des groupes doit au moins contenir un groupe.');
    }
    await checkIfUserIsInGroups(groupIds, userId);
};

const checkLocationsValidity = (location, nameOfLocation) => {
    if (!location) {
        throw new RequestParsingError(400, `Le ${nameOfLocation} est manquant.`);
    }
    if (!location.latitude) {
        throw new RequestParsingError(400, `La latitude du ${nameOfLocation} est manquante.`);
    }
    if (!location.longitude) {
        throw new RequestParsingError(400, `La longitude du ${nameOfLocation} est manquante.`);
    }
};

const checkEstimatedTimeValidity = (estimatedTime, currentTime) => {
    if (!estimatedTime) {
        throw new RequestParsingError(400, 'L\'heure estimée d\'arrivée est manquante.');
    }
    if (isNaN(estimatedTime)) {
        throw new RequestParsingError(400, 'L\'heure estimée d\'arrivée ne correspond pas au format attendu.');
    }
    if (estimatedTime <= currentTime) {
        throw new RequestParsingError(400, 'L\'heure d\'arrivée doit être dans le futur.');
    }
};

/**
 * Vérifie si l'utilisateur @param userId appartient à tous les groupes de la liste @param groupIds.
 * @param {Number[]} groupIds ObjectID du groupe.
 * @param {Number} userId ObjectID de l'utilisateur.
 * @returns vraie si un tel l'utilisateur appartient au groupe, faux si il n'y appartient pas ou si le groupe n'existe pas.
 */
const checkIfUserIsInGroups = async (groupIds, userId) => {
    for (const groupId of groupIds) {
        if (!ObjectId.isValid(groupId)) {
            throw new RequestParsingError(400, `L'id de groupe ${groupId} ne correspond pas au format ObjectID attendu.`);
        }
        const isUserInGroup = await GroupModel.findOne(
            {
                _id: groupId,
                membres: {
                    $elemMatch: {
                        _id: userId
                    }
                }
            });
        if (!isUserInGroup) {
            throw new RequestParsingError(400, 'L\'utilisateur n\'appartient pas à tout les groupes ou le groupe n\'existe pas.');
        }
    }
}

export { create, getTripInfo, updateTrip, cancelTrip, terminateTrip, getTrips}