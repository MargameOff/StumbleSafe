import GroupModel from "../../models/group.models.js";
import TripModel from "../../models/trip.models.js";
import PositionModel from "../../models/position.models.js";
import RequestParsingError from "../../tools/error.js";
import {ObjectId} from "bson";
import bcrypt from "bcrypt";
import UserModel from "../../models/user.models.js";

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
        const currentDate = Date.now();

        // Vérifier la validité des paramètres
        checkNameValidity(name);
        await checkGroupsValidity(uniqueGroupIds, userId);
        checkLocationsValidity(startLocation, 'lieu de départ');
        checkLocationsValidity(finishLocation, 'lieu d\'arrivée');
        checkEstimatedTimeValidity(estimatedTimeDate, currentDate);

        // Ajouter le trajet dans la base de donnée
        const newTrip = new TripModel({ nom: name, utilisateur:userId, groupes: uniqueGroupIds});
        const trip = await newTrip.save();

        // Ajouter le départ et l'arrivée à la base de données
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

/**
 * Recupère des informations sur le trajet correspondant à l'id 'trip_id'
 * Les informations sont affiché seulement si l'utilisateur qui effectue la requete à effectué ou effectue le trajet
 * Pour l'instant, les membres de groupe ne peuvent pas voir les infos sur le trajet
 * Cela sera implémenté lors des gestions de confidentialité
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
            // On peut mettre à jour le trajet seulement si on fournit notre mot de passe et qu'il est correct
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({message: "Mot de passe incorrect"})
            }

            // Modification du trajet (si mot de passe correct)
            // TODO mettre a jour le modèle objet, pour pouvoir effectuer les modifications, car pour l'instant il est impossible de retouver les start et finish position
            if (startLocation)
            {
                console.log("start : ", startLocation)
            }
            if (finishLocation)
            {
                console.log("finish : ",finishLocation)
            }
            if (estimatedTime)
            {
                console.log("estimated time :", estimatedTime)
            }

            res.status(200).json(trip)
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la modification du trajet', error:error.message})
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
        throw new RequestParsingError(400, `La latitude du ${nameOfLocation} est manquant.`);
    }
    if (!location.longitude) {
        throw new RequestParsingError(400, `La longitude du ${nameOfLocation} est manquant.`);
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
                        membreId: userId
                    }
                }
            });
        if (!isUserInGroup) {
            throw new RequestParsingError(400, 'L\'utilisateur n\'appartient pas à tout les groupes ou le groupe n\'existe pas.');
        }
    }
}

export { create, getTripInfo, updateTrip}