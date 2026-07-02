import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../../Redux/userActions';

const levels = {
    easy: { grid: 2, cardCount: 4 },
    medium: { grid: 4, cardCount: 16 },
    hard: { grid: 6, cardCount: 36 },
};

const generateCards = (cardCount) => {
    const values = Array.from({ length: cardCount / 2 }, (_, i) => i + 1);
    const cardPairs = [...values, ...values];
    return shuffleArray(cardPairs.map((value, id) => ({ id, value })));
};

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

export default function MemoryCardFlipGame() {
    const [difficulty, setDifficulty] = useState(null);
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showCards, setShowCards] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [feedback, setFeedback] = useState("");

    const [metrics, setMetrics] = useState(null); // Backend metrics
    const [userZScore, setUserZScore] = useState(null); // User's Z-score

    const user = useSelector((state) => state.user.user);
    const token = useSelector((state) => state.user.token);
    const dispatch = useDispatch();

    const startGame = (level) => {
        setDifficulty(level);
        const { cardCount } = levels[level];
        setCards(generateCards(cardCount));
        setFlippedCards([]);
        setMatchedCards([]);
        setAttempts(0);
        setAccuracy(0);
        setShowCards(true);
        setIsPlaying(true);

        setTimeout(() => {
            setShowCards(false);
        }, 5000); // Show cards for 5 seconds
    };

    const handleCardClick = (index) => {
        if (flippedCards.length < 2 && !flippedCards.includes(index) && !matchedCards.includes(index)) {
            setFlippedCards([...flippedCards, index]);

            if (flippedCards.length === 1) {
                setAttempts(attempts + 1);
                const firstCardIndex = flippedCards[0];
                const secondCardIndex = index;

                if (cards[firstCardIndex].value === cards[secondCardIndex].value) {
                    setMatchedCards([...matchedCards, firstCardIndex, secondCardIndex]);
                }

                setTimeout(() => {
                    setFlippedCards([]);
                }, 10000);
            }
        }
    };

    useEffect(() => {
        if (attempts > 0) {
            const totalPairs = cards.length / 2;
            const correctPairs = matchedCards.length / 2;
            setAccuracy((correctPairs / attempts) * 100);
        }
    }, [attempts, matchedCards]);

    const gridSize = difficulty ? levels[difficulty].grid : 4;

    const sendPerformanceToBackend = async () => {
        const userDetails = {
            userScore: accuracy,
            gameId: 5,
            sex: user.sex,
            age: user.age,
            userCategory: "memory", // Example, replace with actual category if dynamic
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

                // Dispatch action to update user info after performance submission
                dispatch(setUser(response.data.user,token)); // Assuming the backend returns the updated user object
            }
        } catch (error) {
            console.error("Error sending performance to backend:", error);
        }
    };

    useEffect(() => {
        if (matchedCards.length === cards.length && isPlaying) {
            sendPerformanceToBackend();
            setFeedback("🎉 You matched all cards! Great job!");
        }
    }, [matchedCards]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-lg p-6 bg-white rounded shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Memory Card Flip Game</h1>

                {!isPlaying ? (
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">Choose a difficulty level to start:</p>
                        <div className="flex justify-around">
                            {Object.keys(levels).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => startGame(level)}
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                >
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <div
                            className={`grid gap-2`}
                            style={{
                                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                            }}
                        >
                            {cards.map((card, index) => (
                                <div
                                    key={index}
                                    className={`w-16 h-16 flex items-center justify-center rounded border ${
                                        showCards || flippedCards.includes(index) || matchedCards.includes(index)
                                            ? 'bg-white'
                                            : 'bg-gray-200 cursor-pointer'
                                    }`}
                                    onClick={() => handleCardClick(index)}
                                >
                                    {(showCards || flippedCards.includes(index) || matchedCards.includes(index)) && (
                                        <span className="text-xl font-bold">{card.value}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-gray-700">Attempts: {attempts}</p>
                            <p className="text-gray-700">Accuracy: {accuracy.toFixed(2)}%</p>
                            <p className="text-green-500 font-semibold">{feedback}</p>
                        </div>

                        {metrics && (
                            <div className="mt-6 bg-gray-100 p-4 rounded shadow">
                                <h2 className="text-lg font-semibold mb-2">Backend Metrics</h2>
                                <p>Mean Accuracy: {metrics.meanAccuracy}</p>
                                <p>Standard Deviation (Accuracy): {metrics.avgZScoreAccuracy}</p>
                                <p>User Z-Score: {userZScore}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
