🎓 STUDENT MANAGEMENT SYSTEM – MERN CAPSTONE PROJECT

A full-stack MERN application to manage student records with secure authentication, role-based access, and complete CRUD functionality. This project provides the core foundation for a final capstone project.


🎯 Features

🔐 Authentication

* User registration & login
* JWT-based authentication
* Protected dashboard routes
* Automatic redirection for unauthenticated users

👥 Role Management

* Two roles: Admin & User
* Admin can access and manage all student records
* Normal users can access only their own records
* Unauthorized access is blocked gracefully

📚 Student CRUD Module

* ➕ Create: Add new student records
* 📄 Read: View all students (Admin) or own students (User)
* ✏️ Update: Edit student information
* ❌ Delete: Remove student records

🎨 Frontend & UI

* Clean and responsive design
* Uniform input field sizes across forms
* Dropdown menus open below input fields
* Fully functional on mobile, tablet, and desktop

---

🛠 Tech Stack

Frontend:

* React (Vite)
* React Router
* Axios
* CSS (responsive, no external UI library)

Backend:

* Node.js & Express.js
* MongoDB & Mongoose
* JWT Authentication
* Password hashing with bcrypt

---

📂 **Project Structure


student-management-system/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Students.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── server.js
│   └── package.json
└── README.md


---

📸 Screenshots

1️⃣ Register Page
User registration form with validation.
![Register Page](screenshots/register.png)

2️⃣ Login Page
Secure login with JWT token.
![Login Page](screenshots/login.png)

3️⃣ Dashboard – Admin View
Admins can view and manage all students.
![Dashboard Admin](screenshots/dashboard-admin.png)

4️⃣ Dashboard – User View
Users can view/manage only their own students.
![Dashboard User](screenshots/dashboard-user.png)

5️⃣ Add / Edit Student Form
All input fields are equal size; dropdowns appear below inputs.
![Add/Edit Student](screenshots/add-edit-student.png)

6️⃣ Delete Confirmation
Ensures safe deletion of records.
![Delete Confirmation](screenshots/delete-student.png)

---

👩🏻‍💻 How to Run the Project

Backend

cd backend
npm install
npm run dev


Backend runs at: `http://localhost:5000`

Frontend


cd frontend
npm install
npm run dev


Frontend runs at: `http://localhost:5173`

---

✅ Functionalities

* Authentication (Register/Login) 
* JWT-based protected routes 
* Role-based access control (Admin/User) 
* Full CRUD functionality for students 
* Frontend–backend integration 
* Form validation & error handling 
* Responsive & professional UI 

---

📌 Notes

* Admin can manage all student records; Users manage only their own
* Input fields are consistently sized across all forms
* Dropdown menus open below inputs
* Tokens stored securely on the frontend

---

