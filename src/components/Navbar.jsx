import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPlus, FaPoll } from "react-icons/fa";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("name")

 const handleLogout = () => {
    localStorage.clear();    
    navigate('/login');
  };

  // If current path is login, register, or a public survey link, return null (render nothing)
  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/survey/") 
  ) {
    return null;
  }

  // I hidded if no token (user not logged in)
  if (!token) return null;

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <FaPoll size={20} />
          </div>
          <Link to="/">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              SurveyApp
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-500 hidden md:block">
            Welcome back! 
          </span>
          <span className="text-lg bg-green-100 px-2 py-1 rounded-md text-green-500">{userName}</span>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-500 hover:text-red-700 transition"
          >
            Logout
          </button>
          <Link
            to="/create"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-medium transition shadow-md hover:shadow-lg"
          >
            <FaPlus size={12} /> Create Survey
          </Link>
        </div>
      </nav>
    </>
  );
};
