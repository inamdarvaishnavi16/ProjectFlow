const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");

beforeAll(async () => {

    await mongoose.connect(process.env.MONGO_URI);

});

afterAll(async () => {

    await mongoose.connection.close();

});


describe("ProjectFlow API Tests", () => {

    // ===============================
    // HEALTH CHECK
    // ===============================

    test("GET /api/health should return success", async () => {

        const response =
            await request(app)
                .get("/api/health");

        expect(response.statusCode).toBe(200);

        expect(response.body.success)
            .toBe(true);

    });


    // ===============================
    // PROJECT API
    // ===============================

    test("GET /api/projects should return projects", async () => {

        const response =
            await request(app)
                .get("/api/projects");

        expect(response.statusCode).toBe(200);

        expect(response.body.success)
            .toBe(true);

        expect(Array.isArray(response.body.projects))
            .toBe(true);

    });


    // ===============================
    // MEMBER API
    // ===============================

    test("GET /api/members should return members", async () => {

        const response =
            await request(app)
                .get("/api/members");

        expect(response.statusCode).toBe(200);

        expect(response.body.success)
            .toBe(true);

        expect(Array.isArray(response.body.members))
            .toBe(true);

    });


    // ===============================
    // TASK API
    // ===============================

    test("GET /api/tasks should return tasks", async () => {

        const response =
            await request(app)
                .get("/api/tasks");

        expect(response.statusCode).toBe(200);

        expect(response.body.success)
            .toBe(true);

        expect(Array.isArray(response.body.tasks))
            .toBe(true);

    });

});