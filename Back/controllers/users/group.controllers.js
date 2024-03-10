import GroupModel from '../../models/group.models.js';

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

export {
    create,
    join
}