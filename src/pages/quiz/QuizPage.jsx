// quizup-client/src/pages/quiz/QuizPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession, joinSession, submitAnswer } from '../../utils/quizRuntimeApi';
import { getQuizById, getAllQuestions } from '../../utils/quizManageApi';
import { useMessage } from '../../contexts/MessageContext';
import { useAuth } from '../../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

function QuizPage() {
  const [quiz, setQuiz] = useState(null);
  const [session, setSession] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const { quizid } = useParams();
  const { showMessage } = useMessage();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuizData() {
      setLoading(true);
      try {
        console.log('Fetching session:', quizid);
        
        // Step 1: Get session info to get the quiz ID
        const sessionData = await getSession(quizid);
        console.log('Session response:', sessionData);
        
        if (!sessionData || !sessionData.quizId) {
          console.error('No session data or quiz ID found');
          showMessage('Quiz session not found or not active', 'error');
          return;
        }
        
        setSession(sessionData);
        console.log('Session loaded:', sessionData);
        
        // Step 2: Fetch quiz metadata and questions separately
        console.log('Fetching quiz metadata for quiz ID:', sessionData.quizId);
        const [quizData, questionsData] = await Promise.all([
          getQuizById(sessionData.quizId),
          getAllQuestions(sessionData.quizId)
        ]);
        
        console.log('Quiz metadata response:', quizData);
        console.log('Questions data response:', questionsData);
        console.log('Raw questions data structure:', questionsData); // Debug log
        
        // Handle different response structures for questions
        let questionsArray = [];
        if (Array.isArray(questionsData)) {
          questionsArray = questionsData;
        } else if (questionsData && Array.isArray(questionsData.questions)) {
          questionsArray = questionsData.questions;
        } else if (questionsData && questionsData.data && Array.isArray(questionsData.data)) {
          questionsArray = questionsData.data;
        }
        
        console.log('Processed questions array:', questionsArray); // Debug log
        
        if (questionsArray.length > 0) {
          // Map questions from backend format to frontend format
          const mappedQuestions = questionsArray.map(q => ({
            _id: q._id || q.id,
            text: q.text || q.question || '',
            type: q.type ? q.type.toLowerCase() : 'mcq',
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || ''
          }));
          
          setQuiz({
            _id: quizData._id,
            title: quizData.title,
            description: quizData.description,
            questions: mappedQuestions
          });
          
          console.log('Quiz loaded with questions:', mappedQuestions);
        } else {
          console.error('No questions found or invalid format, questionsArray:', questionsArray);
          showMessage('No questions found for this quiz', 'error');
        }
        
      } catch (err) {
        console.error("Failed to fetch quiz data:", err);
        showMessage('Failed to load quiz: ' + (err.response?.data?.message || err.message), 'error');
        setQuiz(null);
        setSession(null);
      }
      setLoading(false);
    }
    
    if (quizid) {
      fetchQuizData();
    }
  }, [quizid, showMessage]);


  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="loading loading-spinner loading-lg"></div>
      <p className="mt-4">Loading quiz...</p>
    </div>
  );

  if (!quiz) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-error text-xl mb-4">Quiz not available</div>
      <button className="btn btn-primary" onClick={() => navigate('/')}>
        Go Home
      </button>
    </div>
  );

  if (!quiz.questions || quiz.questions.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      <p className="text-base-content/70 mb-4">No questions in this quiz yet.</p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>
        Go Home
      </button>
    </div>
  );

  const q = quiz.questions[current];
  const questionId = q._id;

  const handleOptionChange = (qid, value, checked) => {
    setAnswers(prev => {
      if (q.type === 'msq') {
        const prevArr = Array.isArray(prev[qid]) ? prev[qid] : [];
        return { ...prev, [qid]: checked ? [...prevArr, value] : prevArr.filter(v => v !== value) };
      } else {
        return { ...prev, [qid]: value };
      }
    });
  };

  const handleTextChange = (qid, value) => setAnswers(prev => ({ ...prev, [qid]: value }));

  const handleJoin = async () => {
    if (!user) {
      showMessage('Authentication required', 'error');
      return;
    }
    
    const uid = uuidv4();
    setLoading(true);
    
    try {
      // Use authenticated user's data
      const userName = user.name || user.username || 'Unknown User';
      const userRoll = user.roll || user.id || user._id || uid;
      
      console.log('Joining session:', { sessionId: quizid, userId: uid, name: userName, roll: userRoll });
      await joinSession(quizid, uid, userName, userRoll);
      setUserId(uid);
      setJoined(true);
      showMessage('Successfully joined the quiz!', 'success');
      console.log('Successfully joined session');
    } catch (err) {
      console.error('Join failed:', err);
      showMessage('Failed to join session: ' + (err.response?.data?.message || err.message), 'error');
    }
    
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!joined) {
      showMessage('Please join the quiz first', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Submitting answers:', answers);
      console.log('Session ID:', quizid);
      console.log('User ID:', userId);
      
      // Submit answers for each question individually
      for (const question of quiz.questions) {
        const questionId = question._id;
        const answer = answers[questionId];
        
        if (answer !== undefined && answer !== null && answer !== '') {
          console.log(`Submitting answer for question ${questionId}:`, answer);
          
          try {
            await submitAnswer(quizid, userId, { 
              questionId: questionId, 
              answer: answer 
            });
            console.log(`Successfully submitted answer for question ${questionId}`);
          } catch (questionError) {
            console.error(`Failed to submit answer for question ${questionId}:`, questionError);
            // Continue with other questions even if one fails
          }
        } else {
          console.log(`Skipping question ${questionId} - no answer provided`);
        }
      }
      
      setSubmitted(true);
      showMessage('Quiz submitted successfully!', 'success');
      console.log('All answers submitted successfully');
      
      // Navigate to leaderboard after a short delay
      setTimeout(() => {
        navigate(`/leaderboard/${quizid}`);
      }, 2000);
      
    } catch (err) {
      console.error('Submit failed:', err);
      showMessage('Failed to submit answers: ' + (err.response?.data?.message || err.message), 'error');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-2 bg-base-100">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-2">{quiz.title}</h1>
        <p className="text-center text-base-content/70 mb-6">Session ID: {quizid}</p>

        {!joined && user && (
          <div className="card bg-base-200 shadow-xl max-w-md mx-auto mb-8">
            <div className="card-body">
              <h2 className="card-title justify-center mb-4">Join Quiz</h2>
              <div className="text-center mb-4">
                <div className="text-lg font-semibold">Welcome, {user.name || user.username}!</div>
                <div className="text-sm text-base-content/70 mt-1">
                  Ready to take the quiz?
                </div>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={handleJoin}
                disabled={loading}
              >
                {loading ? 'Joining...' : 'Join Quiz'}
              </button>
            </div>
          </div>
        )}

        {joined && (
          <div className="card bg-base-200 shadow-xl max-w-3xl mx-auto">
            <div className="card-body">
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-base-content/70">
                  Question {current + 1} of {quiz.questions.length}
                </div>
                <div className="text-sm text-base-content/70">
                  Welcome, {user?.name || user?.username || 'User'}!
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-base-300 rounded-full h-2 mb-6">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${((current + 1) / quiz.questions.length) * 100}%` }}
                ></div>
              </div>

              <form>
                <div className="mb-8">
                  <div className="text-lg font-semibold mb-4">{q.text}</div>

                  {q.type === 'mcq' && q.options && q.options.map((opt, idx) => (
                    <label key={idx} className="flex items-start gap-3 cursor-pointer mb-3 p-3 rounded-lg hover:bg-base-300 transition-colors">
                      <input 
                        type="radio" 
                        name={`q${questionId}`} 
                        className="radio radio-primary mt-1" 
                        checked={answers[questionId] === opt}
                        onChange={() => handleOptionChange(questionId, opt, true)}
                        disabled={loading}
                      />
                      <span className="flex-1">{opt}</span>
                    </label>
                  ))}

                  {q.type === 'msq' && q.options && q.options.map((opt, idx) => (
                    <label key={idx} className="flex items-start gap-3 cursor-pointer mb-3 p-3 rounded-lg hover:bg-base-300 transition-colors">
                      <input 
                        type="checkbox" 
                        className="checkbox checkbox-primary mt-1" 
                        checked={Array.isArray(answers[questionId]) && answers[questionId].includes(opt)}
                        onChange={e => handleOptionChange(questionId, opt, e.target.checked)}
                        disabled={loading}
                      />
                      <span className="flex-1">{opt}</span>
                    </label>
                  ))}

                  {q.type === 'text' && (
                    <textarea 
                      className="textarea textarea-bordered w-full min-h-24" 
                      placeholder="Type your answer here..."
                      value={answers[questionId] || ''} 
                      onChange={e => handleTextChange(questionId, e.target.value)}
                      disabled={loading}
                    />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={() => setCurrent(c => Math.max(0, c - 1))} 
                    disabled={current === 0 || loading}
                  >
                    Previous
                  </button>

                  {current < quiz.questions.length - 1 ? (
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      onClick={() => setCurrent(c => Math.min(c + 1, quiz.questions.length - 1))}
                      disabled={loading}
                    >
                      Next
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      className="btn btn-success"
                      onClick={handleSubmit}
                      disabled={loading || submitted}
                    >
                      {loading ? 'Submitting...' : submitted ? 'Submitted!' : 'Submit Quiz'}
                    </button>
                  )}
                </div>
              </form>

              {submitted && (
                <div className="alert alert-success mt-6">
                  <span>Quiz submitted successfully! Redirecting to leaderboard...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
