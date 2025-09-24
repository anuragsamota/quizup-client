import React from "react";
import { useParams } from "react-router-dom";


function OrganizedQuizDetailsPage() {
  const { quizid } = useParams();
  // Dummy data for organized quiz details
  const quizTitle = 'React Mastery';
  const date = '2025-09-10';
  const participants = [
    { name: 'Alice', score: 9 },
    { name: 'Bob', score: 7 },
    { name: 'Charlie', score: 8 },
    { name: 'You', score: 10 },
  ];

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-2">Organized Quiz Details</h1>
      <div className="mb-2 text-base-content/70">Quiz ID: <span className="font-mono">{quizid}</span></div>
      <div className="mb-2 text-base-content/70">Quiz Title: <span className="font-semibold">{quizTitle}</span></div>
      <div className="mb-4 text-base-content/70">Date: <span className="font-semibold">{date}</span></div>
      <div className="bg-base-200 rounded-box p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Participants & Scores</h2>
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p, idx) => (
              <tr key={idx} className={p.name === 'You' ? 'font-bold bg-primary/10' : ''}>
                <td>{p.name} {p.name === 'You' && <span className="badge badge-primary ml-2">You</span>}</td>
                <td>{p.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrganizedQuizDetailsPage;
