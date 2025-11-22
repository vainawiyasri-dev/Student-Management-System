require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/studentsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Student Schema with timestamps
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    course: { type: String, required: true }
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);


// CRUD ROUTES


// Get all students
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Add student
app.post("/students", async (req, res) => {
    const { name, age, course } = req.body;

    if (!name || !age || !course) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newStudent = await Student.create({ name, age, course });
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update student
app.put("/students/:id", async (req, res) => {
    const { id } = req.params;
    const { name, age, course } = req.body;

    try {
        const student = await Student.findByIdAndUpdate(
            id,
            { name, age, course },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete student
app.delete("/students/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const student = await Student.findByIdAndDelete(id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


// API 404 Handler

app.use('/students/*', (req, res) => {
    res.status(404).json({ message: "API route not found" });
});


// Serve frontend

app.use(express.static(path.join(__dirname, "../frontend")));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
