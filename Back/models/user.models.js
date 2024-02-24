import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    nom_affiche:
        {
            type: String,
            required: true
        },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumbers: {
        type: [String],
        required: false
    },
    // Autres champs utilisateur ici
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
