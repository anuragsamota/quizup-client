import { useState } from 'react';
import { createQuiz, createQuestion, updateQuestion, deleteQuestion, updateQuiz } from '../../../utils/quizManageApi';
import { useMessage } from '../../../contexts/MessageContext';

function OrganizeQuizPage() {
  const { showMessage } = useMessage();
  // Each question: { id?, question, type, answers, correct }
  const [questions, setQuestions] = useState([
    { question: '', type: 'MCQ', answers: ['', ''], correct: [0] }
  ]);
  const [quizId, setQuizId] = useState(null); // Track quizId after creation
  const [quizTitle, setQuizTitle] = useState('');
  const [deletedQuestionIds, setDeletedQuestionIds] = useState([]); // Track deleted question ids for backend
  const [quizLink, setQuizLink] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [joinedUsers, setJoinedUsers] = useState([
    // Example users
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]);

  const handleQuestionChange = (idx, value) => {
    const updated = [...questions];
    updated[idx].question = value;
    setQuestions(updated);
  };
  const handleTypeChange = (idx, value) => {
    const updated = [...questions];
    updated[idx].type = value;
    // Reset answers/correct for type
    if (value === 'Text') {
      updated[idx].answers = [];
      updated[idx].correct = [''];
    } else {
      updated[idx].answers = ['', ''];
      updated[idx].correct = value === 'MSQ' ? [] : [0];
    }
    setQuestions(updated);
  };
  const handleAnswerChange = (qIdx, aIdx, value) => {
    const updated = [...questions];
    updated[qIdx].answers[aIdx] = value;
    setQuestions(updated);
  };
  // For MCQ: correct is [idx], for MSQ: correct is array of idxs, for Text: correct is [string]
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
  const addQuestion = async () => {
    const newQ = { question: '', type: 'MCQ', answers: ['', ''], correct: [0] };
    if (quizId) {
      try {
        // Only send required fields for MCQ
        const payload = {
          type: 'mcq',
          question: '',
          options: ['', ''],
          answer: '' // backend may require empty string for MCQ
        };
        const res = await createQuestion(quizId, payload);
        setQuestions([...questions, { ...newQ, id: res.id || res._id || res.questionId }]);
      } catch (err) {
        showMessage('Failed to add question: ' + err.message, 'error');
      }
    } else {
      setQuestions([...questions, newQ]);
    }
  };
  const removeQuestion = (idx) => {
    const q = questions[idx];
    if (q.id) setDeletedQuestionIds(ids => [...ids, q.id]);
    setQuestions(questions.filter((_, i) => i !== idx));
  };
  const addAnswer = (qIdx) => {
    const updated = [...questions];
    updated[qIdx].answers.push('');
    setQuestions(updated);
  };
  const removeAnswer = (qIdx, aIdx) => {
    const updated = [...questions];
    updated[qIdx].answers.splice(aIdx, 1);
    // Remove from correct if needed
    if (updated[qIdx].type === 'MCQ' || updated[qIdx].type === 'MSQ') {
      updated[qIdx].correct = updated[qIdx].correct.filter(i => i !== aIdx).map(i => (i > aIdx ? i - 1 : i));
    }
    setQuestions(updated);
  };
  // Save quiz and sync all questions with backend
  const saveQuiz = async () => {
    try {
      let qid = quizId;
      // 1. Create quiz if not exists
      if (!qid) {
        const quizRes = await createQuiz({ title: quizTitle || 'Untitled Quiz', questions: [] });
        qid = quizRes.id || quizRes._id || quizRes.quizId;
        if (!qid) throw new Error('Quiz creation failed: No quiz ID returned');
        setQuizId(qid);
      } else {
        // Update quiz title if changed
        await updateQuiz(qid, { title: quizTitle || 'Untitled Quiz' });
      }
      if (!qid) throw new Error('Quiz ID is undefined. Cannot save questions.');
      // 2. Delete removed questions in backend
      for (const dqid of deletedQuestionIds) {
        await deleteQuestion(qid, dqid);
      }
      setDeletedQuestionIds([]);
      // 3. Create/update questions
      const updatedQuestions = [];
      for (const q of questions) {
        let payload = {
          type: q.type.toLowerCase(),
          question: q.question
        };
        if (q.type === 'MCQ') {
          payload.options = q.answers;
          payload.answer = q.answers[q.correct[0]] || '';
        } else if (q.type === 'MSQ') {
          payload.options = q.answers;
          payload.answer = q.correct.map(idx => q.answers[idx]);
        } else if (q.type === 'Text') {
          payload.answer = q.correct[0] || '';
        }
        if (q.id) {
          // Update existing
          const res = await updateQuestion(qid, q.id, payload);
          updatedQuestions.push({ ...q, id: res.id || res._id || res.questionId });
        } else {
          // Create new
          const res = await createQuestion(qid, payload);
          updatedQuestions.push({ ...q, id: res.id || res._id || res.questionId });
        }
      }
      setQuestions(updatedQuestions);
      setQuizId(qid); // Ensure quizId is set after save
      setQuizLink(`${window.location.origin}/quiz/${qid}`);
      showMessage('Quiz and questions saved successfully!', 'success');
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };
  // Generate quiz link by id
  const generateLink = () => {
    if (quizId) {
      setQuizLink(`${window.location.origin}/quiz/${quizId}`);
    } else {
      showMessage('Save the quiz first to generate a link.', 'info');
    }
  };
  const startQuiz = () => {
    setQuizStarted(true);
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center py-8 px-2">
      <h1 className="text-2xl font-bold mb-4">Organize & Manage Quiz</h1>
      {/* Quiz title input */}
      <div className="mb-4">
        <input
          className="input input-bordered w-full max-w-xl"
          placeholder="Quiz Title"
          value={quizTitle}
          onChange={e => setQuizTitle(e.target.value)}
        />
      </div>
      <div className="w-full max-w-3xl flex flex-col gap-6">
        {questions.map((q, qIdx) => (
          <div className="card bg-base-200 shadow-md" key={qIdx}>
            <div className="card-body">
              <div className="flex justify-between items-center mb-2">
                <h2 className="card-title">Question {qIdx + 1}</h2>
                <button className="btn btn-error btn-xs" onClick={() => removeQuestion(qIdx)} disabled={questions.length === 1}>Remove</button>
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
              {/* MCQ/MSQ answer UI */}
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
              {/* Text answer UI */}
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
        <div className="flex flex-wrap gap-4 mt-4">
          <button className="btn btn-success" onClick={saveQuiz}>Save Quiz</button>
    <button className="btn btn-info" onClick={generateLink}>Generate Quiz Link</button>
    {/* Placeholder for quiz list/selection UI */}
    {/* <button className="btn btn-outline" onClick={loadQuizList}>Load Existing Quizzes</button> */}
          <button className="btn btn-accent" onClick={startQuiz}>Start Quiz</button>
        </div>
        {quizLink && (
          <div className="alert alert-info mt-4">Quiz Link: <a href={quizLink} className="link link-primary ml-2" target="_blank" rel="noopener noreferrer">{quizLink}</a></div>
        )}
        {quizStarted && (
          <div className="card bg-base-200 shadow-md mt-4">
            <div className="card-body">
              <h2 className="card-title mb-2">Users Joined</h2>
              <ul className="list-disc ml-6">
                {joinedUsers.map(u => (
                  <li key={u.id}>{u.name}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrganizeQuizPage;
