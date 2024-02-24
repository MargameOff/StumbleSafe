import UserModel from '../../models/user.models.js';
import Jwt from 'jsonwebtoken';
import {checkIfIsValidMail} from '../../tools/format.js';

const signup = async (req, res) => {
    // Connexion à la base de données
  //  await connectDB();
    try {
        // Récupérer les données de l'utilisateur à partir du corps de la requête
        console.log(req.body.userInfos);
        // Vérifier si l'utilisateur existe déjà dans la base de données
        const { nom, email, password } = req.body.userInfos; // Assurez-vous que req.body.userInfos contient les données correctes
        const userExists = await checkIfUserExists(email);
        if (userExists) {
            return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
        } else if (!checkIfIsValidMail(email)) {
            return res.status(400).json({ message: 'L\'adresse email n\'est pas valide' });
        }
        if(!req.body.userInfos){
            return res.status(400).json({ message: 'Les informations de l\' utilisateur sont manquantes' });
        }
        if(!nom || !email || !password){
            return res.status(400).json({ message: 'Les informations de l\' utilisateur sont manquantes' });
        }
        // Créer un nouvel utilisateur en utilisant le modèle Mongoose
        const newUser = new UserModel({ nom, email, password });
        
        // Enregistrer l'utilisateur dans la base de données
        const user = await newUser.save();
        const token = await createJwt(user._id);

        // On regroupe les infos a retourner à l'utilisateur
        const response = {
            "nom": user.nom,
            "email": user.email,
            "phoneNumbers": user.phoneNumbers,
            "token": token
        }
        // Répondre avec l'utilisateur créé
        res.status(201).json(response);
    } catch (error) {
        // Gérer les erreurs
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: error.message });
    }
}


const login = async (req, res) => {
    // Connexion à la base de données
    // await connectDB();   
    try {
        // Récupérer les données de l'utilisateur à partir du corps de la requête
        console.log(req.body.userInfos);
        // Vérifier si l'utilisateur existe déjà dans la base de données
        const { email, password } = req.body.userInfos; // Assurez-vous que req.body.userInfos contient les données correctes
    
        const user = await UserModel.findOne({ email, password });
        
        if (user) {
            const token = await createJwt(user._id)
            return res.status(400).json({ message: 'Connexion réussie', token: token });
        } else {
            return res.status(400).json({ message: 'Les identifiants ne sont pas valides' });
        }

    } catch (error) {
        // Gérer les erreurs
        res.status(500).json({ message: 'Erreur lors de l\'authentification de l\'utilisateur', error: error.message });
    }
}

/**
 * Créer un token JWT
 * @param {*} id Identifiant de l'utilisateur
 * @returns Un token d'authentification pour une durée limitée contenant l'ID de l'utilisateur en DB
 */
const createJwt = async (id) => {
    return Jwt.sign({'id': id}, process.env.JWT_SECRET, { expiresIn: '1h' })
}

const checkIfUserExists = async(email) => {
    // Vérifier si l'utilisateur existe déjà dans la base de données
    const user = await UserModel.findOne({ email });
    if (user) {
        return true;
    }
    return false;
}

export {
    signup,
    login
}