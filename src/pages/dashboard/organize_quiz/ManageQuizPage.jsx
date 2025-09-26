import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createQuestion, updateQuestion, deleteQuestion, getQuizById } from '../../../utils/quizManageApi';
import { createSession } from '../../../utils/quizRuntimeApi';
import { useMessage } from '../../../contexts/MessageContext';
import { v4 as uuidv4 } from 'uuid';

function ManageQuizPage() {
  const { quizId } = useParams();
  const { showMessage } = useMessage();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizLink, setQuizLink] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [sessionCreating, setSessionCreating] = useState(false);
  const [activeSession, setActiveSession] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      setLoading(true);
      try {
        const data = await getQuizById(quizId);
        setQuiz(data);
        
        // Map backend question format to frontend format
        const mappedQuestions = (data.questions || []).map(q => {
          console.log('Backend question:', q); // Debug log
          console.log('Question text field:', q.text);
          console.log('Question question field:', q.question);
          console.log('Question _id:', q._id);
          console.log('Question id:', q.id);
          
          return {
            id: q._id || q.id,
            question: q.text || q.question || q._id || '', // Fallback to _id if no text
            type: q.type ? q.type.toUpperCase() : 'MCQ', // Ensure uppercase type
            answers: q.options || [], // Map 'options' to 'answers'
            correct: mapCorrectAnswers(q), // Map correct answers based on type
            explanation: q.explanation || '' // Map explanation field
          };
        });
        
        setQuestions(mappedQuestions);
        console.log('Mapped questions:', mappedQuestions); // Debug log
        setQuizLink(`${window.location.origin}/quiz/${quizId}`);
      } catch (err) {
        showMessage('Failed to load quiz: ' + err.message, 'error');
      }
      setLoading(false);
    }
    loadQuiz();
  }, [quizId, showMessage]);

  // Helper function to map correct answers from backend format
  const mapCorrectAnswers = (backendQuestion) => {
    const type = backendQuestion.type ? backendQuestion.type.toUpperCase() : 'MCQ';
    const correctAnswer = backendQuestion.correctAnswer;
    const options = backendQuestion.options || [];

    if (type === 'MCQ') {
      // Find the index of the correct answer in options
      const correctIndex = options.findIndex(option => option === correctAnswer);
      return correctIndex >= 0 ? [correctIndex] : [0];
    } else if (type === 'MSQ') {
      // For MSQ, correctAnswer should be an array
      if (Array.isArray(correctAnswer)) {
        return correctAnswer.map(answer => {
          const index = options.findIndex(option => option === answer);
          return index >= 0 ? index : 0;
        }).filter((index, pos, arr) => arr.indexOf(index) === pos); // Remove duplicates
      } else {
        const correctIndex = options.findIndex(option => option === correctAnswer);
        return correctIndex >= 0 ? [correctIndex] : [];
      }
    } else if (type === 'TEXT') {
      // For text questions, store the correct answer as string
      return [correctAnswer || ''];
    }
    
    return [0]; // Default fallback
  };

  // Question CRUD handlers (similar to previous logic)
  const handleQuestionChange = (idx, value) => {
    const updated = [...questions];
    updated[idx].question = value;
    setQuestions(updated);
  };
  
  const handleExplanationChange = (idx, value) => {
    const updated = [...questions];
    updated[idx].explanation = value;
    setQuestions(updated);
  };
  const handleTypeChange = (idx, value) => {
    const updated = [...questions];
    updated[idx].type = value;
    if (value === 'Text') {
      updated[idx].answers = [];
      updated[idx].correct = [''];
    } else {
      updated[idx].answers = ['', ''];
      updated[idx].correct = value === 'MSQ' ? [] : [0];
    }
    // Keep explanation when changing type
    updated[idx].explanation = updated[idx].explanation || '';
    setQuestions(updated);
  };
  const handleAnswerChange = (qIdx, aIdx, value) => {
    const updated = [...questions];
    updated[qIdx].answers[aIdx] = value;
    setQuestions(updated);
  };
  const handleCorrectChange = (qIdx, aIdx, checked) => {
    const updated = [...questions];
    if (updated[qIdx].type === 'MCQ') {
      updated[qIdx].correct = [aIdx];
    } else if (updated[qIdx].type === 'MSQ') {
      if (checked) {
        updated[qIdx].correct = [...updated[qIdx].correct, aIdx];
      } else {
        updated[qIdx].correct = updated[qIdx].correct.filter(i => i !== aIdx);
      }
    }
    setQuestions(updated);
  };
  const handleTextCorrectChange = (qIdx, value) => {
    const updated = [...questions];
    updated[qIdx].correct = [value];
    setQuestions(updated);
  };
  const addQuestion = () => {
    setQuestions([...questions, { 
      question: '', 
      type: 'MCQ', 
      answers: ['', ''], 
      correct: [0],
      explanation: '' 
    }]);
  };
  const saveQuestion = async (q, idx) => {
    // Validate question data
    if (!q.question || !q.question.trim()) {
      showMessage('Question text is required', 'error');
      return;
    }

    let payload = {
      type: q.type.toLowerCase(),
      text: q.question.trim(), // Changed from 'question' to 'text'
      explanation: q.explanation ? q.explanation.trim() : '' // Add explanation field
    };

    if (q.type === 'MCQ') {
      // Validate MCQ has options and correct answer
      if (!q.answers || q.answers.length < 2) {
        showMessage('MCQ must have at least 2 options', 'error');
        return;
      }
      if (q.correct === undefined || q.correct.length === 0) {
        showMessage('Please select the correct answer', 'error');
        return;
      }
      payload.options = q.answers.filter(ans => ans.trim() !== '');
      payload.correctAnswer = q.answers[q.correct[0]] || ''; // Changed from 'answer' to 'correctAnswer'
    } else if (q.type === 'MSQ') {
      // Validate MSQ has options and correct answers
      if (!q.answers || q.answers.length < 2) {
        showMessage('MSQ must have at least 2 options', 'error');
        return;
      }
      if (!q.correct || q.correct.length === 0) {
        showMessage('Please select at least one correct answer', 'error');
        return;
      }
      payload.options = q.answers.filter(ans => ans.trim() !== '');
      payload.correctAnswer = q.correct.map(i => q.answers[i]).filter(ans => ans && ans.trim()); // Changed from 'answer' to 'correctAnswer'
    } else if (q.type === 'Text') {
      payload.correctAnswer = (q.correct && q.correct[0]) ? q.correct[0].trim() : ''; // Changed from 'answer' to 'correctAnswer'
    }

    console.log('Saving question payload:', payload);
    console.log('Question ID:', q.id);
    console.log('Quiz ID:', quizId);

    try {
      let res;
      if (q.id) {
        console.log('Updating existing question');
        res = await updateQuestion(quizId, q.id, payload);
      } else {
        console.log('Creating new question');
        res = await createQuestion(quizId, payload);
      }
      
      console.log('API Response:', res);
      
      const updated = [...questions];
      updated[idx] = { ...q, id: res.id || res._id || res.questionId || q.id };
      setQuestions(updated);
      showMessage('Question saved!', 'success');
    } catch (err) {
      console.error('Save question error:', err);
      console.error('Error response:', err.response?.data);
      showMessage('Failed to save question: ' + (err.response?.data?.message || err.message), 'error');
    }
  };
  const deleteQuestionBackend = async (q, idx) => {
    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }
    
    console.log('Deleting question:', q); // Debug log
    console.log('Question ID:', q.id); // Debug log
    
    if (!q.id) {
      // If no ID, just remove from local state
      setQuestions(questions.filter((_, i) => i !== idx));
      showMessage('Question removed!', 'success');
      return;
    }
    
    try {
      console.log('Calling deleteQuestion API with quizId:', quizId, 'questionId:', q.id);
      await deleteQuestion(quizId, q.id);
      setQuestions(questions.filter((_, i) => i !== idx));
      showMessage('Question deleted!', 'success');
    } catch (err) {
      console.error('Delete question error:', err);
      console.error('Error response:', err.response?.data);
      showMessage('Failed to delete question: ' + (err.response?.data?.message || err.message), 'error');
    }
  };
  const addAnswer = (qIdx) => {
    const updated = [...questions];
    updated[qIdx].answers.push('');
    setQuestions(updated);
  };
  const removeAnswer = (qIdx, aIdx) => {
    const updated = [...questions];
    updated[qIdx].answers.splice(aIdx, 1);
    if (updated[qIdx].type === 'MCQ' || updated[qIdx].type === 'MSQ') {
      updated[qIdx].correct = updated[qIdx].correct.filter(i => i !== aIdx).map(i => (i > aIdx ? i - 1 : i));
    }
    setQuestions(updated);
  };

  // Session management functions
  const handleStartQuiz = async () => {
    if (!quiz || !questions.length) {
      showMessage('Please add at least one question before starting the quiz', 'error');
      return;
    }

    const newSessionId = uuidv4();
    setSessionCreating(true);

    try {
      console.log('Creating session:', { sessionId: newSessionId, quizId: quizId });
      await createSession(newSessionId, quizId);
      
      setSessionId(newSessionId);
      setActiveSession(true);
      setQuizLink(`${window.location.origin}/quiz/${newSessionId}`);
      
      showMessage('Quiz session started successfully!', 'success');
      console.log('Session created successfully:', newSessionId);
    } catch (err) {
      console.error('Failed to create session:', err);
      showMessage('Failed to start quiz session: ' + (err.response?.data?.message || err.message), 'error');
    }

    setSessionCreating(false);
  };

  const handleStopQuiz = () => {
    // Reset session state
    setActiveSession(false);
    setSessionId('');
    setQuizLink('');
    showMessage('Quiz session stopped', 'info');
  };

  if (loading) return <div className="flex justify-center items-center h-40">Loading quiz...</div>;
  if (!quiz) return <div className="text-error">Quiz not found.</div>;

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center py-8 px-2">
      <button className="btn btn-ghost mb-4 self-start" onClick={() => navigate(-1)}>&larr; Back to Quizzes</button>
      <h1 className="text-2xl font-bold mb-2">Manage Quiz: {quiz.title}</h1>
      <div className="mb-4 text-base-content/70">Quiz ID: {quizId}</div>

      {/* Session Status and Controls */}
      <div className="w-full max-w-3xl mb-6">
        {!activeSession ? (
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h3 className="card-title text-lg">Quiz Session</h3>
              <p className="text-base-content/70 mb-4">Start a live session for students to join and take this quiz.</p>
              <div className="flex gap-4">
                <button 
                  className="btn btn-success" 
                  onClick={handleStartQuiz}
                  disabled={sessionCreating || !questions.length}
                >
                  {sessionCreating ? 'Starting...' : 'Start Quiz Session'}
                </button>
                {questions.length === 0 && (
                  <span className="text-warning text-sm self-center">Add questions first</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="card bg-success/20 border border-success shadow-md">
            <div className="card-body">
              <h3 className="card-title text-success">🟢 Live Quiz Session</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-base-content/70">Session ID:</p>
                  <p className="font-mono text-lg font-bold">{sessionId}</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Questions:</p>
                  <p className="text-lg font-bold">{questions.length}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  className="btn btn-error btn-outline" 
                  onClick={handleStopQuiz}
                >
                  Stop Session
                </button>
                <button 
                  className="btn btn-info"
                  onClick={() => navigator.clipboard.writeText(sessionId)}
                >
                  Copy Session ID
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate(`/leaderboard/${sessionId}`)}
                >
                  View Live Results
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-6">
        {questions.map((q, qIdx) => (
          <div className="card bg-base-200 shadow-md" key={qIdx}>
            <div className="card-body">
              <div className="flex justify-between items-center mb-2">
                <h2 className="card-title">Question {qIdx + 1}</h2>
                <div className="flex gap-2">
                  <button className="btn btn-success btn-xs" onClick={() => saveQuestion(q, qIdx)}>Save</button>
                  <button className="btn btn-error btn-xs" onClick={() => deleteQuestionBackend(q, qIdx)}>Delete</button>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-2 mb-2">
                <input
                  className="input input-bordered flex-1"
                  placeholder="Enter question"
                  value={q.question}
                  onChange={e => handleQuestionChange(qIdx, e.target.value)}
                />
                <select
                  className="select select-bordered w-36"
                  value={q.type}
                  onChange={e => handleTypeChange(qIdx, e.target.value)}
                >
                  <option value="MCQ">MCQ</option>
                  <option value="MSQ">MSQ</option>
                  <option value="Text">Text</option>
                </select>
              </div>
              
              {/* Explanation field */}
              <div className="mb-2">
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Explanation (optional)"
                  value={q.explanation || ''}
                  onChange={e => handleExplanationChange(qIdx, e.target.value)}
                  rows="2"
                />
              </div>
              {(q.type === 'MCQ' || q.type === 'MSQ') && (
                <div className="flex flex-col gap-2">
                  {q.answers.map((a, aIdx) => (
                    <div className="flex items-center gap-2" key={aIdx}>
                      <input
                        className="input input-bordered flex-1"
                        placeholder={`Answer ${aIdx + 1}`}
                        value={a}
                        onChange={e => handleAnswerChange(qIdx, aIdx, e.target.value)}
                      />
                      {q.type === 'MCQ' ? (
                        <input
                          type="radio"
                          name={`correct-${qIdx}`}
                          className="radio radio-primary"
                          checked={q.correct[0] === aIdx}
                          onChange={() => handleCorrectChange(qIdx, aIdx, true)}
                        />
                      ) : (
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={q.correct.includes(aIdx)}
                          onChange={e => handleCorrectChange(qIdx, aIdx, e.target.checked)}
                        />
                      )}
                      <button className="btn btn-xs btn-error" onClick={() => removeAnswer(qIdx, aIdx)} disabled={q.answers.length <= 2}>Remove</button>
                    </div>
                  ))}
                  <button className="btn btn-sm btn-outline mt-2" onClick={() => addAnswer(qIdx)}>Add Answer</button>
                </div>
              )}
              {q.type === 'Text' && (
                <input
                  className="input input-bordered w-full mt-2"
                  placeholder="Correct answer (optional)"
                  value={q.correct[0] || ''}
                  onChange={e => handleTextCorrectChange(qIdx, e.target.value)}
                />
              )}
            </div>
          </div>
        ))}
        <button className="btn btn-primary" onClick={addQuestion}>Add Question</button>
        
        {/* Quiz Actions */}
        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <h3 className="card-title">Quiz Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button 
                className="btn btn-info" 
                onClick={() => setQuizLink(`${window.location.origin}/quiz/${sessionId || quizId}`)}
              >
                Generate Quiz Link
              </button>
              {activeSession && (
                <button 
                  className="btn btn-outline"
                  onClick={() => window.open(quizLink, '_blank')}
                  disabled={!quizLink}
                >
                  Open Quiz (Student View)
                </button>
              )}
            </div>
            
            {quizLink && (
              <div className="mt-4 p-4 bg-base-300 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Quiz Link:</span>
                  <button 
                    className="btn btn-xs btn-outline"
                    onClick={() => navigator.clipboard.writeText(quizLink)}
                  >
                    Copy
                  </button>
                </div>
                <div className="text-sm break-all bg-base-100 p-2 rounded">
                  <a href={quizLink} className="link link-primary" target="_blank" rel="noopener noreferrer">
                    {quizLink}
                  </a>
                </div>
                {activeSession && (
                  <div className="text-sm text-success mt-2">
                    ✅ Students can now join using Session ID: <span className="font-mono font-bold">{sessionId}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageQuizPage;
