const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;

describe("Testing users API", function () {
    before(async() => {
        // we need to ensure indexes by hand in tests
        // because mongoose by default does that in background and asynchronously
        for(const modelName of mongoose.modelNames()) {
            await mongoose.model(modelName).ensureIndexes();
        }
    })
    after(async function () {
        await mongoose.connection.db.dropDatabase();
    })

    describe("Testing create API /users [POST]", function () {
        it("Creates a user successfully", function () {
            return request(app)
                .post('/users')
                .send({
                    username: "johnconor",
                    password: "1234",
                    firstName: "John",
                    lastName: "Conor"
                })
                .expect(201)
                .expect(res => {
                    return expect(res.body).to.have.property('_id');
                })
        })

        it("Fails to create a user with existing username", async function () {
            return request(app)
                .post('/users')
                .send({
                    username: "johnconor",
                    password: "2222",
                    firstName: "John",
                    lastName: "Conor"
                })
                .expect(409);
        })

        it("Fails to create a user without username", function () {
            return request(app)
                .post('/users')
                .send({
                    password: "2222",
                    firstName: "John",
                    lastName: "Conor"
                })
                .expect(400);
        })

        it("Fails to create a user without password", function () {
            return request(app)
                .post('/users')
                .send({
                    username: "testuser",
                    firstName: "John",
                    lastName: "Conor"
                })
                .expect(400);
        })
    })
})