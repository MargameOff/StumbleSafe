import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        unique: true,
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
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
