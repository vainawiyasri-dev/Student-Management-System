const express = require("express");
const cors = require("cors");
const app = express();


app.use(express.json());
app.use(cors());

let students = [];
let idCounter = 1;

// GET all students
app.get("/students", (req, res) => {
    res.status(200).json(students);
});

// ADD a student
app.post("/students", (req, res) => {
    const { name, age, course } = req.body;

    if (!name || !age || !course) {
        return res.status(400).json({ message: "All fields are required" });
    }

   const newStudent = { id: idCounter++, name, age: Number(age), course };
  

    students.push(newStudent);

    res.status(200).json(newStudent);
});

// UPDATE a student
app.put("/students/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { name, age, course } = req.body;

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    if (!name || !age || !course) {
        return res.status(400).json({ message: "All fields required" });
    }

    student.name = name;
    student.age = Number(age);
    student.course = course;

    res.status(200).json(student);
});

// DELETE a student
app.delete("/students/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = students.findIndex(s => s.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Student not found" });
    }

    students.splice(index, 1);
    res.status(200).json({ message: "Student deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
