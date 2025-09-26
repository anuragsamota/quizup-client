import Sidebar from './components/Sidebar';
import { Outlet, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserHistory, fetchOrganizedQuizzes } from '../../utils/userApi';


function DashboardHome() {
  const { user, token } = useAuth();
  const [history, setHistory] = useState([]);
  const [organized, setOrganized] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!token || !user) return;
      setLoading(true);
      try {
        const [historyData, organizedData] = await Promise.all([
          fetchUserHistory(token),
          fetchOrganizedQuizzes(token)
        ]);
        setHistory(historyData);
        setOrganized(organizedData);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    loadData();
  }, [user, token]);

  if (loading) return <div className="flex justify-center items-center h-40">Loading dashboard...</div>;
  if (error) return <div className="text-error">{error}</div>;
  if (!user) return <div className="flex justify-center items-center h-40">No user data available...</div>;

  // Show up to 2 most recent attempted quizzes
  const recentAttempted = (history || []).slice(-2).reverse();
  // Show up to 2 most recent organized quizzes
  const recentOrganized = (organized || []).slice(-2).reverse();

  return (
    <div className="flex flex-col items-center py-8 px-2 w-full">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="mb-2 text-base-content/70">Welcome to your dashboard.</p>
      <p className="mb-6 text-base-content">Hello, <span className="font-semibold">{user.name || user.username}</span>! Hope you're having a great day.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* Profile Card */}
        <div className="card bg-base-200 shadow-xl md:col-span-1">
          <div className="card-body">
            <h2 className="card-title mb-2">Profile</h2>
            <div className="flex flex-col gap-2">
              <div><span className="font-semibold">Name:</span> {user.name}</div>
              <div><span className="font-semibold">Username:</span> {user.username}</div>
              <div><span className="font-semibold">Email:</span> {user.email}</div>
              {user.avatar && (
                <img src={user.avatar} alt="avatar" className="w-16 h-16 rounded-full mt-2" />
              )}
            </div>
            <Link to="/dashboard/settings" className="btn btn-outline btn-primary mt-4 w-full">Edit Profile</Link>
          </div>
        </div>
        {/* Recent Attempted Quiz History */}
        <div className="card bg-base-200 shadow-xl md:col-span-1">
          <div className="card-body">
            <h2 className="card-title mb-2">Attempted Quizzes</h2>
            {recentAttempted.length === 0 ? (
              <div className="text-base-content/70">No quiz attempts yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Quiz</th>
                      <th>Score</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAttempted.map((q, i) => (
                      <tr key={i}>
                        <td>{q.quizId?.title || q.quizId || 'Quiz'}</td>
                        <td>{q.score}</td>
                        <td>{q.takenAt ? new Date(q.takenAt).toLocaleDateString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Link to="/dashboard/quiz-history" className="btn btn-link mt-2 px-0">View all</Link>
          </div>
        </div>
        {/* Recent Organized Quiz History */}
        <div className="card bg-base-200 shadow-xl md:col-span-1">
          <div className="card-body">
            <h2 className="card-title mb-2">Organized Quizzes</h2>
            {recentOrganized.length === 0 ? (
              <div className="text-base-content/70">No organized quizzes yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrganized.map((q, i) => (
                      <tr key={q._id || i}>
                        <td>{q.title}</td>
                        <td>{q.createdAt ? new Date(q.createdAt).toLocaleDateString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Link to="/dashboard/quiz-history" className="btn btn-link mt-2 px-0">View all</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="min-h-screen bg-base-100 flex">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen w-full transition-all duration-200 justify-center">
        <div className="flex-1 flex flex-col items-center justify-start w-full px-2 py-4">
          <div className="w-full max-w-6xl mx-auto">
            {/* Nested routes render here */}
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
export { DashboardHome };
