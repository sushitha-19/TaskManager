import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) throw new Error();

      alert("Password updated successfully!");
      navigate("/");

    } catch {
      alert("Error resetting password");
    }
  };

  return (
    <div className="center-box">
      <h2>Forgot Password</h2>

      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* ✅ ONLY ONE MAIN ACTION BUTTON */}
        <button type="submit">Reset Password</button>
      </form>

      {/* ✅ SIDE-BY-SIDE LINKS */}
      <div className="auth-links">
        <span onClick={() => navigate("/")}>
          Back to Login
        </span>

        <span onClick={handleReset}>
          Reset Now
        </span>
      </div>
    </div>
  );
}

export default ForgotPassword;