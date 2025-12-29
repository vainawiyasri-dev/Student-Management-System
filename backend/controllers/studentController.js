import Student from "../models/student.js";

/* ================= GET STUDENTS ================= */
// Example in studentsController.js
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find(); // fetch all students
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= CREATE STUDENT ================= */
export const createStudent = async (req, res) => {
  try {
    const { name, age, email, course } = req.body;

    if (!name || !age || !email || !course) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const student = await Student.create({
      name,
      age,
      email,
      course,
      createdBy: req.user._id,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: "Failed to create student" });
  }
};

/* ================= UPDATE STUDENT ================= */
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    if (
      req.user.role !== "admin" &&
      !student.createdBy.equals(req.user._id)
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    student.name = req.body.name || student.name;
    student.age = req.body.age || student.age;
    student.email = req.body.email || student.email;
    student.course = req.body.course || student.course;

    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Failed to update student" });
  }
};

/* ================= DELETE STUDENT ================= */
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    if (
      req.user.role !== "admin" &&
      !student.createdBy.equals(req.user._id)
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await student.deleteOne();
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete student" });
  }
};
