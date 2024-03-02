import GroupModel from '../../models/group.models.js';

/**
 * 
 * Request body : {
 * groupInfos: {
 *  nom: string,
 * }
 * }
 * 
 * Response body : {
 *  nom: string,
 *  nom_affiche: string,
 *  email: string|email format,
 *  token: string
 * }
 * 
 */
const create = async (req, res) => {
    try {

        // Vérifier si l'utilisateur est déjà dans un groupe avec ce nom
        const { nom } = req.body.groupInfos; // Assurez-vous que req.body.groupInfos contient les données correctes
        const groupAlreadyExists = await checkIfGroupExists(nom, req.user.id);

        // Vérification du nom du groupe
        if (groupAlreadyExists) {
            return res.status(400).json({ message: 'Vous êtes déjà dans un groupe avec le même nom !' });
        }

        if(!req.body.groupInfos){
            return res.status(400).json({ message: 'Les informations du nouveau groupe sont manquantes' });
        }

        // Vérification des champs obligatoires
        if(!nom){
            return res.status(400).json({ message: 'Les informations du nouveau groupe sont manquantes' });
        }

        const code = generateCode(6);

        // Créer un nouveau groupe en utilisant le modèle Mongoose
        const newGroup = new GroupModel({ nom, code, membres: [{
            membreId: req.user.id,
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
 * Vérifie si l'utilisateur est déjà dans un groupe qui se nomme 'nom'
 * @param {*} name Npm du groupe
 * @param {*} userId ObjectID de l'utilisateur
 * @returns 
 */
const checkIfGroupExists = async(name, userId) => {
    // Vérifier si l'utilisateur avec cet email existe déjà dans la base de données
    const group = await GroupModel.findOne({ nom: name, membres: {
        $elemMatch: {
            membreId: userId
        }
    } });
    if (group) {
        return true;
    }
    return false;
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

export {
    create
}