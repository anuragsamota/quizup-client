
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

// Example quiz data (replace with real data/fetch later)
const sampleQuiz = {
    title: 'Sample Quiz',
    questions: [
        {
            id: 1,
            type: 'mcq',
            question: 'What is the capital of France?',
            options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        },
        {
            id: 2,
            type: 'msq',
            question: 'Select all prime numbers.',
            options: ['2', '3', '4', '6'],
        },
        {
            id: 3,
            type: 'text',
            question: 'Who wrote "Hamlet"?',
        },
    ],
};

function QuizPage() {
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const { quizid } = useParams();

    const q = sampleQuiz.questions[current];

    const handleOptionChange = (qid, value, checked) => {
        setAnswers(prev => {
            if (q.type === 'msq') {
                const prevArr = Array.isArray(prev[qid]) ? prev[qid] : [];
                return {
                    ...prev,
                    [qid]: checked
                        ? [...prevArr, value]
                        : prevArr.filter(v => v !== value),
                };
            } else {
                return { ...prev, [qid]: value };
            }
        });
    };

    const handleTextChange = (qid, value) => {
        setAnswers(prev => ({ ...prev, [qid]: value }));
    };

    const handleNext = () => setCurrent(c => Math.min(c + 1, sampleQuiz.questions.length - 1));
    const handlePrev = () => setCurrent(c => Math.max(c - 1, 0));

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // TODO: Send answers to backend
    };

    return (
        <div className="min-h-screen bg-base-100 flex flex-col items-center py-8 px-2">
            <h1 className="text-2xl font-bold mb-2">{sampleQuiz.title}</h1>
            <h4 className="font-semibold mb-3">Quiz ID: {quizid}</h4>
            <div className="w-full max-w-xl bg-base-200 rounded-box shadow p-6">

                <div className="mb-6 text-base-content/70">Question {current + 1} of {sampleQuiz.questions.length}</div>

                {/* Quiz Question */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <div className="font-semibold mb-3">{q.question}</div>
                        {q.type === 'mcq' && (
                            <div className="flex flex-col gap-2">
                                {q.options.map(opt => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`q${q.id}`}
                                            className="radio radio-primary"
                                            checked={answers[q.id] === opt}
                                            onChange={() => handleOptionChange(q.id, opt, true)}
                                            required
                                        />
                                        <span>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        {q.type === 'msq' && (
                            <div className="flex flex-col gap-2">
                                {q.options.map(opt => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name={`q${q.id}`}
                                            className="checkbox checkbox-primary"
                                            checked={Array.isArray(answers[q.id]) && answers[q.id].includes(opt)}
                                            onChange={e => handleOptionChange(q.id, opt, e.target.checked)}
                                        />
                                        <span>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        {q.type === 'text' && (
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={answers[q.id] || ''}
                                onChange={e => handleTextChange(q.id, e.target.value)}
                                placeholder="Type your answer..."
                                required
                            />
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mb-4">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={handlePrev}
                            disabled={current === 0}
                        >
                            Previous
                        </button>
                        {current < sampleQuiz.questions.length - 1 ? (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleNext}
                                disabled={!answers[q.id] || (q.type === 'msq' && (!answers[q.id] || answers[q.id].length === 0))}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={!answers[q.id] || (q.type === 'msq' && (!answers[q.id] || answers[q.id].length === 0))}
                            >
                                Submit
                            </button>
                        )}
                    </div>
                </form>

                {/* Submission Message */}
                {submitted && (
                    <div className="alert alert-success mt-4">
                        <span>Quiz submitted! (This is a placeholder message.)</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuizPage;
