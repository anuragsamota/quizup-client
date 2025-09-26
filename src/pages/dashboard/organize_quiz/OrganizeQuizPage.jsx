import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuiz, getQuizzesByOrganizer } from '../../../utils/quizManageApi';
import { useAuth } from '../../../contexts/AuthContext';
import { useMessage } from '../../../contexts/MessageContext';


function OrganizeQuizPage() {
  const { showMessage } = useMessage();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newQuizName, setNewQuizName] = useState("");
  const [creating, setCreating] = useState(false);

  const loadQuizzes = async () => {
    if (!user || !user.username) {
      setError("User information not available");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getQuizzesByOrganizer(user.username);
      setQuizzes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadQuizzes();
    // eslint-disable-next-line
  }, [token, user]);

  

  const handleCreateQuiz = async () => {
    if (!newQuizName.trim()) {
      showMessage("Quiz name cannot be empty", "error");
      return;
    }

    if (!user) {
      showMessage("You must be logged in to create a quiz", "error");
      return;
    }

    setCreating(true);
    try {
      const organizer = {
        id: user._id || user.id,
        username: user.username
      };

      const res = await createQuiz({
        title: newQuizName.trim(),
        questions: [],
        organizer: organizer
      });
      
      showMessage("Quiz created successfully!", "success");
      console.log("Created quiz:", res);
      setNewQuizName("");
      await loadQuizzes();
    } catch (err) {
      showMessage(err.message || "Failed to create quiz", "error");
    }
    setCreating(false);
  };


  // Always show create quiz input/button, even while loading

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center py-8 px-2">
      <h1 className="text-2xl font-bold mb-4">Organize Your Quizzes</h1>
      <div className="w-full max-w-xl flex flex-col md:flex-row gap-2 mb-8 items-center">
        <input
          className="input input-bordered flex-1"
          placeholder="Enter quiz name"
          value={newQuizName}
          onChange={e => setNewQuizName(e.target.value)}
          disabled={creating}
        />
        <button
          className="btn btn-success"
          onClick={handleCreateQuiz}
          disabled={creating}
        >
          {creating ? "Creating..." : "+ Create Quiz"}
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-4">Your Quizzes</h2>
      {error && <div className="text-error mb-4">{error}</div>}
      {loading ? (
        <div className="flex justify-center items-center h-40">Loading quizzes...</div>
      ) : quizzes.length === 0 ? (
        <div className="text-base-content/70">No quizzes found. Create a quiz above.</div>
      ) : (
        <div className="w-full max-w-2xl flex flex-col gap-4">
          {quizzes.map(qz => (
            <div className="card bg-base-200 shadow-md flex flex-row items-center justify-between px-4 py-3" key={qz._id}>
              <div>
                <div className="font-bold text-lg">{qz.title}</div>
                <div className="text-base-content/70 text-sm">{qz.description || ''}</div>
              </div>
              <button className="btn btn-primary" onClick={() => navigate(`/dashboard/organize-quiz/${qz._id}`)}>Manage</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrganizeQuizPage;
