import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { log } from 'console';

dotenv.config({ path: '../.env'});
if (!process.env.MONGODB_USER || !process.env.MONGODB_PASSWORD || !process.env.MONGODB_HOST || !process.env.MONGODB_LOCAL_PORT || !process.env.MONGODB_DATABASE) {
    log('Le fichier .env est mal configuré ou manquant');
    process.exit(1);
}

const uri = "mongodb://" + process.env.MONGODB_USER + ":" + process.env.MONGODB_PASSWORD + "@" + process.env.MONGODB_HOST + ":" + process.env.MONGODB_LOCAL_PORT + "/" + process.env.MONGODB_DATABASE + "?retryWrites=true&w=majority";
const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            authSource: 'admin' // Ajoutez cette option si votre utilisateur MongoDB est authentifié à partir de la base de données admin
        });
        console.log('Connexion à MongoDB réussie');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB :', error);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('Déconnexion de MongoDB réussie');
    } catch (error) {
        console.error('Erreur lors de la déconnexion de MongoDB :', error);
    }
};

export { connectDB, disconnectDB };
