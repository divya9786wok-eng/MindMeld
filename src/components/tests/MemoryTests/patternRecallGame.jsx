import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUser } from '../../../Redux/userActions';

const PatternRecallGame = () => {
  const [tiles, setTiles] = useState(Array(9).fill(false));
  const [pattern, setPattern] = useState([]);
  const [playerPattern, setPlayerPattern] = useState([]);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [userZScore, setUserZScore] = useState(null);

  const token = useSelector(state => state.user.token);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const generatePattern = () => {
    const newPattern = [];
    for (let i = 0; i < 5; i++) {
      newPattern.push(Math.floor(Math.random() * 9));
    }
    setPattern(newPattern);
  };

  const showPattern = async () => {
    setIsShowingPattern(true);
    for (const tileIndex of pattern) {
      setTiles(prev => {
        const newTiles = [...prev];
        newTiles[tileIndex] = true;
        return newTiles;
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      setTiles(prev => {
        const newTiles = [...prev];
        newTiles[tileIndex] = false;
        return newTiles;
      });
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    setIsShowingPattern(false);
  };

  const handleTileClick = (index) => {
    if (isShowingPattern || gameOver) return;

    const newPlayerPattern = [...playerPattern, index];
    setPlayerPattern(newPlayerPattern);

    if (newPlayerPattern[newPlayerPattern.length - 1] !== pattern[newPlayerPattern.length - 1]) {
      setGameOver(true);
      sendPerformanceToBackend(score);
      dispatch({ type: 'GAME_OVER', payload: { score } });
      return;
    }

    if (newPlayerPattern.length === pattern.length) {
      setScore(score + 1);
      setPlayerPattern([]);
      generatePattern();
    }
  };

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setPlayerPattern([]);
    generatePattern();
  };

  useEffect(() => {
    if (pattern.length > 0 && !isShowingPattern) {
      showPattern();
    }
  }, [pattern]);

  const sendPerformanceToBackend = async (score) => {
    const userDetails = {
      userScore: score,
      userCategory: 'memory', 
      gameId: 7,
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
        dispatch(setUser(response.data.user,token));
      }
    } catch (error) {
      console.error('Error sending performance data to backend:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 text-white font-sans">
      <h1 className="text-4xl font-bold mb-8">Pattern Recall Game</h1>
      <p className="text-xl font-medium mb-6">Score: <span className="text-yellow-400">{score}</span></p>
      <div className="grid grid-cols-3 gap-4">
        {tiles.map((highlighted, index) => (
          <div
            key={index}
            onClick={() => handleTileClick(index)}
            className={`w-24 h-24 rounded-md flex items-center justify-center transition-all duration-300 
            ${highlighted ? 'bg-red-500' : 'bg-gray-300'} 
            ${!isShowingPattern && !gameOver ? 'hover:bg-gray-400 cursor-pointer' : ''}`}
          />
        ))}
      </div>
      {gameOver && (
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold mb-4">Game Over! Your final score is <span className="text-yellow-400">{score}</span>.</p>
          <button
            onClick={startGame}
            className="px-6 py-2 bg-green-500 text-white font-medium rounded-md shadow-md hover:bg-green-600 transition-all duration-300"
          >
            Play Again
          </button>
        </div>
      )}
      {!gameOver && pattern.length === 0 && (
        <button
          onClick={startGame}
          className="mt-6 px-6 py-2 bg-green-500 text-white font-medium rounded-md shadow-md hover:bg-green-600 transition-all duration-300"
        >
          Start Game
        </button>
      )}
      {metrics && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow text-black">
          <h2 className="text-lg font-semibold mb-2">Backend Metrics</h2>
          <p>Mean Accuracy: {metrics.meanAccuracy}</p>
          <p>Standard Deviation (Accuracy): {metrics.avgZScoreAccuracy}</p>
          <p>User Z-Score: {userZScore}</p>
        </div>
      )}
    </div>
  );
};

export default PatternRecallGame;