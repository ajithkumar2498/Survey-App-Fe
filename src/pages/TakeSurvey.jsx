// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import API from '../utils/Api';
// import toast from 'react-hot-toast';

// export default function TakeSurvey() {
//   const { id } = useParams();
//   console.log(id)
//   const [survey, setSurvey] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const navigate = useNavigate()

//   useEffect(() => {
//     API.get(`/survey/${id}`).then(res => setSurvey(res.data.survey));
//   }, [id]);

// console.log(survey)

//   const handleChange = (qId, val) => {
//     setAnswers({ ...answers, [qId]: val });
//   };

//   const submit = async () => {
//     await API.post('/response/submit-response', { surveyId: id, answers });
//     toast.success('Thank you for your response!');
//     navigate('/')
//   };

//   if (!survey) return <p>Loading...</p>;

//   return (
//     <div className="p-10 max-w-2xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">{survey.title}</h1>
//       {survey.questions.map(q => (
//         <div key={q._id} className="mb-6">
//           <p className="font-semibold mb-2">{q.text}</p>
//           {q.type === 'text' ? (
//             <input className="border p-2 w-full" onChange={e => handleChange(q._id, e.target.value)} />
//           ) : (
//             <select className="border p-2 w-full" onChange={e => handleChange(q._id, e.target.value)}>
//               <option value="">Select an option</option>
//               {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//             </select>
//           )}
//         </div>
//       ))}
//       <button onClick={submit} className="bg-blue-600 text-white px-6 py-2 rounded">Submit</button>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../utils/Api';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaPaperPlane } from 'react-icons/fa';

export default function TakeSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/survey/${id}`)
      .then(res => {
          // Handle different response structures if necessary
          setSurvey(res.data.survey || res.data);
      })
      .catch(err => {
          console.error(err);
          toast.error("Failed to load survey");
      });
  }, [id]);

  const handleChange = (qId, val) => {
    setAnswers({ ...answers, [qId]: val });
  };

  const submit = async () => {
    if (survey.questions.length > Object.keys(answers).length) {
        toast.error("Please answer all questions before submitting.");
        return;
    }

    setLoading(true);
    try {
        await API.post('/response/submit-response', { surveyId: id, answers });
        toast.success('Thank you for your response!');
        navigate('/'); // Redirected to home or a "Thank You" page
    } catch (error) {
        console.error(error);
        toast.error("Submission failed. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  if (!survey) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-indigo-600">
        <svg className="animate-spin h-10 w-10 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span className="text-lg font-semibold">Loading Survey...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Survey Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            
            {/* Header */}
            <div className="bg-indigo-600 px-8 py-10 text-center">
                <h1 className="text-3xl font-bold text-white tracking-wide mb-2">{survey.title}</h1>
                <p className="text-indigo-100 text-sm opacity-90">Please answer the following questions</p>
            </div>

            {/* Questions Container */}
            <div className="p-8 space-y-10">
                {survey.questions.map((q, index) => (
                    <div key={q._id} className="relative">
                        
                        {/* Question Number & Text */}
                        <div className="mb-4">
                            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1 block">
                                Question {index + 1}
                            </span>
                            <h3 className="text-xl font-medium text-gray-900 leading-snug">
                                {q.text}
                            </h3>
                        </div>

                        {/* Input Area */}
                        <div>
                            {q.type === 'text' ? (
                                <input 
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-4 text-gray-700 bg-gray-50 focus:bg-white transition-all outline-none border hover:border-indigo-300"
                                    placeholder="Type your answer here..."
                                    onChange={e => handleChange(q._id, e.target.value)} 
                                />
                            ) : (
                                <div className="space-y-3">
                                    {q.options.map(opt => (
                                        <label 
                                            key={opt} 
                                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:bg-indigo-50 ${answers[q._id] === opt ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200'}`}
                                        >
                                            <input 
                                                type="radio" 
                                                name={q._id} 
                                                value={opt}
                                                onChange={e => handleChange(q._id, e.target.value)}
                                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <span className="ml-3 text-gray-700 font-medium">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / Submit Button */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-end">
                <button 
                    onClick={submit} 
                    disabled={loading}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Submitting...' : (
                        <>
                            Submit Survey <FaPaperPlane size={14} />
                        </>
                    )}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}