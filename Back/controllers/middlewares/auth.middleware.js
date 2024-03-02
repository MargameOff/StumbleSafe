import Jwt from 'jsonwebtoken';

/**
 * If a route has this middleware then adding in your HTTP request :
 * header : {
 *  Authorization: *JWT Token*
 * }
 */
const checkIfUserIsConnected = async(req, res, next) => {

    // récupère le token JWT envoyé dans le header Authorization
    const token = req.get("Authorization") // A sanitize, a voir l'outil qu'on utilise pour verifier s'il y a des patterns d'injections...
    
    try {
        var decoded = Jwt.verify(token, process.env.JWT_SECRET);
        if(decoded != null) {
            req.user = decoded;
            next()
            return
        }
    } catch(err) {}
    
    res.status(500).json({ message: 'Erreur token d\'authentification invalide' });
}

export default checkIfUserIsConnected;