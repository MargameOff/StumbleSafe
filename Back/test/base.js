import request from "supertest";
import APP from "../server.js";
import expect from "expect.js";
import UserModel from "../models/user.models.js";

const agent = request.agent(APP);
const settings = {
    nom: "Test",
    nom_affiche: "TestAffiche",
    email: "test@sfr.fr",
    password: "Azerty45"
}

var savedToken = "";

describe('Routes of the USERS', function () {
    describe('POST /api/users/signup', function () {
        it('Avoid signing up with bad email', function (done) {
            agent.post("/api/users/signup")
            .expect('Content-Type', /json/)
            .expect(400)
            .send({
                userInfos: {
                    nom: settings.nom,
                    nom_affiche: settings.nom_affiche,
                    email: settings.nom,
                    password: settings.password
                }
            }).end(async function(err, res) {
                if (err) return done(err);
                return done()
            })
            
        });
        it('Sign up with right information', function (done) {
            agent.post("/api/users/signup")
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
        it('Avoid signing up with an existing email', function (done) {
            agent.post("/api/users/signup")
            .expect('Content-Type', /json/)
            .expect(400)
            .send({
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

    describe('POST /api/users/login', function () {
        it('Login with right username / password', function (done) {
            agent.post("/api/users/login")
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => {
                const userInfos = res.body;
                expect(userInfos.token).to.match(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/gm);
             }).send({
                userInfos: {
                    nom: settings.nom,
                    password: settings.password
                }
            }).end(async function(err, res) {
                if (err) return done(err);
                return done()
            })
            
        });

        it('Avoid loging with bad username / password', function (done) {
            agent.post("/api/users/login")
            .expect('Content-Type', /json/)
            .expect(400)
            .send({
                userInfos: {
                    nom: "random",
                    password: "random"
                }
            }).end(async function(err, res) {
                if (err) return done(err);
                return done()
            })
            
        });
    });

    describe('POST /api/users/login/refresh', function () {
        it('Refresh JWT Token', function (done) {
            agent.post("/api/users/login/refresh")
            .expect('Content-Type', /json/)
            .set('Authorization', savedToken)
            .expect(200)
            .expect((res) => {
                expect(res.body.token).to.match(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/gm);
            }).end(async function(err, res) {
                if (err) return done(err);
                return done()
            })
        });

        it('Refresh JWT Token with bad authorization', function (done) {
            agent.post("/api/users/login/refresh")
            .expect('Content-Type', /json/)
            .set('Authorization', "savedToken")
            .expect(401)
            .end(async function(err, res) {
                if (err) return done(err);
                return done()
            })
            
        });

        it('Refresh JWT Token without authorization', function (done) {
            agent.post("/api/users/login/refresh")
            .expect('Content-Type', /json/)
            .expect(401)
            .end(async function(err, res) {
                await UserModel.deleteOne({email: settings.email})
                if (err) return done(err);
                return done()
            })
            
        });
    });
});