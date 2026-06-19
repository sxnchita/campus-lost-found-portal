import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Auth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [selectedRole, setSelectedRole] = useState("STUDENT");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [forgotData, setForgotData] = useState({
    email: "",
    newPassword: "",
  });

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    rollNumber: "",
    department: "",
    phone: "",
  });

  const showError = (err, fallback) => {
    const backendMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.data ||
      fallback;

    setMessage(String(backendMessage));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/auth/login", loginData);

      if (!res.data.role) {
        setMessage(res.data.message || "Login failed.");
        return;
      }

      if (res.data.role !== selectedRole) {
        setMessage(`This account is ${res.data.role}, not ${selectedRole}`);
        return;
      }

      const userId =
        res.data.userId ||
        res.data.id ||
        res.data.user?.userId ||
        res.data.user?.id;

      if (!userId) {
        setMessage("Login success, but userId missing from backend response.");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.email || loginData.email);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", userId);

      navigate(res.data.role === "ADMIN" ? "/admin-dashboard" : "/student-dashboard");
    } catch (err) {
      showError(err, "Login failed. Check email/password.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await API.put("/auth/forgot-password", forgotData);

      setMessage("Password reset successful. Please login with your new password.");
      setForgotData({ email: "", newPassword: "" });
      setMode("login");
    } catch (err) {
      showError(err, "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await API.post("/users", registerData);

      setMessage("Student registration successful. Please login.");
      setMode("login");
      setSelectedRole("STUDENT");

      setRegisterData({
        fullName: "",
        email: "",
        password: "",
        rollNumber: "",
        department: "",
        phone: "",
      });
    } catch (err) {
      showError(err, "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 flex items-center justify-center px-4">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-2">
          Lost & Found Portal
        </h1>

        <p className="text-center text-gray-500 mb-6">
          {mode === "login"
            ? "Login to continue"
            : mode === "register"
            ? "Create student account"
            : "Reset your password"}
        </p>

        <div className="flex bg-purple-100 rounded-full p-1 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setMessage("");
            }}
            className={`w-1/2 py-2 rounded-full transition ${
              mode === "login" ? "bg-purple-600 text-white" : "text-purple-700"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("register");
              setSelectedRole("STUDENT");
              setMessage("");
            }}
            className={`w-1/2 py-2 rounded-full transition ${
              mode === "register" ? "bg-purple-600 text-white" : "text-purple-700"
            }`}
          >
            Student Register
          </button>
        </div>

        {mode === "login" && (
          <>
            <p className="text-sm text-gray-500 mb-2 text-center">Login as</p>

            <div className="flex gap-3 mb-5">
              <button
                type="button"
                onClick={() => setSelectedRole("STUDENT")}
                className={`w-1/2 py-2 rounded-xl border transition ${
                  selectedRole === "STUDENT"
                    ? "bg-green-200 border-green-500"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                Student
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("ADMIN")}
                className={`w-1/2 py-2 rounded-xl border transition ${
                  selectedRole === "ADMIN"
                    ? "bg-blue-200 border-blue-500"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                Admin
              </button>
            </div>
          </>
        )}

        {message && (
          <div className="mb-4 rounded-xl bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 text-sm">
            {message}
          </div>
        )}

        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              className={inputClass}
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              required
            />

            <input
              className={inputClass}
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              required
            />

            <button
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : `Login as ${selectedRole}`}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("forgot");
                setMessage("");
              }}
              className="w-full text-sm text-purple-700 hover:underline"
            >
              Forgot Password?
            </button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input
              className={inputClass}
              type="email"
              placeholder="Enter registered email"
              value={forgotData.email}
              onChange={(e) =>
                setForgotData({ ...forgotData, email: e.target.value })
              }
              required
            />

            <input
              className={inputClass}
              type="password"
              placeholder="Enter new password"
              value={forgotData.newPassword}
              onChange={(e) =>
                setForgotData({ ...forgotData, newPassword: e.target.value })
              }
              minLength={8}
              required
            />

            <button
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("login");
                setMessage("");
              }}
              className="w-full text-sm text-gray-600 hover:underline"
            >
              Back to Login
            </button>
          </form>
        )}

        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input className={inputClass} placeholder="Full Name" value={registerData.fullName} onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })} required />
            <input className={inputClass} type="email" placeholder="Email" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} required />
            <input className={inputClass} type="password" placeholder="Password minimum 8 characters" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} minLength={8} required />
            <input className={inputClass} placeholder="Roll Number" value={registerData.rollNumber} onChange={(e) => setRegisterData({ ...registerData, rollNumber: e.target.value })} />
            <input className={inputClass} placeholder="Department" value={registerData.department} onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })} />
            <input className={inputClass} placeholder="Phone number 10 digits" value={registerData.phone} onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })} pattern="[0-9]{10}" />

            <button
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register as STUDENT"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Auth;