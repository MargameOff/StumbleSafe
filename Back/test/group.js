import request from "supertest";
import APP from "../server.js";
import expect from "expect.js";
import UserModel from "../models/user.models.js";

const settings = {
    nom: "Banana",
    nom_affiche: "BananaAffiche",
    email: "banana@sosh.fr",
    password: "BANANA"
}

var savedToken = "";



// Avant toute chose, il faut avoir un utilisateur
describe('Get User Token', () => {
    describe('POST /api/users/signup', () => {
        it('Sign up with right information', done => {

            request(APP)
                .post("/api/users/signup")
                .expect('Content-Type', /json/)
                .expect(201)
                .expect((res) => {
                    const userInfos = res.body;
                    expect(userInfos.nom).to.be.equal(settings.nom);
                    expect(userInfos.nom_affiche).to.be.equal(settings.nom_affiche);
                    expect(userInfos.email).to.be.equal(settings.email);
                    expect(userInfos.token).to.match(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/gm);
                    savedToken = userInfos.token;
                }).send({
                userInfos: {
                    nom: settings.nom,
                    nom_affiche: settings.nom_affiche,
                    email: settings.email,
                    password: settings.password
                }
            }).end(async function(err, res) {
                if (err) return done(err);
                return done()
            })

        });
    });
});

// Scénario de tests : fonctionnalité pour les groupes : récupérer les groupes de l'utilisateur, creation, rejoindre, suppression, quitter
describe('Routes of the GROUPS', () => {
    describe('POST /api/groups/', () => {
        it('Get user\'s group', done => {
            request(APP)
                .get("/api/groups").set('Authorization', savedToken)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });
    });
});