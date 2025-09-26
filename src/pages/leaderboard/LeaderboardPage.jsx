
import { useParams } from 'react-router-dom';
import React from 'react';

// Example leaderboard data (replace with real fetch later)
const leaderboardData = [
  { rank: 1, name: 'You', score: 100, user: true },
  { rank: 2, name: 'Shubham Jindal', score: 95, user: false },
  { rank: 3, name: 'Abhishek Ghelot', score: 90, user: false },
  { rank: 4, name: 'Nikihil Soni', score: 80, user: false },
];

function LeaderboardPage() {
  const { quizid } = useParams();

  // TODO: Fetch leaderboard for quizid

  return (
    <div className="flex flex-col items-center min-h-screen bg-base-100 py-10 px-2">
      <div className="w-full max-w-2xl bg-base-200 rounded-box shadow p-6">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <div className="mb-6 text-base-content/70">Quiz ID: <span className="font-mono">{quizid}</span></div>

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry) => (
                <tr key={entry.rank} className={entry.user ? 'bg-primary/20 font-bold' : ''}>
                  <td>{entry.rank}</td>
                  <td>{entry.name} {entry.user && <span className="badge badge-primary ml-2">You</span>}</td>
                  <td>{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
