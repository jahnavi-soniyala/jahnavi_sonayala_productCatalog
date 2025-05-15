import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

function App() {
  const [authMode, setAuthMode] = useState("login"); // login or signup
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Fetch tasks when token changes
  useEffect(() => {
    if (token) {
      axios
        .get(`${API_BASE}/tasks`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setTasks(res.data))
        .catch(() => setTasks([]));
    }
  }, [token]);

  // Signup
  const signup = async () => {
    try {
      await axios.post(`${API_BASE}/auth/signup`, { username, email, password });
      alert("Signup successful! Please login.");
      setAuthMode("login");
    } catch (e) {
      alert("Signup failed: " + e.response?.data || e.message);
    }
  };

  // Login
  const login = async () => {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      alert("Logged in!");
    } catch (e) {
      alert("Login failed: " + e.response?.data || e.message);
    }
  };

  // Add task
  const addTask = async () => {
    if (!newTaskTitle) return alert("Enter a task title");
    try {
      const res = await axios.post(
        `${API_BASE}/tasks`,
        { title: newTaskTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, res.data]);
      setNewTaskTitle("");
    } catch (e) {
      alert("Add task failed");
    }
  };

  // Logout
  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
  };

  if (!token) {
    // Show Login or Signup form
    return (
      <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
        <h2>{authMode === "login" ? "Login" : "Signup"}</h2>
        {authMode === "signup" && (
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
        )}
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <button onClick={authMode === "login" ? login : signup} style={{ width: "100%", padding: 10 }}>
          {authMode === "login" ? "Login" : "Signup"}
        </button>
        <p style={{ marginTop: 10, cursor: "pointer", color: "blue" }} onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}>
          {authMode === "login" ? "Create an account" : "Have an account? Login"}
        </p>
      </div>
    );
  }

  // Show task list and add form
  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Your Tasks</h2>
      <button onClick={logout} style={{ marginBottom: 20 }}>
        Logout
      </button>
      <div>
        <input
          placeholder="New Task Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={{ padding: 8, width: "70%" }}
        />
        <button onClick={addTask} style={{ padding: "8px 16px", marginLeft: 10 }}>
          Add Task
        </button>
      </div>
      <ul style={{ marginTop: 20 }}>
        {tasks.length === 0 && <li>No tasks found</li>}
        {tasks.map((task) => (
          <li key={task._id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
