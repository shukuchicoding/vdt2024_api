var Express = require("express");
var Mongoclient = require("mongodb").MongoClient;
var cors = require("cors");
const { rateLimit } = require("express-rate-limit");
// xac thuc
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // Thời gian cửa sổ (trong mili giây)
    max: 10, // Số lượng yêu cầu tối đa trong cửa sổ thời gian
    message: "Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau 1 phút",
    statusCode: 409, // Mã HTTP Response trả về khi vượt quá giới hạn
});

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { JsonWebTokenError } = require("jsonwebtoken");
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
    nation: String,
    username: {type: String, required: true, default: 'none'},
    password: {type: String, required: true, default: 'none'},
    role: {type: String, enum: ['admin', 'user'], default: 'user'}
});
const student = mongoose.model('vdter', memSchema);

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, "123456789", { expiresIn: '12h' });
};


const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    jwt.verify(token, "123456789", (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        req.user = user;
        next();
    });
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied', role: req.user.role, requiredRoles: roles});
        }
        next();
    };
};

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
app.post("/add", authenticateToken, authorizeRoles('admin', 'user'), async (req, res) => {
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
app.put("/update/&id=:id", authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        await student.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});
// Xoa theo id
app.delete("/delete/&id=:id", authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await student.findByIdAndDelete(req.params.id)
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

app.post("/check", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await student.findOne({ username });
        if (!user || user.username === 'none' || user.password === 'none')  {
            return res.status(401).json({ message: 'Invalid username' });
        }
        if (!compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        console.log("touch");
        const token = generateToken(user);
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ message: `Logged in successfully as ${user.role}`, token, user });
    } catch (error) {
        logger.error({
            message: error.message,
            path: req.originalUrl,
            method: req.method,
            responseCode: 500
        });
        res.status(500).json({ message: error.message });
    }
});


module.exports = app;