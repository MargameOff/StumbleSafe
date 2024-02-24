import UserModel from '../../models/user.models.js';
import {checkIfIsValidMail} from '../../tools/format.js';
import {connectDB, disconnectDB} from '../../tools/database.js';

const signup = async (req, res) => {
    // Connexion à la base de données
    await connectDB();
    try {
        // Récupérer les données de l'utilisateur à partir du corps de la requête
        console.log(req.body.userInfos);
        // Vérifier si l'utilisateur existe déjà dans la base de données
        const { nom, nom_affiche, email, password } = req.body.userInfos; // Assurez-vous que req.body.userInfos contient les données correctes
        const userEmailExists = await checkIfUserEmailExists(email);
        const userNameExists = await checkIfUserNameExists(nom);

        // Vérification de l'email (unique)
        if (userEmailExists) {
            return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
        } else if (!checkIfIsValidMail(email)) {
            return res.status(400).json({ message: 'L\'adresse email n\'est pas valide' });
        }

        // Vérification de l'username (unique)
        if (userNameExists){
            return res.status(400).json({message : 'Ce nom d\'utilisateur est déjà utilisé'});
        }
        if(!req.body.userInfos){
            return res.status(400).json({ message: 'Les informations de l\' utilisateur sont manquantes' });
        }

        // Vérification des champs obligatoires
        if(!nom || !email || !password || !nom_affiche){
            return res.status(400).json({ message: 'Les informations de l\' utilisateur sont manquantes' });
        }

        // Créer un nouvel utilisateur en utilisant le modèle Mongoose
        const newUser = new UserModel({ nom, nom_affiche, email, password });
        
        // Enregistrer l'utilisateur dans la base de données
        const user = await newUser.save();

        // Répondre avec l'utilisateur créé
        res.status(201).json(user);
    } catch (error) {
        // Gérer les erreurs
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: error.message });
    } finally {
        // Déconnexion de la base de données
        disconnectDB();
    }
}

const checkIfUserEmailExists = async(email) => {
    // Vérifier si l'utilisateur avec cet email existe déjà dans la base de données
    const user = await UserModel.findOne({ email });
    if (user) {
        return true;
    }
    return false;
}

const checkIfUserNameExists = async(nom) => {
    // Vérifier si l'utilisateur avec ce nom d'utilisateur existe déjà dans la base de données
    const user = await UserModel.findOne({ nom });
    if (user) {
        return true;
    }
    return false;
}

export {
    signup,
}