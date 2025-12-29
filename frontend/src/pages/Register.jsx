import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css"; 
import API from "../api/axios";





const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
  e.preventDefault();

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    await API.post("/auth/register", {
      name,
      email,
      password,
    });

    alert("Registration successful. Please login.");
    navigate("/login");   // ✅ go to login, not dashboard
  } catch (err) {
    alert(err.response?.data?.message || "Server not reachable");
    console.error(err);
  }
};


  return (
    <form className="register-form" onSubmit={submit}>
      <h2 className="herotext">Register</h2>


      <div className="container">
        <label><b>Name</b></label>
        <input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} required />

        <label><b>Email</b></label>
        <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label><b>Password</b></label>
        <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <label>
          <input type="checkbox" checked readOnly style={{ marginBottom: "15px" }} /> Remember me
        </label>

        <div className="clearfix">
          <button type="button" className="cancelbtn" onClick={() => navigate("/login")}>Cancel</button>
          <button type="submit" className="signupbtn">Sign Up</button>
        </div>
      </div>
    </form>
  );
};

export default Register;
