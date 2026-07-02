import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUser } from '../../../Redux/userActions';

// Helper function to generate random arithmetic expressions
const generateExpression = () => {
    const operators = ['+', '-', '*']; // Removed division ('/')
    const numOperands = Math.floor(Math.random() * 2) + 2; // Length of expression between 2 and 3
    let expression = `${Math.floor(Math.random() * 10) + 1}`;

    for (let i = 1; i < numOperands; i++) {
        let operator = operators[Math.floor(Math.random() * operators.length)];
        let operand = Math.floor(Math.random() * 10) + 1;

        expression = `${expression} ${operator} ${operand}`;
    }

    return expression;
};

// Function to evaluate expression safely (to handle invalid inputs)
const evaluateExpression = (expr) => {
    try {
        const result = eval(expr);
        return parseFloat(result.toFixed(2)); // Round the result to two decimal places
    } catch (e) {
        return null; // If there's an error in evaluation
    }
};

const MathPuzzle = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);
    const [notAttempted, setNotAttempted] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [accuracy, setAccuracy] = useState(0);
    const [metrics, setMetrics] = useState(null);
    const [userZScore, setUserZScore] = useState(null);
    const token = useSelector(state => state.user.token);

    const dispatch = useDispatch();

    // Generate 6 random questions
    useEffect(() => {
        let generatedQuestions = [];
        for (let i = 0; i < 6; i++) {
            const expr = generateExpression();
            const answer = evaluateExpression(expr);
            generatedQuestions.push({ question: expr, correctAnswer: answer });
        }
        setQuestions(generatedQuestions);
    }, []);

    const handleAnswerChange = (e, index) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = e.target.value;
        setAnswers(updatedAnswers);
    };

    const handleSubmit = () => {
        const currentQuestion = questions[currentIndex];
        const userAnswer = parseFloat(answers[currentIndex]);

        if (userAnswer === currentQuestion.correctAnswer) {
            setCorrectAnswers(correctAnswers + 1);
        } else if (userAnswer === undefined || userAnswer === null || isNaN(userAnswer)) {
            setNotAttempted(notAttempted + 1);
        } else {
            setIncorrectAnswers(incorrectAnswers + 1);
        }

        // Move to next question or complete the game
        if (currentIndex < 5) {
            setCurrentIndex(currentIndex + 1);
        } else {
            calculateAccuracy();
            setGameCompleted(true);
            sendPerformanceToBackend();
        }
    };

    const calculateAccuracy = () => {
        // Accuracy based on correct answers
        const accuracyPercentage = ((correctAnswers / 6) * 100).toFixed(2);
        setAccuracy(accuracyPercentage);
    };
    const user = useSelector((state) => state.user.user);

    const startNewGame = () => {
        setAnswers([]);
        setCorrectAnswers(0);
        setIncorrectAnswers(0);
        setNotAttempted(0);
        setAccuracy(0);
        setCurrentIndex(0);
        setGameCompleted(false);

        // Generate new questions
        let generatedQuestions = [];
        for (let i = 0; i < 6; i++) {
            const expr = generateExpression();
            const answer = evaluateExpression(expr);
            generatedQuestions.push({ question: expr, correctAnswer: answer });
        }
        setQuestions(generatedQuestions);
    };

    const sendPerformanceToBackend = async () => {
        const userDetails = {
            userScore: accuracy,
            correctAnswers,
            incorrectAnswers,
            notAttempted,
            userCategory: 'problemSolving',
            gameId: 8,
            sex: user.sex,
            age: user.age,
        };

        try {
            const response = await axios.post(
                `https://mind-c64g.onrender.com/api/cognitive-metrics`,
                { userDetails },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setMetrics(response.data.metrics);
                setUserZScore(response.data.userZScore);
                dispatch(setUser(response.data.user, token));
            }
        } catch (error) {
            console.error('Error sending performance data to backend:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100">
            <h1 className="text-3xl font-bold mb-6">Math Puzzle Game</h1>

            {!gameCompleted ? (
                <>
                    <div className="mb-4 text-lg font-semibold">
                        <p>Question {currentIndex + 1}: {questions[currentIndex]?.question}</p>
                    </div>
                    
                    <input
                        type="number"
                        placeholder="Your Answer"
                        value={answers[currentIndex] || ''}
                        onChange={(e) => handleAnswerChange(e, currentIndex)}
                        className="border-2 border-gray-500 px-4 py-2 rounded mb-4"
                    />
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </>
            ) : (
                <div className="mt-4 text-center">
                    <p className="text-lg font-semibold">Game Completed!</p>
                    <p className="text-lg font-semibold">Correct Answers: {correctAnswers}</p>
                    <p className="text-lg font-semibold">Incorrect Answers: {incorrectAnswers}</p>
                    <p className="text-lg font-semibold">Not Attempted: {notAttempted}</p>
                    <p className="text-lg font-semibold">Accuracy: {accuracy}%</p>
                    <button className="bg-green-600 text-white px-4 py-2 rounded shadow mt-4" onClick={startNewGame}>
                        Start New Game
                    </button>
                    {metrics && (
                        <div className="mt-6 bg-gray-100 p-4 rounded shadow text-black">
                            <h2 className="text-lg font-semibold mb-2">Backend Metrics</h2>
                            <p>Mean Accuracy: {metrics.meanAccuracy}</p>
                            <p>Standard Deviation (Accuracy): {metrics.avgZScoreAccuracy}</p>
                            <p>User Z-Score: {userZScore}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MathPuzzle;