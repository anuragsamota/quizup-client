import React from "react";
import { useParams } from "react-router-dom";



function AttemptedQuizDetailsPage() {
  const { quizid } = useParams();
  // Dummy data for quiz attempt details with MCQ, MSQ, Text
  const quizTitle = 'General Knowledge';
  const questions = [
    {
      id: 1,
      type: 'mcq',
      question: 'What is the capital of France?',
      options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
      userAnswer: 'Paris',
      correctAnswer: 'Paris',
      isCorrect: true,
    },
    {
      id: 2,
      type: 'msq',
      question: 'Select all prime numbers.',
      options: ['2', '3', '4', '6'],
      userAnswer: ['2', '3', '4'],
      correctAnswer: ['2', '3'],
      isCorrect: false,
    },
    {
      id: 3,
      type: 'text',
      question: 'Who wrote Hamlet?',
      userAnswer: 'Shakespeare',
      correctAnswer: 'Shakespeare',
      isCorrect: true,
    },
  ];
  const score = questions.filter(q => q.isCorrect).length;

  // Helper to render answers for MCQ, MSQ, Text
  const renderAnswer = (q, answer) => {
    if (q.type === 'msq') {
      if (!Array.isArray(answer)) return '-';
      return (
        <ul className="list-disc list-inside">
          {answer.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      );
    }
    return answer || '-';
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-2">Quiz Attempt Details</h1>
      <div className="mb-2 text-base-content/70">Quiz ID: <span className="font-mono">{quizid}</span></div>
      <div className="mb-4 text-base-content/70">Quiz Title: <span className="font-semibold">{quizTitle}</span></div>
      <div className="mb-6 text-base-content/70">Score: <span className="font-bold">{score} / {questions.length}</span></div>
      <div className="bg-base-200 rounded-box p-6 shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Question</th>
              <th>Type</th>
              <th>Your Answer</th>
              <th>Correct Answer</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(q => (
              <tr key={q.id}>
                <td>{q.question}</td>
                <td className="uppercase">{q.type}</td>
                <td>{renderAnswer(q, q.userAnswer)}</td>
                <td>{renderAnswer(q, q.correctAnswer)}</td>
                <td>
                  {q.isCorrect ? (
                    <span className="badge badge-success">Correct</span>
                  ) : (
                    <span className="badge badge-error">Incorrect</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttemptedQuizDetailsPage;
