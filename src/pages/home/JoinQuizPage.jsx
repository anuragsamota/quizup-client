import { useMessage } from "../../contexts/MessageContext";


function JoinQuizPage() {
  const { showMessage } = useMessage();

  const handleJoinQuiz = (e) => {
    e.preventDefault();
    const quizCode = e.target.quizCode.value;
    // Logic to join the quiz using the quizCode
    showMessage(`Joining quiz with code: ${quizCode}`, "success", 10000);
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
