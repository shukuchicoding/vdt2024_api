const app = require('../index.js');
const mongoose = require("mongoose");
// const { MongoMemoryServer } = require("mongodb-memory-server");

const request = require("supertest");

// let mongo;
beforeAll(done => {
    done()
})

afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    done()
})
/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect("mongodb://localhost:27017/students");
});

/* Closing database connection after each test. */
afterEach(async () => {
    await mongoose.connection.close();
});

// beforeEach(async () => {
//     const mongo = await MongoMemoryServer.create();
//     const uri = mongo.getUri();
//     mongoose.connect(uri);
// });

// afterEach(async () => {
//     await mongoose.connection.close();
// });

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
    });
});

describe("PUT /update/&id=:id", () => {
    it("should update", async () => {
        const res = await request(app)
            .put("/update/&id=6666666666666616648d6665")
            .send({
                name: "Test 0",
                age: 100,
            });
        expect(res.statusCode).toBe(400);
    });
});

describe("DELETE /delete/&id=:id", () => {
    it("should delete", async () => {
        const res = await request(app).delete(
            "/delete/&id=111111111111111111111111"
        );
        expect(res.statusCode).toBe(200);
    });
});
