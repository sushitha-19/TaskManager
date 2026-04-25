import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const text = await res.text();

      if (!res.ok) throw new Error(text);

      const data = JSON.parse(text);

      localStorage.setItem("user", JSON.stringify(data));
      setIsLoggedIn(true);

      navigate("/tasks");

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="center-box">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      {/* ✅ UPDATED */}
      <div className="auth-links login-links">
        <span onClick={() => navigate("/signup")}>
          Signup
        </span>

        <span onClick={() => navigate("/forgot-password")}>
          Forgot Password?
        </span>
      </div>
    </div>
  );
}

export default Login;