// quizup-client/src/pages/quiz/QuizPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSession, joinSession, submitAnswer } from '../../utils/quizRuntimeApi';
import { v4 as uuidv4 } from 'uuid';

function QuizPage() {
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [joined, setJoined] = useState(false);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');
  const { quizid } = useParams();

  useEffect(() => {
  async function fetchQuiz() {
    try {
      const session = await getSession(quizid); // quizid is actually sessionId
      if (session && session.quiz) {
        setQuiz({
          title: session.quiz.title,
          questions: session.quiz.questions
        });
      } else {
        setQuiz(null);
      }
    } catch (err) {
      console.error("Failed to fetch quiz:", err);
      setQuiz(null);
    }
  }
  fetchQuiz();
}, [quizid]);


  if (!quiz) return <div>Loading...</div>;
  if (!quiz.questions || quiz.questions.length === 0) return (
    <div>
      <h1>{quiz.title}</h1>
      <p>No questions in this quiz yet.</p>
    </div>
  );

  const q = quiz.questions[current];

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
    if (!name.trim() || !roll.trim()) return alert('Enter name and roll number');
    const uid = uuidv4();
    try {
      await joinSession(quizid, uid, name, roll);
      setUserId(uid);
      setJoined(true);
    } catch (err) {
      console.error('Join failed', err);
      alert('Failed to join session: ' + (err.message || 'error'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!joined) return alert('Join the quiz first (enter name & roll)');
    try {
      for (const qn of quiz.questions) {
        const ans = answers[qn.id];
        await submitAnswer(quizid, userId, { questionId: qn.id, answer: ans });
      }
      setSubmitted(true);
      alert('Submitted! Thank you.');
    } catch (err) {
      console.error('Submit failed', err);
      alert('Failed to submit answers: ' + (err.message || 'error'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-2">
      <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
      <h4 className="font-semibold mb-3">Session ID: {quizid}</h4>

      {!joined && (
        <div className="card bg-base-200 shadow-md p-4 mb-4">
          <h2 className="font-semibold mb-2">Join Quiz</h2>
          <input className="input input-bordered mb-2" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          <input className="input input-bordered mb-2" placeholder="Roll number" value={roll} onChange={e => setRoll(e.target.value)} />
          <button className="btn btn-primary" onClick={handleJoin}>Join</button>
        </div>
      )}

      <div className="w-full max-w-xl bg-base-200 rounded-box shadow p-6">
        <div className="mb-6 text-base-content/70">Question {current + 1} of {quiz.questions.length}</div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="font-semibold mb-3">{q.text}</div>


            {q.type === 'mcq' && q.options.map((opt, idx) => (
              <label key={idx} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name={`q${q.id}`} className="radio radio-primary"
                  checked={answers[q.id] === opt}
                  onChange={() => handleOptionChange(q.id, opt, true)}
                  required />
                <span>{opt}</span>
              </label>
            ))}

            {q.type === 'msq' && q.options.map((opt, idx) => (
              <label key={idx} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="checkbox checkbox-primary"
                  checked={Array.isArray(answers[q.id]) && answers[q.id].includes(opt)}
                  onChange={e => handleOptionChange(q.id, opt, e.target.checked)} />
                <span>{opt}</span>
              </label>
            ))}

            {q.type === 'text' && (
              <input type="text" className="input input-bordered w-full" placeholder="Type your answer..."
                value={answers[q.id] || ''} onChange={e => handleTextChange(q.id, e.target.value)} required />
            )}
          </div>

          <div className="flex justify-between items-center mb-4">
            <button type="button" className="btn btn-outline" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>Previous</button>

            {current < quiz.questions.length - 1 ? (
              <button type="button" className="btn btn-primary" onClick={() => setCurrent(c => Math.min(c + 1, quiz.questions.length - 1))}
                disabled={!answers[q.id] || (q.type === 'msq' && (!answers[q.id] || answers[q.id].length === 0))}>Next</button>
            ) : (
              <button type="submit" className="btn btn-success"
                disabled={!answers[q.id] || (q.type === 'msq' && (!answers[q.id] || answers[q.id].length === 0))}>Submit</button>
            )}
          </div>
        </form>

        {submitted && (
          <div className="alert alert-success mt-4"><span>Quiz submitted! Thank you.</span></div>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
