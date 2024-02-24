import mongoose from 'mongoose';

const consentSchema = new mongoose.Schema({
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    groupe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    consentement: {
        type: Boolean,
        required: true,
        default: false
    }
});

const ConsentModel = mongoose.model('Consent', consentSchema);

export default ConsentModel;
