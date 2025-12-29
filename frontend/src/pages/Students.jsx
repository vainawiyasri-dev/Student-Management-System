import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Select from "react-select";

const VALID_COURSES = [
  "Full Stack Development",
  "Front-End Development",
  "Back-End Development",
  "AI/Machine Learning",
  "Data Analyst",
  "Data Science",
  "DevOps",
  "Cloud Computing",
  "Cybersecurity",
  "Mobile App Development",
  "UI/UX Design",
  "Blockchain Development",
  "Big Data",
  "Internet of Things",
  "Business Intelligence",
];

const Students = () => {
  const { user } = useAuth();

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    course: "",
  });
  const [editId, setEditId] = useState(null);

  /* ================= FETCH STUDENTS ================= */
  const fetchStudents = async () => {
    try {
      const { data } = await API.get("/students");
      setStudents(data);
    } catch (err) {
      alert("Failed to fetch students");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /* ================= FORM HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.age || !form.email || !form.course) {
      alert("All fields are required");
      return;
    }

    if (!VALID_COURSES.includes(form.course)) {
      alert("Invalid course selected");
      return;
    }

    const payload = {
      name: form.name.trim(),
      age: Number(form.age),
      email: form.email.trim(),
      course: form.course,
    };

    try {
      if (editId) {
        await API.put(`/students/${editId}`, payload);
      } else {
        await API.post("/students", payload);
      }

      setForm({ name: "", age: "", email: "", course: "" });
      setEditId(null);
      fetchStudents();
    } catch (err) {
      alert("Failed to save student");
      console.error(err);
    }
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      age: student.age,
      email: student.email,
      course: student.course,
    });
    setEditId(student._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await API.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      alert("Failed to delete student");
      console.error(err);
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <div className="card">
        <h2>Student Management System</h2>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <input
              id="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <input
              id="age"
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <input
              id="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            
  <Select
    options={VALID_COURSES.map(course => ({ value: course, label: course }))}
    value={form.course ? { value: form.course, label: form.course } : null}
    onChange={(selected) => setForm({ ...form, course: selected.value })}
    placeholder="Select Course"
  />
</div>


          <div className="field">
            <button type="submit">
              {editId ? "Update Student" : "Add Student"}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="5">No students available</td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.age}</td>
                  <td>{s.email}</td>
                  <td>{s.course}</td>
                 <td className="actions">
  {user.role === "admin" || user._id === s.createdBy ? (
    <>
      <button className="edit-btn" onClick={() => handleEdit(s)}>Edit</button>
      <button className="del-btn" onClick={() => handleDelete(s._id)}>Delete</button>
    </>
  ) : (
    <span>Not allowed</span>
  )}
</td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Students;
