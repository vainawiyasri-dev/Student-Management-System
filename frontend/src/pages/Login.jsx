import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";
import API from "../api/axios";




const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill all fields");

    try {
      const { data } = await API.post("/auth/login", { email, password });
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Server not reachable");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="imgcontainer">
        <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="Avatar" className="avatar" />
      </div>

      <div className="container">
        <label htmlFor="uname"><b>Email</b></label>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="psw"><b>Password</b></label>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <label>
          <input type="checkbox" checked readOnly name="remember" /> Remember me
        </label>
      </div>

      <div className="container-login-footer">
        <button
          type="button"
          className="cancelbtn"
          onClick={() => { setEmail(""); setPassword(""); }}
        >
          Cancel
        </button>
        <span className="psw">
          Forgot <a href="#">password?</a>
        </span>
      </div>
    </form>
  );
};

export default Login;
