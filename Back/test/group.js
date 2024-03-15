import request from "supertest";
import APP from "../server.js";
import expect from "expect.js";
import UserModel from "../models/user.models.js";
import GroupModel from "../models/group.models.js";

const settings = {
    nom: "Banana",
    nom_affiche: "BananaAffiche",
    email: "banana@sosh.fr",
    password: "BANANA"
}

var savedToken = "";
var savedGroup = "";

before(async () => {
    await UserModel.deleteOne({ email: settings.email });
    await GroupModel.deleteOne({ code: "000000" });
});

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
                }).end(async function (err, res) {
                    if (err) return done(err);
                    return done()
                })

        });
    });
});

// Scénario de tests : fonctionnalité pour les groupes : récupérer les groupes de l'utilisateur, creation, rejoindre, suppression, quitter
describe('Routes of the GROUPS', () => {
    describe('GET /api/groups/', () => {
        it('Get user\'s group', done => {
            request(APP)
                .get("/api/groups").set('Authorization', savedToken)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });
        it('Avoid getting user\'s group with a bad token', done => {
            request(APP)
                .get("/api/groups").set('Authorization', "badToken")
                .expect(401)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        });
    });
    describe('POST /api/groups/create', () => {
        // CREATION
        it('Create a group', done => {
            request(APP)
                .post("/api/groups/create").set('Authorization', savedToken)
                .expect('Content-Type', /json/)
                .expect(201)
                .send({
                    groupInfos: {
                        nom: "BananaGroup",
                    }
                }).end(async function (err, res) {
                    savedGroup = res.body;
                    await GroupModel.deleteOne({ code: savedGroup.code });
                    if (err) return done(err);

                    return done()
                })
        });
        it('Avoid creating a group with a bad name', done => {
            request(APP)
                .post("/api/groups/create").set('Authorization', savedToken)
                .expect('Content-Type', /json/)
                .expect(400)
                .send({
                    groupInfos: {
                        nom: "",
                    }
                }).end(async function (err, res) {
                    if (err) return done(err);
                    return done()
                })
        });
        it('Avoid creating a group with a bad token', done => {
            request(APP)
                .post("/api/groups/create").set('Authorization', "badToken")
                .expect('Content-Type', /json/)
                .expect(401)
                .send({
                    groupInfos: {
                        nom: "BananaGroup",
                    }
                }).end(async function (err, res) {
                    if (err) return done(err);
                    return done()
                })
        });

        // JOIN
        it('Join a group', done => {
            // create a user
            let userInfos;
            request(APP)
                .post("/api/users/signup")
                .expect('Content-Type', /json/)
                .expect(201)
                .send({
                    userInfos: {
                        nom: "Banana2",
                        nom_affiche: "BananaAffiche2",
                        email: "banana2@gmail.com",
                        password: "BANANA"
                    }
                }).end(async function (err, res) {
                    if (err) return done(err);
                    userInfos = res.body;
                    // create a group
                    request(APP)
                        .post("/api/groups/create").set('Authorization', userInfos.token)
                        .expect('Content-Type', /json/)
                        .expect(201)
                        .send({
                            groupInfos: {
                                nom: "BananaGroup2",
                            }
                        }).end(async function (err2, res2) {
                            if (err2) return done(err2);
                            let groupInfosTmp = res2.body;
                            // join the group
                            request(APP)
                                .post("/api/groups/join").set('Authorization', savedToken)
                                .expect('Content-Type', /json/)
                                .expect(201)
                                .send({
                                    groupInfos: groupInfosTmp
                                }).end(async function (err3, res3) {
                                    if (err3) return done(err3);
                                    await GroupModel.deleteOne({ code: groupInfosTmp.code });
                                    return done()
                                })
                            await UserModel.deleteOne({ email: "banana2@gmail.com" });
                        });
                });
        });
        it('Avoid joining a group with a bad code', done => {

            request(APP)
                .post("/api/groups/join").set('Authorization', savedToken)
                .expect('Content-Type', /json/)
                .expect(404)
                .send({
                    groupInfos: {
                        nom: "BananaGroup",
                        code: "000000",
                        actif: true,
                        membres: []
                    }
                }).end(async function (err, res) {
                    if (err) return done(err);
                    return done()
                })
        });

        // QUIT
        it('Quit a group', done => {
            // create a group
            request(APP)
                .post("/api/groups/create").set('Authorization', savedToken)
                .expect('Content-Type', /json/)
                .expect(201)
                .send({
                    groupInfos: {
                        nom: "BananaGroup",
                    }
                }).end(async function (err, res) {
                    if (err) return done(err);
                    let groupInfosTmp = res.body;
                    // create a user
                    let userInfos;
                    request(APP)
                        .post("/api/users/signup")
                        .expect('Content-Type', /json/)
                        .expect(201)
                        .send({
                            userInfos: {
                                nom: "Banana2",
                                nom_affiche: "BananaAffiche2",
                                email: "test@gmail.com",
                                password: "BANANA"
                            }
                        }).end(async function (err2, res2) {
                            if (err2) return done(err2);
                            userInfos = res2.body;
                            // join the group
                            request(APP)
                                .post("/api/groups/join").set('Authorization', userInfos.token)
                                .expect('Content-Type', /json/)
                                .expect(201)
                                .send({
                                    groupInfos: {
                                        code : groupInfosTmp.code
                                    }
                                }).end(async function (err3, res3) {
                                    if (err3) return done(err3);
                                    // quit the group
                                    request(APP)
                                        .post("/api/groups/quit").set('Authorization', userInfos.token)
                                        .expect('Content-Type', /json/)
                                        .expect(200)
                                        .send({
                                            groupInfos: groupInfosTmp
                                        }).end(async function (err4, res4) {
                                            await UserModel.deleteOne({ email: "test@gmail.com" });
                                            await GroupModel.deleteOne({ code: groupInfosTmp.code });
                                            if (err4) return done(err4);
                                            return done()
                                        })
                                });
                        });
                });
        });
    });
});
describe('DELETE /api/groups/delete', () => {
    it('Avoid deleting a group with a bad group info', done => {
        request(APP)
            .delete("/api/groups/delete").set('Authorization', savedToken)
            .expect('Content-Type', /json/)
            .expect(400)
            .send({
                groupInfos: {
                    nom: "",
                    code: ""
                }
            }).end(async function (err, res) {
                if (err) return done(err);
                return done()
            })
    });
    it('Avoid deleting a group with a bad token', done => {
        request(APP)
            .delete("/api/groups/delete").set('Authorization', "badToken")
            .expect('Content-Type', /json/)
            .expect(401)
            .send({
                groupInfos: savedGroup
            }).end(async function (err, res) {
                if (err) return done(err);
                return done()
            })
    });
    it('Delete a group', done => {
        // create a group
        request(APP)
            .post("/api/groups/create").set('Authorization', savedToken)
            .expect('Content-Type', /json/)
            .expect(201)
            .send({
                groupInfos: {
                    nom: "BananaGroup",
                }
            }).end(async function (err, res) {
                if (err) return done(err);
                let groupInfosTmp = res.body;
                // delete the group
                request(APP)
                    .delete("/api/groups/delete").set('Authorization', savedToken)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .send({
                        groupInfos: groupInfosTmp
                    }).end(async function (err, res) {
                        await GroupModel.deleteOne({ code: groupInfosTmp.code });
                        if (err) return done(err);
                        return done()
                    })
            });
    });
});

after(async () => {
    await UserModel.deleteOne({ email: "banana@sosh.fr"});
});