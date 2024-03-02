import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
    nom: {
        type: String,
        maxlength: 50,
        required: true
    },
    statut: {
        type: String,
        enum: ['en cours', 'terminé', 'annulé'],
        default: 'en cours'
    },
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    groupes: {
        type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Group'
        }],
        required: true
    },
    depart: {
        type: {
            latitude: { type: Number, required: true},
            longitude: { type: Number, required: true}
        }
    },
    arrivee: {
        type: {
            latitude: { type: Number, required: true},
            longitude: { type: Number, required: true}
        }
    },
    date_depart:{
        type: Date,
        required: true
    },
    date_arrivee_estimee: {
        type: Date,
        required: true
    }
});

const TripModel = mongoose.model('Trip', tripSchema);

export default TripModel;
