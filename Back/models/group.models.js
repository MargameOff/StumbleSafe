import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 6
    },
    actif: {
        type: Boolean,
        default: true
    },
    membres: [{
        membreId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        proprietaire: {
            type: Boolean,
            default: false 
        }
    }]
});

const GroupModel = mongoose.model('Group', groupSchema);

export default GroupModel;