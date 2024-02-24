import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        enum: ['action1', 'action2', 'action3'], // A ajouter plus tard
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const LogModel = mongoose.model('Log', logSchema);

export default LogModel;
