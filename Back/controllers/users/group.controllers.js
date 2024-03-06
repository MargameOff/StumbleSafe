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
 * Request body : Not used
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


export {
    create,
    join,
    get
}