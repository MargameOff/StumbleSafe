import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['type1', 'type2', 'type3'], // A Ajouter plus tard
        required: true
    },
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position',
        required: true
    },
    trajet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    }
});

const AlertModel = mongoose.model('Alert', alertSchema);

export default AlertModel;
