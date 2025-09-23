import React, { useState } from 'react';

function OrganizeQuizPage() {
  const [questions, setQuestions] = useState([
    { question: '', type: 'MCQ', answers: ['', ''], correct: [0] }
  ]);
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
  const addQuestion = () => {
    setQuestions([...questions, { question: '', type: 'MCQ', answers: ['', ''], correct: [0] }]);
  };
  const removeQuestion = (idx) => {
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
  const saveQuiz = () => {
    // Simulate save
    alert('Quiz saved!');
  };
  const generateLink = () => {
    setQuizLink('https://quizup.com/quiz/12345');
  };
  const startQuiz = () => {
    setQuizStarted(true);
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center py-8 px-2">
      <h1 className="text-2xl font-bold mb-4">Organize & Manage Quiz</h1>
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
