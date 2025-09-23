import React from 'react';

function QuizHistoryPage() {
  // Example data (replace with real data from backend or context)
  const attemptedQuizzes = [
    { id: 1, title: 'General Knowledge', score: 8, total: 10, date: '2025-09-01' },
    { id: 2, title: 'Science Basics', score: 6, total: 10, date: '2025-08-20' },
    { id: 3, title: 'History', score: 7, total: 10, date: '2025-08-10' },
    { id: 4, title: 'Geography', score: 9, total: 10, date: '2025-07-30' },
  ];
  const organizedQuizzes = [
    { id: 1, title: 'React Mastery', participants: 12, date: '2025-09-10' },
    { id: 2, title: 'Math Quiz', participants: 8, date: '2025-08-15' },
    { id: 3, title: 'Science Bowl', participants: 15, date: '2025-07-25' },
    { id: 4, title: 'History Challenge', participants: 10, date: '2025-07-05' },
  ];
  return (
    <div className="py-8 px-2 w-full">
      <h1 className="text-2xl font-bold mb-6">Quiz History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Attempted Quizzes */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Attempted Quizzes</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {attemptedQuizzes.map(q => (
                  <tr key={q.id}>
                    <td>{q.title}</td>
                    <td>{q.score} / {q.total}</td>
                    <td>{q.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Organized Quizzes */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Organized Quizzes</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Participants</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {organizedQuizzes.map(q => (
                  <tr key={q.id}>
                    <td>{q.title}</td>
                    <td>{q.participants}</td>
                    <td>{q.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizHistoryPage;
