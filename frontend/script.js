const API_URL = "/students";

const form = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const courseInput = document.getElementById("course");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelEdit");
const tableBody = document.getElementById("studentTableBody");

let editId = null;
const VALID_COURSES = [
  "Full Stack Development", "Front-End Development", "Back-End Development",
  "AI/Machine Learning", "Data Analyst", "Data Science", "DevOps",
  "Cloud Computing", "Cybersecurity", "Mobile App Development", "UI/UX Design",
  "Blockchain Development", "Big Data", "Internet of Things", "Business Intelligence"
];

/* -------------------------
   UTILITIES
-------------------------- */
function resetForm() {
  form.reset();
  editId = null;
  submitBtn.textContent = "Add Student";
  cancelBtn.hidden = true;
  [nameInput, ageInput, courseInput].forEach(i => i.classList.remove("inline-error", "inline-success"));
}

function showInlineError(input, message) {
  input.classList.add("inline-error");
  input.classList.remove("inline-success");
  input.value = "";
  input.placeholder = message;
}

function showInlineSuccess(input) {
  input.classList.remove("inline-error");
  input.classList.add("inline-success");
}

function validateInputs() {
  let valid = true;
  const name = nameInput.value.trim();
  const age = Number(ageInput.value.trim());
  const course = courseInput.value.trim();

  if (!name || name.length < 3) {
    showInlineError(nameInput, "Name ≥ 3 chars required");
    valid = false;
  } else showInlineSuccess(nameInput);

  if (!Number.isInteger(age) || age < 18 || age > 100) {
    showInlineError(ageInput, "Age 18–100 required");
    valid = false;
  } else showInlineSuccess(ageInput);

  if (!VALID_COURSES.some(c => c.toLowerCase() === course.toLowerCase())) {
    showInlineError(courseInput, "Invalid course");
    valid = false;
  } else showInlineSuccess(courseInput);

  return valid;
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
}

/* -------------------------
   CRUD FUNCTIONS
-------------------------- */
async function fetchStudents() {
  try {
    const res = await fetch(API_URL);
    const students = await res.json();
    renderTable(students);
  } catch (err) {
    console.error("Failed to fetch students", err);
  }
}

async function createStudent(student) {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });
  await fetchStudents();
}

async function updateStudent(id, student) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });
  await fetchStudents();
}

async function deleteStudent(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  await fetchStudents();
}

/* -------------------------
   TABLE RENDERING
-------------------------- */
function renderTable(students) {
  tableBody.innerHTML = "";

  if (!students.length) {
    tableBody.innerHTML = `<tr><td colspan="4">No students available</td></tr>`;
    return;
  }

  students.forEach(student => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHTML(student.name)}</td>
      <td>${escapeHTML(String(student.age))}</td>
      <td>${escapeHTML(student.course)}</td>
      <td>
        <button class="edit-btn" data-id="${student.id}">Edit</button>
        <button class="del-btn" data-id="${student.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  tableBody.querySelectorAll(".edit-btn").forEach(btn => btn.addEventListener("click", startEdit));
  tableBody.querySelectorAll(".del-btn").forEach(btn => btn.addEventListener("click", e => deleteStudent(e.target.dataset.id)));
}

/* -------------------------
   EDIT MODE
-------------------------- */
function startEdit(e) {
  const id = e.target.dataset.id;
  const row = e.target.closest("tr");

  nameInput.value = row.children[0].textContent;
  ageInput.value = row.children[1].textContent;
  courseInput.value = row.children[2].textContent;

  submitBtn.textContent = "Update Student";
  cancelBtn.hidden = false;
  editId = id;

  [nameInput, ageInput, courseInput].forEach(inp => inp.classList.add("inline-success"));
}

/* -------------------------
   EVENT LISTENERS
-------------------------- */
form.addEventListener("submit", async e => {
  e.preventDefault();
  if (!validateInputs()) return;

  const matchedCourse = VALID_COURSES.find(c => c.toLowerCase() === courseInput.value.trim().toLowerCase());
  const payload = {
    name: nameInput.value.trim(),
    age: Number(ageInput.value.trim()),
    course: matchedCourse
  };

  if (editId) await updateStudent(editId, payload);
  else await createStudent(payload);

  resetForm();
});

cancelBtn.addEventListener("click", resetForm);

/* -------------------------
   INIT
-------------------------- */
fetchStudents();
