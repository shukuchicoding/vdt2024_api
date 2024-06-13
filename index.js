var Express = require("express");
var Mongoclient = require("mongodb").MongoClient;
var cors = require("cors");
const { rateLimit } = require("express-rate-limit");

const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // Thời gian cửa sổ (trong mili giây)
    max: 10, // Số lượng yêu cầu tối đa trong cửa sổ thời gian
    message: "Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau 1 phút",
    statusCode: 409, // Mã HTTP Response trả về khi vượt quá giới hạn
});

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = Express();

const corsOption = {
    // origin: 'http://localhost:3000',
    origin: 'http://192.168.49.2:30414',
    credentials: true
};

const {
    // MONGO_USERNAME,
    // MONGO_PASSWORD,
    // MONGO_HOSTNAME,
    // MONGO_PORT,
    // MONGO_DB,
    MONGO_URL
} = process.env;

// const CONNECTION_STRING = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
const CONNECTION_STRING = "mongodb+srv://vietanhvdt:vietanh123456789@vdt.lfw9tlu.mongodb.net/?retryWrites=true&w=majority&appName=vdt"
// const CONNECTION_STRING = MONGO_URL


app.use(cors(corsOption));
app.use(Express.json());
app.use(apiLimiter);
mongoose.connect(CONNECTION_STRING).then(() => {
    app.listen(5000, () => { console.log("MongoDB is connected"); })
}).catch((error) => {
    console.log({ error });
});

const Schema = mongoose.Schema;
const memSchema = new Schema({
    name: {type: String, required: true},
    age: Number,
    email: String,
    phoneNumber: String,
    gender: {type: String, required: true},
    school: {type: String, required: true},
    nation: String
});
const student = mongoose.model('vdter', memSchema);
// Hien thi tat ca
app.get("/all", async (req, res) => {
    try {
        const students = await student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Them
app.post("/add", async (req, res) => {
    try {
        const { name, age, email, phoneNumber, gender, school, nation } = req.body;
        const newStudent = await student.create({ name, age, email, phoneNumber, gender, school, nation });
        if (!name || !gender || !school) {
            res.status(500).json({ error: error.message });
        }
        res.status(200).json({ message: "New student", newStudent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
// Sua theo id
app.put("/update/&id=:id", async (req, res) => {
    try {
        await student.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});
// Xoa theo id
app.delete("/delete/&id=:id", async (req, res) => {
    try {
        const user = await student.findByIdAndDelete(req.params.id)
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = app;