import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../utils/Api";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaArrowRight, FaPoll } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await Api.post("/user/login", { email, password });

      const data = response.data;

      // CHECK IF DATA EXISTS BEFORE ACCESSING
      if (!data || !data.token) {
        throw new Error("Invalid server response: Missing token");
      }

      const safeUser = {
        token: data.token,
        // Fallback to empty string if 'name' is missing, or check for 'fullname'
        userName: data.userName || "User",
        email: data.email || "",
      };

      console.log("Saving to Context:", safeUser);

      // CALL CONTEXT for save user details after LOGIN
      login(safeUser);

      toast.success("Welcome back!");
      navigate("/dashboard"); // Redirect happens here
    } catch (error) {
      console.error("LOGIN ERROR DETAILED:", error);
      const errorMsg =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:flex w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-indigo-900 to-indigo-900"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-20 right-20 w-60 h-60 bg-indigo-400 rounded-full blur-3xl opacity-20"></div>

        <div className="relative z-10 text-center px-10">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl inline-block mb-6 shadow-xl">
            <FaPoll className="text-white text-5xl" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Join SurveyApp</h1>
          <p className="text-indigo-100 text-lg max-w-md mx-auto leading-relaxed">
            Start creating professional surveys and analyzing results in
            minutes.
          </p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6">Welcome Back</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-center">
            New here?{" "}
            <Link to="/register" className="text-indigo-600 font-bold">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
