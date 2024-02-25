import Jwt from "jsonwebtoken";

const extractUserIdFromToken = (req, res, next) => {

    // récupère le token JWT envoyé dans le header Authorization
    const token = req.get("Authorization")

    if (!token) {
        return res.status(401).json({ message: 'Token JWT manquant' });
    }

    // Vérifier et décoder le token JWT
    Jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: 'Token JWT invalide' });
        }
        // Extraire l'ID de l'utilisateur du token décodé
        req.user = {
            id: decodedToken.id
        };
        next();
    });
};

export default extractUserIdFromToken;