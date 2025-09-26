import { useMessage } from "../../contexts/MessageContext";
import { useNavigate } from "react-router-dom";


function JoinQuizPage() {
  const { showMessage } = useMessage();
  const navigate = useNavigate();
  

  const handleJoinQuiz = (e) => {
    e.preventDefault();
    const quizCode = e.target.quizCode.value;
    if (quizCode || quizCode !=="" || quizCode ===null || quizCode===undefined )  {
      navigate(`/quiz/${quizCode}`);
    }else{
      showMessage("Please enter a valid quiz code", "error", 10000);
    }
    // Logic to join the quiz using the quizCode
    showMessage(`Joining quiz with code: ${quizCode}`, "success", 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Join a Quiz</h1>
      <p className="mb-6 text-base-content/70">Enter a quiz code to get started.</p>
      <form onSubmit={handleJoinQuiz} className="flex gap-4">
        <input
          type="text"
          name="quizCode"
          placeholder="Enter quiz code"
          className="input input-bordered w-full max-w-xs"
          required
        />
        <button type="submit" className="btn btn-primary">Join Quiz</button>
      </form>
    </div>
  );
}

export default JoinQuizPage;
