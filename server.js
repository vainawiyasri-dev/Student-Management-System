require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const Student = require("./models/Student");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connect DB
connectDB();

// ---------------------------
// CRUD ROUTES
// ---------------------------

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
        res.status(200).json(newStudent);
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
            { new: true }
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

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
