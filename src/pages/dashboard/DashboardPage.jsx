import Sidebar from './components/Sidebar';
import { Outlet, Link } from 'react-router-dom';


function DashboardHome() {
  // Example user data (replace with real data from backend or context)
  const name = 'John Doe';
  const email = 'john@example.com';
  // Example quiz data
  const attemptedQuizzes = [
    { id: 1, title: 'General Knowledge', score: 8, total: 10, date: '2025-09-01' },
    { id: 2, title: 'Science Basics', score: 6, total: 10, date: '2025-08-20' },
  ];
  const organizedQuizzes = [
    { id: 1, title: 'React Mastery', participants: 12, date: '2025-09-10' },
    { id: 2, title: 'Math Quiz', participants: 8, date: '2025-08-15' },
  ];
  // Only show the 2 most recent quizzes
  const recentAttempted = attemptedQuizzes.slice(0, 2);
  const recentOrganized = organizedQuizzes.slice(0, 2);
  return (
    <div className="flex flex-col items-center py-8 px-2 w-full">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="mb-2 text-base-content/70">Welcome to your dashboard.</p>
      <p className="mb-6 text-base-content">Hello, <span className="font-semibold">{name}</span>! Hope you're having a great day.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* Profile Card */}
        <div className="card bg-base-200 shadow-xl md:col-span-1">
          <div className="card-body">
            <h2 className="card-title mb-2">Profile</h2>
            <div className="flex flex-col gap-2">
              <div><span className="font-semibold">Name:</span> {name}</div>
              <div><span className="font-semibold">Email:</span> {email}</div>
            </div>
            <Link to="/dashboard/settings" className="btn btn-outline btn-primary mt-4 w-full">Edit Profile</Link>
          </div>
        </div>
        {/* Recent Attempted Quiz History */}
        <div className="card bg-base-200 shadow-xl md:col-span-1">
          <div className="card-body">
            <h2 className="card-title mb-2">Attempted Quizzes</h2>
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
                  {recentAttempted.map(q => (
                    <tr key={q.id}>
                      <td>{q.title}</td>
                      <td>{q.score} / {q.total}</td>
                      <td>{q.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link to="/dashboard/quiz-history" className="btn btn-link mt-2 px-0">View all</Link>
          </div>
        </div>
        {/* Recent Organized Quiz History */}
        <div className="card bg-base-200 shadow-xl md:col-span-1">
          <div className="card-body">
            <h2 className="card-title mb-2">Organized Quizzes</h2>
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
                  {recentOrganized.map(q => (
                    <tr key={q.id}>
                      <td>{q.title}</td>
                      <td>{q.participants}</td>
                      <td>{q.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
