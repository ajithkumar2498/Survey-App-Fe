import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Api from '../utils/Api';
import { FaArrowLeft, FaDatabase, FaChartPie, FaDownload } from 'react-icons/fa';

const socket = io(import.meta.env.VITE_SOCKET_URL);

export default function Analytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        // Fetch Survey Info
        const surveyRes = await Api.get(`/survey/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setSurvey(surveyRes.data.survey || surveyRes.data);

        // Fetch Responses
        const responseRes = await Api.get(`/response/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = responseRes.data.surveyResults || responseRes.data || [];
        setResponses(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    socket.on(`new-response-${id}`, (newRes) => setResponses(prev => [...prev, newRes]));
    return () => socket.off(`new-response-${id}`);
  }, [id, navigate]);

  // Chart Logic
  const getChartData = () => {
    if (!survey || responses.length === 0) return null;
    const firstQ = survey.questions[0]; 
    const counts = {};

    responses.forEach(r => {
        const answer = r.answers[firstQ._id];
        if (answer) counts[answer] = (counts[answer] || 0) + 1;
    });

    return {
        labels: Object.keys(counts),
        datasets: [{
            label: 'Votes',
            data: Object.values(counts),
            backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444'],
            borderRadius: 6,
        }]
    };
  };

  if (!survey) return <div className="flex h-screen items-center justify-center text-indigo-600 font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      
      {/* --- Top Header --- */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-4 transition">
            <FaArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{survey.title}</h1>
                <p className="text-gray-500 mt-1">Real-time analytics and response tracking</p>
            </div>
            <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
                <FaDownload /> Export CSV
            </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- Stats Card (Left) --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
            <div className="bg-indigo-50 p-4 rounded-full text-indigo-600 mb-3">
                <FaDatabase size={24} />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">{responses.length}</h2>
            <p className="text-gray-500 font-medium">Total Responses</p>
        </div>

        {/* --- Chart Card (Right - Spans 2 Cols) --- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
                <FaChartPie className="text-indigo-500" />
                <h3 className="font-bold text-gray-800">Quick Overview</h3>
            </div>
            <div className="h-64 w-full">
                {responses.length > 0 ? (
                    <Bar 
                        data={getChartData()} 
                        options={{ 
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: { y: { grid: { display: false } }, x: { grid: { display: false } } }
                        }} 
                    />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
                        No data available yet
                    </div>
                )}
            </div>
        </div>

        {/* --- Data Table (Full Width) --- */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 text-lg">Detailed Responses</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="p-4 border-b">#</th>
                            {survey.questions.map((q, i) => (
                                <th key={q._id} className="p-4 border-b min-w-[180px]">
                                    Q{i + 1}: {q.text}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {responses.length === 0 ? (
                            <tr>
                                <td colSpan={survey.questions.length + 1} className="p-8 text-center text-gray-400">
                                    Waiting for first response...
                                </td>
                            </tr>
                        ) : (
                            responses.map((res, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-mono text-gray-400">{i + 1}</td>
                                    {survey.questions.map(q => (
                                        <td key={q._id} className="p-4 text-gray-700 font-medium">
                                            {res.answers[q._id] || "-"}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
}