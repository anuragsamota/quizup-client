import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchUserHistory} from '../../../utils/userApi';
import { getQuizzesByOrganizer } from '../../../utils/quizManageApi';

function QuizHistoryPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [attemptedQuizzes, setAttemptedQuizzes] = useState([]);
  const [organizedQuizzes, setOrganizedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orgLoading, setOrgLoading] = useState(true);
  const [orgError, setOrgError] = useState(null);

  useEffect(() => {
    async function loadHistory() {
      if (!token) return;
      setLoading(true);
      try {
        const data = await fetchUserHistory(token);
        setAttemptedQuizzes(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    loadHistory();
  }, [token]);

  useEffect(() => {
    async function loadOrganized() {
      if (!token) return;
      setOrgLoading(true);
      try {
        const data = await getQuizzesByOrganizer(token);
        setOrganizedQuizzes(data);
        setOrgError(null);
      } catch (err) {
        setOrgError(err.message);
      }
      setOrgLoading(false);
    }
    loadOrganized();
  }, [token]);

  return (
    <div className="py-8 px-2 w-full">
      <h1 className="text-2xl font-bold mb-6">Quiz History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Attempted Quizzes */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Attempted Quizzes</h2>
          {loading ? (
            <div className="text-base-content/70">Loading...</div>
          ) : error ? (
            <div className="text-error">{error}</div>
          ) : attemptedQuizzes.length === 0 ? (
            <div className="text-base-content/70">No quiz attempts yet.</div>
          ) : (
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
                  {attemptedQuizzes.map((q, i) => (
                    <tr
                      key={q._id || i}
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => navigate(`/dashboard/quiz-history/attempted/${q.quizId?._id || q.quizId || ''}`)}
                    >
                      <td className="text-primary underline">{q.quizId?.title || q.quizId || 'Quiz'}</td>
                      <td>{q.score}</td>
                      <td>{q.takenAt ? new Date(q.takenAt).toLocaleDateString() : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Organized Quizzes */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Organized Quizzes</h2>
          {orgLoading ? (
            <div className="text-base-content/70">Loading...</div>
          ) : orgError ? (
            <div className="text-error">{orgError}</div>
          ) : organizedQuizzes.length === 0 ? (
            <div className="text-base-content/70">No organized quizzes yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date Created</th>
                  </tr>
                </thead>
                <tbody>
                  {organizedQuizzes.map((q, i) => (
                    <tr
                      key={q._id || i}
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => navigate(`/dashboard/quiz-history/organized/${q._id || q.id || ''}`)}
                    >
                      <td className="text-primary underline">{q.title}</td>
                      <td>{q.createdAt ? new Date(q.createdAt).toLocaleDateString() : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizHistoryPage;
