import request from "supertest";
import APP from "../server.js";
import expect from "expect.js";
import UserModel from "../models/user.models.js";

const agent = request.agent(APP);

describe('Routes of the USERS', function () {
    describe('POST /api/users/signup', function () {
        it('Login with right username / password', function (done) {
            const settings = {
                nom: "Test",
                nom_affiche: "TestAffiche",
                email: "test@sfr.fr",
                password: "Azerty45"
            }
            
            agent.post("/api/users/signup")
            .expect('Content-Type', /json/)
            .expect(201)
            .expect((res) => {
                const userInfos = res.body;
                expect(userInfos.nom).to.be.equal(settings.nom);
                expect(userInfos.nom_affiche).to.be.equal(settings.nom_affiche);
                expect(userInfos.email).to.be.equal(settings.email);
             }).send({
                userInfos: {
                    nom: settings.nom,
                    nom_affiche: settings.nom_affiche,
                    email: settings.email,
                    password: settings.password
                }
            }).end(async function(err, res) {
                console.log(err)
                if (err) return done(err);
                await UserModel.deleteOne({email: settings.email})

                return done()
            })
            
        });
    });
});