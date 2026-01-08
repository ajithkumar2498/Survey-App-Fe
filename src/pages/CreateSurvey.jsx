import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../utils/Api';
import { FaPlus, FaTrash, FaSave, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function CreateSurvey() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', type: 'choice', options: ['Yes', 'No'] } // Default first question
  ]);
  const [loading, setLoading] = useState(false);

  // --- Handlers ---

  const addQuestion = () => {
    setQuestions([...questions, { text: '', type: 'text', options: [] }]);
  };

  const removeQuestion = (index) => {
    const newQ = [...questions];
    newQ.splice(index, 1);
    setQuestions(newQ);
  };

  const updateQuestion = (index, field, value) => {
    const newQ = [...questions];
    newQ[index][field] = value;
    // Reset options if switching to text
    if (field === 'type' && value === 'text') {
        newQ[index].options = [];
    }
    // Add default options if switching to choice
    if (field === 'type' && value === 'choice' && newQ[index].options.length === 0) {
        newQ[index].options = ['Option 1', 'Option 2'];
    }
    setQuestions(newQ);
  };

  const handleOptionChange = (qIndex, oIndex, val) => {
    const newQ = [...questions];
    newQ[qIndex].options[oIndex] = val;
    setQuestions(newQ);
  };

  const addOption = (qIndex) => {
    const newQ = [...questions];
    newQ[qIndex].options.push('');
    setQuestions(newQ);
  };

  const removeOption = (qIndex, oIndex) => {
    const newQ = [...questions];
    newQ[qIndex].options.splice(oIndex, 1);
    setQuestions(newQ);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return toast.error("Please enter a survey title");
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        await Api.post('/survey/create', { title, questions }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Survey Created!");
        navigate('/dashboard');
    } catch (err) {
        console.error(err);
       toast.error("Failed to create survey");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-0">
      <div className="max-w-3xl mx-auto">
        
        {/* Header / Back Button */}
        <button onClick={() => navigate('/')} className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition">
            <FaArrowLeft className="mr-2" /> Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            
            {/* 1. Survey Title Section */}
            <div className="bg-indigo-600 p-8 text-white">
                <label className="block text-indigo-100 text-sm font-bold mb-2 uppercase tracking-wide">Survey Title</label>
                <input 
                    type="text" 
                    placeholder="e.g. Customer Feedback 2024" 
                    className="w-full bg-indigo-700 text-white placeholder-indigo-300 border-none rounded-lg p-4 text-2xl font-bold focus:ring-2 focus:ring-white focus:outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {/* 2. Questions List */}
            <div className="p-8 space-y-8">
                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative group hover:border-indigo-300 transition-all">
                        
                        {/* Delete Question Button (Top Right) */}
                        <button 
                            onClick={() => removeQuestion(qIndex)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition p-2"
                            title="Delete Question"
                        >
                            <FaTrash />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {/* Question Text */}
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 font-semibold mb-2">Question {qIndex + 1}</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="What would you like to ask?"
                                    value={q.text}
                                    onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                                />
                            </div>

                            {/* Question Type */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Type</label>
                                <select 
                                    className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    value={q.type}
                                    onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                                >
                                    <option value="text">Short Answer</option>
                                    <option value="choice">Multiple Choice</option>
                                </select>
                            </div>
                        </div>

                        {/* Options Section (Only for Choice) */}
                        {q.type === 'choice' && (
                            <div className="pl-4 border-l-4 border-indigo-100 mt-4 space-y-3">
                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full border border-gray-400"></div>
                                        <input 
                                            type="text" 
                                            className="flex-1 bg-transparent border-b border-gray-300 focus:border-indigo-500 focus:outline-none py-1 text-gray-700"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            placeholder={`Option ${oIndex + 1}`}
                                        />
                                        <button onClick={() => removeOption(qIndex, oIndex)} className="text-gray-400 hover:text-red-500">
                                            &times;
                                        </button>
                                    </div>
                                ))}
                                <button 
                                    onClick={() => addOption(qIndex)}
                                    className="text-sm text-indigo-600 font-semibold hover:underline mt-2 flex items-center gap-1"
                                >
                                    <FaPlus size={10} /> Add Option
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 3. Footer Actions */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-between items-center">
                <button 
                    onClick={addQuestion}
                    className="flex items-center gap-2 text-gray-600 font-semibold hover:text-indigo-600 transition"
                >
                    <div className="bg-gray-200 p-2 rounded-full">
                        <FaPlus size={12} />
                    </div>
                    Add Question
                </button>

                <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : <><FaSave /> Publish Survey</>}
                </button>
            </div>

        </div>
      </div>
    </div>
  );
}