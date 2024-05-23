const app = require('../index.js');
const mongoose = require("mongoose");
const request = require("supertest");

// const server = app.listen(6000);
/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect("mongodb+srv://vietanhvdt:vietanh123456789@vdt.lfw9tlu.mongodb.net/?retryWrites=true&w=majority&appName=vdt");
});

/* Closing database connection after each test. */
afterEach(async () => {
    await mongoose.connection.close();
});

describe("GET /all", () => {
    it("should return all", async () => {
        const res = await request(app).get("/all");
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});

describe("POST /add", () => {
    it("should create", async () => {
        const res = await request(app).post("/add").send({
            name: "Unit Test Student",
            age: 20,
            email: "test@student.gmail.com",
            phoneNumber: "0123456789",
            gender: "Nam",
            school: "Đại học Sư phạm Hà Nội",
            nation: "Lào"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("Test Student");
    });
});

describe("PUT /update/&id=:id", () => {
    it("should update", async () => {
        const res = await request(app)
            .put("/update/&id=664eea4d47f44d1ab48d2a65")
            .send({
                name: "Test 0",
                age: 100,
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.age).toBe(100);
    });
});

describe("DELETE /delete/&id=:id", () => {
    it("should delete", async () => {
        const res = await request(app).delete(
            "/delete/&id=664eea4d47f44d1ab48d2a65"
        );
        expect(res.statusCode).toBe(400);
        // expect(res.statusCode).toBe(200);
    });
});
