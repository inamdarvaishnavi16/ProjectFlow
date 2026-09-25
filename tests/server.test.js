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

    test("GET /health should return status ok", async () => {

        const response =
            await request(app)
                .get("/health");

        expect(response.statusCode).toBe(200);

        expect(response.body.status)
            .toBe("ok");

    });


    // ===============================
    // EXISTING HEALTH CHECK
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
    // PROJECT API - GET
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
    // PROJECT API - ADD DATA
    // ===============================

    test("POST /api/projects should create a project", async () => {

        const response =
            await request(app)
                .post("/api/projects")
                .send({
                    name: "CCA Test Project",
                    description: "Project created by automated test",
                    technology: "Node.js",
                    startDate: "2026-09-26",
                    deadline: "2026-10-10"
                });

        expect(response.statusCode).toBe(201);

        expect(response.body.success)
            .toBe(true);

        expect(response.body.project.name)
            .toBe("CCA Test Project");

    });


    // ===============================
    // PROJECT API - INVALID INPUT
    // ===============================

    test("POST /api/projects should reject invalid project", async () => {

        const response =
            await request(app)
                .post("/api/projects")
                .send({
                    description: "Missing required fields"
                });

        expect(response.statusCode).toBe(400);

        expect(response.body.success)
            .toBe(false);

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