const express = require("express");
const cors = require("cors");
const path = require("path");
const { body, validationResult } = require("express-validator");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend"))); // serve frontend

// In-memory student storage
let students = [];
let nextId = 1;

// Validation rules
const studentValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("age")
    .notEmpty()
    .withMessage("Age is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Age must be a non-negative integer"),
  body("course").trim().notEmpty().withMessage("Course is required"),
];

// ================= CRUD ROUTES =================

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Get all students
app.get("/students", (req, res) => {
  res.json(students);
});

// Create student
app.post("/students", studentValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, age, course } = req.body;
  const newStudent = { id: nextId++, name, age: Number(age), course, createdAt: new Date().toISOString() };
  students.push(newStudent);
  res.status(201).json({ message: "Student created", student: newStudent });
});

// Get single student
app.get("/students/:id", (req, res) => {
  const student = students.find((s) => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
});

// Update student
app.put("/students/:id", studentValidation, (req, res) => {
  const student = students.find((s) => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ message: "Student not found" });

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, age, course } = req.body;
  student.name = name;
  student.age = Number(age);
  student.course = course;
  student.updatedAt = new Date().toISOString();

  res.json({ message: "Student updated", student });
});

// Delete student
app.delete("/students/:id", (req, res) => {
  const index = students.findIndex((s) => s.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Student not found" });

  students.splice(index, 1);
  res.json({ message: "Student deleted" });
});

// Catch-all for API 404s
app.use("/students/*", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Catch-all for frontend routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
