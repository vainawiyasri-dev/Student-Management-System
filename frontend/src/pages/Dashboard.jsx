import Students from "./Students";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";




const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="card">
        <h2>Dashboard</h2>
        <p>Welcome, {user.name} ({user.role})</p>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <Students />
    </>
  );
};

export default Dashboard;
