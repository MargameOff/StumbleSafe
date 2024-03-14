import request from "supertest";
import APP from "../server.js";
import expect from "expect.js";
import GroupModel from "../models/group.models.js";


var savedToken = "";


// Test que le serveur est bien démarré
describe('Tests', () => {
    it('Devrait retourner une réponse de statut 200 group', done => {
        request(APP)
            .get('/status')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                // Vérifiez votre réponse ici
                done();
            });
    });
});
