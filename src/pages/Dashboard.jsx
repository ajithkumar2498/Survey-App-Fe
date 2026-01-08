
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../utils/Api';
import { FaPlus, FaPoll, FaChartBar, FaExternalLinkAlt } from 'react-icons/fa'; // Icons

export default function Dashboard() {
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
           navigate('/login');
           return;
        }

        const res = await Api.get('/survey/my-survey', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Handle array vs object response
        if (Array.isArray(res.data)) setSurveys(res.data);
        else if (res.data.surveys) setSurveys(res.data.surveys);
        else setSurveys([]);

      } catch (err) {
        console.error("Error fetching:", err);
      }
    };

    fetchSurveys();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">    

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">My Workspace</h2>
                <p className="text-gray-500 mt-1">Manage your surveys and view analytics.</p>
            </div>
        </div>

        {/* Empty State */}
        {!Array.isArray(surveys) || surveys.length === 0 ? (
           <div className="flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-xl p-16 text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                 <FaPoll size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">No surveys yet</h3>
              <p className="text-gray-500 mb-6 max-w-sm">Create your first survey to start collecting feedback from users.</p>
              <Link to="/create" className="text-indigo-600 font-semibold hover:underline">Create New Survey</Link>
           </div>
        ) : (
          /* Survey Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map(s => (
              <div key={s._id} className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col overflow-hidden">
                
                {/* Card Header */}
                <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                            <FaPoll size={18} />
                        </div>
                        <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Active
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {s.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                        Click to view detailed analytics and manage responses.
                    </p>
                </div>

                {/* Card Footer / Actions */}
                <div className="bg-gray-50 border-t border-gray-100 p-4 flex gap-3">
                   <Link 
                        to={`/analytics/${s._id}`} 
                        className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
                    >
                        <FaChartBar className="text-indigo-500" /> Results
                   </Link>
                   <Link 
                        to={`/survey/${s._id}`} 
                        className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-gray-900 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        <FaExternalLinkAlt size={12} /> Link
                   </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}