import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../utils/Api';
import toast from 'react-hot-toast'; 
import { FaPlus, FaPoll, FaChartBar, FaCopy, FaExternalLinkAlt } from 'react-icons/fa';

export default function Dashboard() {
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const res = await Api.get('/survey/my-survey', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Handle data structure safely
        const data = res.data.surveys || res.data || [];
        setSurveys(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchSurveys();
  }, [navigate]);

  // --- NEW: Function to Copy Link ---
  const handleCopyLink = (surveyId) => {
    const link = `${window.location.origin}/survey/${surveyId}`;
    
    navigator.clipboard.writeText(link).then(() => {
        toast.success("Link copied! Ready to share.");
    }).catch(() => {
        toast.error("Failed to copy link");
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
           <h2 className="text-3xl font-bold text-gray-900">My Workspace</h2>
           <p className="text-gray-500 mt-1">Manage your surveys and view results.</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surveys.length === 0 ? (
           <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">You haven't created any surveys yet.</p>
              <Link to="/create" className="text-indigo-600 font-bold hover:underline">Create your first one</Link>
           </div>
        ) : (
           surveys.map(s => (
              <div key={s._id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
                
                <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                            <FaPoll size={18} />
                        </div>
                        <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Active
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate" title={s.title}>
                        {s.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {s.questions?.length || 0} Questions
                    </p>
                </div>

                {/* --- ACTIONS FOOTER --- */}
                <div className="bg-gray-50 border-t border-gray-100 p-4 grid grid-cols-2 gap-3">
                   {/* 1. View Analytics */}
                   <Link 
                        to={`/analytics/${s._id}`} 
                        className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
                   >
                        <FaChartBar className="text-indigo-500" /> Results
                   </Link>

                   {/* 2. Copy Link Button */}
                   <button 
                        onClick={() => handleCopyLink(s._id)} 
                        className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-indigo-600 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm active:transform active:scale-95"
                   >
                        <FaCopy /> Copy Link
                   </button>
                </div>
              </div>
           ))
        )}
      </div>
    </div>
  );
}
