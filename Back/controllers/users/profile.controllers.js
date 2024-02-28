import UserModel from '../../models/user.models.js';
import bcrypt from "bcrypt";

const getUserProfile = async (req, res) => {
    try {
        // L'ID de l'utilisateur est extrait à partir du token JWT
        const userId = req.user.id;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        console.log("Utilisateur trouvé")
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du profil utilisateur', error: error.message });
    }
}

const updateDisplayName = async (req, res) => {
    try {
        // L'ID de l'utilisateur est extrait à partir du token JWT
        const userId = req.user.id;
        const { nom_affiche } = req.body;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Mettre à jour le nom affiché
        if (nom_affiche) {
            user.nom_affiche = nom_affiche;
        }

        await user.save();
        res.status(200).json({ message: "Profil utilisateur mis à jour avec succès" });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du profil utilisateur', error: error.message });
    }
}

const updatePassword = async (req, res) => {
    try {
        // L'ID de l'utilisateur est extrait à partir du token JWT
        const userId = req.user.id;
        const { password, newPassword } = req.body;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Mettre à jour le mot de passe
        if (password && newPassword) {
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ message: "Mot de passe actuel incorrect" });
            }
            // Hasher le nouveau password
            const hash = await bcrypt.hash(newPassword, 10);
            user.password = hash;
        }

        await user.save();
        res.status(200).json({ message: "Profil utilisateur mis à jour avec succès" });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du profil utilisateur', error: error.message });
    }
}


export {
    getUserProfile,
    updateDisplayName,
    updatePassword
}