const API_URL = "http://localhost:5000/students";

const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const courseInput = document.getElementById('course');
const form = document.getElementById('studentForm');
const submitBtn = document.getElementById('submitBtn');
const tableBody = document.getElementById('studentTableBody');

let editMode = null;

// Courses allowed
const VALID_COURSES = [
  "Full Stack Development", "Front-End Development", "Back-End Development",
  "AI/Machine Learning", "Data Analyst", "Data Science", "DevOps",
  "Cloud Computing", "Cybersecurity", "Mobile App Development", "UI/UX Design",
  "Blockchain Development", "Big Data", "Internet of Things", "Business Intelligence"
];

// Inline error helpers
function setInlineError(input, message) {
  input.classList.remove('inline-success');
  input.classList.add('inline-error');
  input.value = '';
  input.placeholder = message;
}

function setInlineSuccess(input, placeholderText) {
  input.classList.remove('inline-error');
  input.classList.add('inline-success');
  input.placeholder = placeholderText;
}

function resetInline(input, placeholderText) {
  input.classList.remove('inline-error', 'inline-success');
  input.placeholder = placeholderText;
}

// Reset error when user focuses input
[nameInput, ageInput, courseInput].forEach(inp => {
  inp.addEventListener('focus', () => {
    if (inp.classList.contains('inline-error')) {
      const id = inp.getAttribute('id');
      if (id === 'name') inp.placeholder = 'Name';
      else if (id === 'age') inp.placeholder = 'Age (18-100)';
      else if (id === 'course') inp.placeholder = 'Course';
      inp.classList.remove('inline-error');
      inp.value = '';
    }
  });
});

/* -------------------------
     LIVE VALIDATION
-------------------------- */

// NAME VALIDATION
nameInput.addEventListener('input', () => {
  const v = nameInput.value.trim();
  if (v === "") {
    resetInline(nameInput, "Name");
    return;
  }
  if (v.length < 3) {
    nameInput.classList.add("inline-error");
    nameInput.classList.remove("inline-success");
    return;
  }
  setInlineSuccess(nameInput, "Name");
});

// AGE VALIDATION
ageInput.addEventListener('input', () => {
  const v = ageInput.value.trim();
  const n = Number(v);
  if (v === "") {
    resetInline(ageInput, "Age (18-100)");
    return;
  }
  if (!Number.isInteger(n) || n < 18 || n > 100) {
    ageInput.classList.add("inline-error");
    ageInput.classList.remove("inline-success");
    return;
  }
  setInlineSuccess(ageInput, "Age (18-100)");
});

// COURSE VALIDATION
courseInput.addEventListener('input', () => {
  const v = courseInput.value.trim();
  if (v === "") {
    resetInline(courseInput, "Course");
    return;
  }
  const matchedCourse = VALID_COURSES.find(c => c.toLowerCase() === v.toLowerCase());
  if (!matchedCourse) {
    courseInput.classList.add("inline-error");
    courseInput.classList.remove("inline-success");
    return;
  }
  setInlineSuccess(courseInput, "Course");
});

/* -------------------------
   SUBMIT VALIDATION
-------------------------- */
function validateAllFields() {
  let ok = true;

  const name = nameInput.value.trim();
  const ageStr = ageInput.value.trim();
  const course = courseInput.value.trim();

  // NAME
  if (name === "") {
    setInlineError(nameInput, "Name should not be empty");
    ok = false;
  } else if (name.length < 3) {
    setInlineError(nameInput, "Minimum 3 characters required");
    ok = false;
  }

  // AGE
  const age = Number(ageStr);
  if (!ageStr || Number.isNaN(age) || !Number.isInteger(age) || age < 18 || age > 100) {
    setInlineError(ageInput, "Age must be between 18-100");
    ok = false;
  }

  // COURSE
  const matchedCourse = VALID_COURSES.find(c => c.toLowerCase() === course.toLowerCase());
  if (!matchedCourse) {
    setInlineError(courseInput, "Invalid course (valid course only)");
    ok = false;
  }

  return ok;
}

/* -------------------------
   SUBMIT HANDLER
-------------------------- */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  [nameInput, ageInput, courseInput].forEach(i => i.classList.remove('inline-success'));
  if (!validateAllFields()) return;

  const matchedCourse = VALID_COURSES.find(c => c.toLowerCase() === courseInput.value.trim().toLowerCase());
  const payload = {
    name: nameInput.value.trim(),
    age: Number(ageInput.value.trim()),
    course: matchedCourse
  };

  try {
    submitBtn.disabled = true;
    const url = editMode ? `${API_URL}/${encodeURIComponent(editMode)}` : API_URL;
    const method = editMode ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      let errText = `${res.status} ${res.statusText}`;
      try {
        const json = await res.json();
        if (json.message) errText = json.message;
      } catch {}
      setInlineError(nameInput, errText);
      return;
    }

    await res.json();
    editMode = null;
    submitBtn.textContent = "Add Student";
    form.reset();
    resetPlaceholders();
    await loadStudents();
  } catch (err) {
    console.error("Network error", err);
    setInlineError(nameInput, "Network error");
  } finally {
    submitBtn.disabled = false;
  }
});

function resetPlaceholders() {
  resetInline(nameInput, 'Name');
  resetInline(ageInput, 'Age (18-100)');
  resetInline(courseInput, 'Course');
}

/* -------------------------
   LOAD TABLE
-------------------------- */
async function loadStudents() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) return console.error("Failed to load students");

    const data = await res.json();
    tableBody.innerHTML = "";

    data.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(s.name)}</td>
        <td>${escapeHtml(String(s.age))}</td>
        <td>${escapeHtml(s.course)}</td>
        <td class="actions">
          <button class="edit-btn" data-id="${s.id}">Edit</button>
          <button class="del-btn" data-id="${s.id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    tableBody.querySelectorAll(".edit-btn").forEach(b => b.addEventListener("click", onEdit));
    tableBody.querySelectorAll(".del-btn").forEach(b => b.addEventListener("click", onDelete));
  } catch (err) {
    console.error("Error loading students", err);
  }
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

/* -------------------------
   DELETE
-------------------------- */
async function onDelete(e) {
  const id = e.currentTarget.getAttribute("data-id");
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) return console.error("Delete failed");
    await loadStudents();
  } catch (err) {
    console.error("Delete error", err);
  }
}

/* -------------------------
   EDIT MODE
-------------------------- */
function onEdit(e) {
  const id = e.currentTarget.getAttribute("data-id");
  const row = e.currentTarget.closest("tr");

  const name = row.children[0].textContent;
  const age = row.children[1].textContent;
  const course = row.children[2].textContent;

  nameInput.value = name;
  ageInput.value = age;
  courseInput.value = course;

  submitBtn.textContent = "Update Student";
  editMode = id;

  if (name.length >= 3) setInlineSuccess(nameInput, "Name");
  if (Number(age) >= 18 && Number(age) <= 100) setInlineSuccess(ageInput, "Age (18-100)");
  if (VALID_COURSES.includes(course)) setInlineSuccess(courseInput, "Course");

  nameInput.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* -------------------------
   INIT
-------------------------- */
resetPlaceholders();
loadStudents();

