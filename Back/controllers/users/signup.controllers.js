import UserModel from '../../models/user.models.js';
import Jwt from 'jsonwebtoken';
import {checkIfIsValidMail} from '../../tools/format.js';
import {connectDB, disconnectDB} from '../../tools/database.js';
import bcrypt from "bcrypt";

const signup = async (req, res) => {
    // Connexion à la base de données
  //  await connectDB();
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
        // Hasher le mot de passe
        const hash = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur en utilisant le modèle Mongoose
        const newUser = new UserModel({ nom, nom_affiche, email, password:hash });
        
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
        const user = await UserModel.findOne({ email });

        if(user) {
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (isValidPassword) {
                const token = await createJwt(user._id)
                return res.status(400).json({ message: 'Connexion réussie', token: token });
            }
        }

        return res.status(400).json({ message: 'Les identifiants ne sont pas valides' });
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
    login
}