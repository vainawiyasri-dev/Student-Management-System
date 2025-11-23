require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const Student = require("./models/Student");
const client = require('prom-client');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI not set in .env");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// Prometheus metrics
client.collectDefaultMetrics({ timeout: 5000 });

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

// ================= CRUD ROUTES =================

// Create student
app.post("/students", async (req, res) => {
    try {
        const { name, age, course } = req.body;
        if (!name || !age || !course) return res.status(400).json({ error: "All fields required" });
        const student = await Student.create({ name, age, course });
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Get all students
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch {
        res.status(500).json({ error: "Server error" });
    }
});

// Get single student
app.get("/students/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: "Not found" });
        res.json(student);
    } catch {
        res.status(400).json({ error: "Invalid ID" });
    }
});

// Update student
app.put("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!student) return res.status(404).json({ error: "Not found" });
        res.json(student);
    } catch {
        res.status(400).json({ error: "Invalid ID" });
    }
});

// Delete student
app.delete("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ error: "Not found" });
        res.json({ message: "Deleted" });
    } catch {
        res.status(400).json({ error: "Invalid ID" });
    }
});

// API 404 for /students
app.use('/students/:any', (req, res) => {
    res.status(404).json({ message: "API route not found" });
});

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Catch-all for SPA frontend
app.get('/:any', (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

