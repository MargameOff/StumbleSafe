import GroupModel from "../../models/group.models.js";
import TripModel from "../../models/trip.models.js";
import PositionModel from "../../models/position.models.js";
import RequestParsingError from "../../tools/error.js";
import {ObjectId} from "bson";

/**
 * Request Body :
 * {
 *    name: String,
 *    groupeIds: ObjectID[]
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
 *        id: ObjectID
 *        timestamp: Date
 *        location:  {
 *            latitude: Number
 *            longitude: Number
 *        }
 *    },
 *    finish: {
 *        id: ObjectID
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

        // Vérifier la validité des paramètres
        checkNameValidity(name);
        await checkGroupsValidity(uniqueGroupIds, userId);
        checkLocationsValidity(startLocation, 'lieu de départ');
        checkLocationsValidity(finishLocation, 'lieu d\'arrivée');
        checkEstimatedTimeValidity(estimatedTimeDate);

        // Ajouter le trajet dans la base de donnée
        const newTrip = new TripModel({ nom: name, utilisateur:userId, groupes: uniqueGroupIds});
        const trip = await newTrip.save();

        // Ajouter le départ et l'arrivée à la base de données
        const currentDate = Date.now();
        const newStart = new PositionModel({
            coordonnees: { latitude: startLocation.latitude, longitude: startLocation.longitude },
            timestamp: currentDate,
            trajet: trip.id
        });
        const newFinish = new PositionModel({
            coordonnees: { latitude: finishLocation.latitude, longitude: finishLocation.longitude },
            timestamp: estimatedTime,
            trajet: trip.id
        });

        const start = await newStart.save();
        const finish = await newFinish.save();

        // Créer la réponse et la renvoyer
        const response = {
            id: trip.id,
            name: trip.nom,
            groupIds: trip.groupes,
            start: {
                id: start.id,
                timestamp: start.timestamp,
                location:  {
                    latitude: start.coordonnees.latitude,
                    longitude: start.coordonnees.longitude
                }
            },
            finish: {
                id: finish.id,
                timestamp: finish.timestamp,
                location:  {
                    latitude: finish.coordonnees.latitude,
                    longitude: finish.coordonnees.longitude
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

/**
 *
 * @param location
 * @param nameOfLocation
 */
const checkLocationsValidity = (location, nameOfLocation) => {
    if (!location) {
        throw new RequestParsingError(400, `Le ${nameOfLocation} est manquant.`);
    }
    if (!location.latitude) {
        throw new RequestParsingError(400, `La latitude du ${nameOfLocation} est manquant.`);
    }
    if (!location.longitude) {
        throw new RequestParsingError(400, `La longitude du ${nameOfLocation} est manquant.`);
    }
};

const checkEstimatedTimeValidity = (estimatedTime) => {
    if (!estimatedTime) {
        throw new RequestParsingError(400, 'L\'heure estimée d\'arrivée est manquante.');
    }
    if (isNaN(estimatedTime)) {
        throw new RequestParsingError(400, 'L\'heure estimée d\'arrivée ne correspond pas au format attendu.');
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
                        membreId: userId
                    }
                }
            });
        if (!isUserInGroup) {
            throw new RequestParsingError(400, 'L\'utilisateur n\'appartient pas à tout les groupes ou le groupe n\'existe pas.');
        }
    }
}

export { create }