import mongoose from 'mongoose';

const positionSchema = new mongoose.Schema({
    coordonnees: {
        type: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true }
        },
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    trajet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    }
});

const PositionModel = mongoose.model('Position', positionSchema);

export default PositionModel;
