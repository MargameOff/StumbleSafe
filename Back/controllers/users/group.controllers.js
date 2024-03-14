import GroupModel from '../../models/group.models.js';
import UserModel from "../../models/user.models.js";

/**
 * 
 * Request body : {
 * groupInfos: {
 *  nom: string,
 * }
 * }
 * 
 * Response body : Group's model
 * 
 */
const create = async (req, res) => {
    try {

        // Vérifier si l'utilisateur est déjà dans un groupe avec ce nom
        const { nom } = req.body.groupInfos; // Assurez-vous que req.body.groupInfos contient les données correctes

        if(!req.body.groupInfos){
            return res.status(400).json({ message: 'Les informations du nouveau groupe sont manquantes' });
        }

        // Vérification des champs obligatoires
        if(!nom){
            return res.status(400).json({ message: 'Les informations du nouveau groupe sont manquantes' });
        }

        var code;
        do {
            code = generateCode(6);
        } while(await checkIfCodeExists(code));

        // Créer un nouveau groupe en utilisant le modèle Mongoose
        const newGroup = new GroupModel({ nom, code, membres: [{
            _id: req.user.id,
            proprietaire: true
        }] });
    
        // Enregistrer le groupe dans la base de données
        const group = await newGroup.save();

        // Répondre avec le groupe créé
        res.status(201).json(group);
    } catch (error) {
        // Gérer les erreurs
        res.status(500).json({ message: 'Erreur lors de la création du groupe', error: error.message });
    }
}

/**
 *
 * Request body :
 * groupInfos: {
 *  code: string
 * }
 * Response body :
 * [
 *     "_id": ObjetID,
 *     "nom": String,
 *     "code": Number,
 *     "actif": Boolean,
 *     "membres":
 *     [
 *         "_id": ObjetID,
 *         "nom_affiche": String,
 *         "proprietaire": Boolean
 *     ]
 * ]
 */
const delete_group = async (req, res) => {
    try {
        const userId = req.user.id;
        const { code } = req.body.groupInfos;

        if(!req.body.groupInfos){
            return res.status(400).json({ message: 'Les informations du groupe a supprimer sont manquantes' });
        }

        // On récupère le groupe a supprimer
        const group = await getGroupByCodeForUser(userId, code);
        if (group == null) {
            return res.status(404).json({ message: 'Vous ne pouvez pas supprimer un groupe auquel vous n\'appartenez pas !' });
        }

        // Vérifier si l'utilisateur est membre propriétaire du groupe
        const memberIndex = group.membres.findIndex(member => member._id.toString() === userId && member.proprietaire);
        if (memberIndex === -1) {
            return res.status(403).json({ message: 'Vous n\'avez pas le droit de supprimer ce groupe. Vous devez être son propriétaire pour le pouvoir' });
        }

        // Supprimer le groupe de la base de données
        await GroupModel.deleteOne({ code: code });

        // Répondre avec un message de succès
        res.status(200).json({ message: 'Le groupe a été supprimé avec succès' });

    } catch (error) {
        // Gérer les erreurs
        res.status(500).json({ message: 'Erreur pour quitter ce groupe', error: error.message });
    }
}

/**
 *
 * Request body :
 *
 * Response body :
 * [
 *     "_id": ObjetID,
 *     "nom": String,
 *     "code": Number,
 *     "actif": Boolean,
 *     "membres":
 *     [
 *         "_id": ObjetID,
 *         "nom_affiche": String,
 *         "proprietaire": Boolean
 *     ]
 * ]
 */
const get = async (req, res) => {
    try  {
        const userId = req.user.id;
        // On récupère les groupes
        const groups = await getUserGroup(userId);

        // On récupère le nom des membres des différents groupes
        const response = [];
        for (let group of groups) {
            const members = [];
            for (let membre of group.membres) {
                const membreInfo = await UserModel.findById(membre._id);
                if (!membreInfo) {
                    res.status(404).json({ message: `Impossible de trouver l'utilisateur d'ID ${group._id} appartenant au groupe d'ID ${membre._id}.` });
                }
                members.push({ _id: membre._id, nom_affiche: membreInfo.nom_affiche, proprietaire: membre.proprietaire })
            }
            response.push({ _id: group.id, nom: group.nom, code: group.code, actif:group.actif, membres: members });
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des groupes de l\'utilisateur.', error: error.message });
    }
}

/**
 *
 * Request body :
 * groupInfos: {
 *  nom: string,
 *  code: string
 * }
 * Response body :
 * [
 *     "_id": ObjetID,
 *     "nom": String,
 *     "code": Number,
 *     "actif": Boolean,
 *     "membres":
 *     [
 *         "_id": ObjetID,
 *         "nom_affiche": String,
 *         "proprietaire": Boolean
 *     ]
 * ]
 */
const update_group = async (req, res) => {
    try  {
        const userId = req.user.id;
        const { code, nom } = req.body.groupInfos; // Assurez-vous que req.body.groupInfos contient les données correctes
        // On récupère le groupe
        const group = await getGroupByCodeForUser(userId, code);
        if (group == null) {
            return res.status(404).json({ message: 'Ce code n\'existe pas parmis les groupes auquels vous appartenez !' });
        }

        // Modification du groupe : modification du nom
        console.log("Groupe trouvé")
        if (nom)
        {
            group.nom = nom
            await group.save();      // Sauvegarder en BD
        }
        res.status(200).json(group);

    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du groupes de l\'utilisateur. Le code fourni ne correspond pas a un groupe où il l\'utilisateur appartient', error: error.message });
    }
}


/**
 * 
 * Request body : {
 * groupInfos: {
 *  code: string,
 * }
 * }
 * 
 * Response body : Group's model
 */
const join = async (req, res) => {
    try {

        // Vérifier si l'utilisateur est déjà dans un groupe avec ce nom
        const { code } = req.body.groupInfos; // Assurez-vous que req.body.groupInfos contient les données correctes
        
        if(!req.body.groupInfos){
            return res.status(400).json({ message: 'Les informations du nouveau groupe sont manquantes' });
        }
        
        const group = await getGroupByCode(code);
        // Vérification de l'existance d'un groupe
        if (group == null) {
            return res.status(404).json({ message: 'Ce code n\'existe pas !' });
        }

        /**
         * Verifie s'il n'est pas déjà dans le groupe
         */
        var userFound = false
        group.membres.forEach((member) => {
            if(member._id == req.user.id) {
                userFound = true
            }
        });
        
        if(userFound) {
            return res.status(400).json({ message: 'Vous êtes déjà dans ce groupe' });
        }

        const newData = { proprietaire: false, _id: req.user.id};
        const addedUser = await GroupModel.updateOne({ code: code }, {
            $push: { 
                membres: newData
            }
        });

        group.membres.push(newData);

        // Répondre avec le groupe rejoint
        res.status(201).json(group);
    } catch (error) {
        // Gérer les erreurs
        res.status(500).json({ message: 'Erreur pour rejoindre ce groupe', error: error.message });
    }
}

/**
 *
 * Request body :
 * groupInfos: {
 *  code: string
 * }
 * Response body :
 * [
 *     "_id": ObjetID,
 *     "nom": String,
 *     "code": Number,
 *     "actif": Boolean,
 *     "membres":
 *     [
 *         "_id": ObjetID,
 *         "nom_affiche": String,
 *         "proprietaire": Boolean
 *     ]
 * ]
 */
const quit = async (req, res) => {
    try {
        const userId = req.user.id;
        const { code } = req.body.groupInfos;

        if(!req.body.groupInfos){
            return res.status(400).json({ message: 'Les informations du groupe a quitter sont manquantes' });
        }

        // On récupère le groupe a quitter
        const group = await getGroupByCodeForUser(userId, code);
        if (group == null) {
            return res.status(404).json({ message: 'Vous ne pouvez pas quitter un groupe auquel vous n\'appartenez pas !' });
        }

        // Vérifier si l'utilisateur est membre non propriétaire du groupe
        const memberIndex = group.membres.findIndex(member => member._id.toString() === userId && !member.proprietaire);
        if (memberIndex === -1) {
            return res.status(403).json({ message: 'Vous n\'avez pas le droit de quitter ce groupe' });
        }

        // Retirer l'utilisateur de la liste des membres
        group.membres.splice(memberIndex, 1);

        // Mettre à jour le groupe en base de données
        await GroupModel.updateOne({ code: code }, { membres: group.membres });

        // Répondre avec le groupe mis à jour
        res.status(200).json(group);
    } catch (error) {
        // Gérer les erreurs
        res.status(500).json({ message: 'Erreur pour quitter ce groupe', error: error.message });
    }
}


/**
 * Check if code is not already existed
 * @param {*} code du groupe
 * @returns 
 */
const checkIfCodeExists = async(code) => {
    // Vérifier si l'utilisateur avec cet email existe déjà dans la base de données
    const group = await GroupModel.findOne({ code: code });
    if (group) {
        return true;
    }
    return false;
}

/**
 * Get group by its code
 * @param {*} name Code du groupe
 * @returns 
 */
const getGroupByCode = async(code) => {
    const group = await GroupModel.findOne({ code: code });
    return group;
}

/**
 * Generate a code
 * @param {*} length of the code
 * @returns a random code
 */
function generateCode(length=6) {
    let code = '';
    const digits = '0123456789';
    const digitsLength = digits.length;
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * digitsLength);
      code += digits.charAt(randomIndex);
    }
  
    return code;
}

/**
 * Retrive all groups where userId is a member
 * @param userId
 * @returns GroupModel[]
 */
const getUserGroup = async (userId) =>
    await GroupModel.find({
        membres: {
            $elemMatch: {
                _id: userId
            }
        }
    });


/**
 * Retrive group corresponding to code where userId is a member
 * @param userId
 * @param code
 * @returns GroupModel[]
 */
const getGroupByCodeForUser = async (userId, code) => {
    try {
        // Rechercher le groupe par son code
        const group = await GroupModel.findOne({ code: code });

        // Vérifier si le groupe a été trouvé
        if (!group) {
            console.log("Groupe introuvable : aucun code correspondant")
            return null; // Groupe non trouvé
        }

        // Vérifier si l'utilisateur est membre de ce groupe
        console.log(userId)
        for (let membre of group.membres) {
            const userGroup = await UserModel.findById(membre._id);
            console.log(userGroup._id)
            if (userGroup._id == userId){
                // Si l'utilisateur appartient bel et bien au groupe
                console.log("L'utilisateur appartient a ce groupe")
                return group;
            }
        }
        console.log("L'utilisateur n'appartient pas a ce groupe")
        return null;        // Groupe non trouvé

    } catch (error) {
        throw new Error('Erreur lors de la recherche du groupe par code pour l\'utilisateur: ' + error.message);
    }
}


export {
    create,
    join,
    get,
    update_group,
    quit,
    delete_group,
}