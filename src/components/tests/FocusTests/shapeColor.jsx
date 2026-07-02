import React, { useState, useEffect, useCallback } from "react";
import { Square, Circle, Triangle } from "react-feather";
import axios from "axios"; // Axios for backend integration
import { useDispatch, useSelector } from "react-redux"; // For fetching user details
import { setUser } from "../../../Redux/userActions";

const ShapeComponent = ({ shape, color, onClick }) => {
  const ShapeIcon =
    shape === "square" ? Square : shape === "circle" ? Circle : Triangle;
  return (
    <button
      onClick={onClick}
      className="p-4 bg-opacity-80 hover:bg-opacity-100 transition duration-300 ease-in-out rounded-lg shadow-md flex items-center justify-center"
      style={{ backgroundColor: color }}
    >
      <ShapeIcon size={48} color="white" />
    </button>
  );
};

function ShapeColorMatchingTask() {
  const shapes = ["square", "circle", "triangle"];
  const colors = ["red", "blue", "green", "yellow"];
  const user = useSelector((state) => state.user.user); // Get user details

  const [gameState, setGameState] = useState("idle");
  const [shapeColors, setShapeColors] = useState([]);
  const [target, setTarget] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [score, setScore] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [testComplete, setTestComplete] = useState(false);
  const [metrics, setMetrics] = useState(null); // Backend metrics
  const [userZScore, setUserZScore] = useState(null); // User Z-Score

  const shuffleShapeColors = useCallback(() => {
    const shuffled = shapes
      .flatMap((shape) => colors.map((color) => ({ shape, color })))
      .sort(() => Math.random() - 0.5);
    setShapeColors(shuffled.slice(0, 6));
    const newTarget = shuffled[Math.floor(Math.random() * 6)];
    setTarget(newTarget);
  }, []);

  const startGame = useCallback(() => {
    setGameState("playing");
    setScore(0);
    setReactionTimes([]);
    shuffleShapeColors();
    setStartTime(Date.now());
    setFeedback("");
  }, [shuffleShapeColors]);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const handleShapeClick = useCallback(
    (clickedShape, clickedColor) => {
      if (gameState !== "playing" || !startTime || !target) return;

      const endTime = Date.now();
      const reactionTime = endTime - startTime;

      if (clickedShape === target.shape && clickedColor === target.color) {
        setScore((prevScore) => prevScore + 1);
        setFeedback(`✅ Correct! Reaction time: ${reactionTime}ms`);
        setReactionTimes((prevTimes) => [...prevTimes, reactionTime]);
      } else {
        setFeedback(`❌ Incorrect. Try again!`);
      }
      shuffleShapeColors();
      setStartTime(Date.now());
    },
    [gameState, startTime, target, shuffleShapeColors]
  );

  useEffect(() => {
    if (gameState === "playing") {
      const timer = setTimeout(() => {
        if (gameState === "playing") {
          setGameState("finished");
          setTestComplete(true);
          setFeedback("⏰ Time's up!");
        }
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const sendResultsToBackend = async () => {
    const userDetails = {
      sex: user.sex,
      age: user.age,
      userScore: score,
      reactionTimes,
      gameId: 3, // Unique ID for this task
      userCategory: "problemSolving",
    };

    try {
      const response = await axios.post(
        `https://mind-c64g.onrender.com/api/cognitive-metrics`,
        { userDetails },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setMetrics(response.data.metrics); // Store metrics from backend
        dispatch(setUser(response.data.user,token));
        setUserZScore(response.data.userZScore); // Store user Z-Score
      }
    } catch (error) {
      console.error("Error sending results to backend:", error);
    }
  };

  useEffect(() => {
    if (testComplete) {
      sendResultsToBackend();
    }
  }, [testComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-6">Shape-Color Matching Task</h1>
      <div className="game-content w-full max-w-xl bg-white rounded-lg shadow-lg p-6 text-center">
        {gameState === "idle" && (
          <div className="start-screen">
            <p className="text-lg font-medium text-gray-800 mb-4">
              Match the shape and color as quickly as you can!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all"
            >
              Start Game
            </button>
          </div>
        )}
        {gameState === "playing" && (
          <>
            <p className="target-prompt text-lg font-semibold text-gray-800 mb-4">
              Find the <span className="text-red-500">{target?.color}</span>{" "}
              <span className="capitalize">{target?.shape}</span>!
            </p>
            <div className="shape-grid grid grid-cols-3 gap-4">
              {shapeColors.map(({ shape, color }, index) => (
                <ShapeComponent
                  key={index}
                  shape={shape}
                  color={color}
                  onClick={() => handleShapeClick(shape, color)}
                />
              ))}
            </div>
          </>
        )}
        {gameState === "finished" && (
          <div className="end-screen">
            <p className="text-lg font-medium text-gray-800 my-4">Game Over!</p>
            <p className="text-2xl font-bold text-green-500 mb-4">
              Your final score: {score}
            </p>
            {metrics && (
              <div className="mt-4 text-black">
                <h3 className="text-xl font-semibold">Backend Metrics</h3>
                <p>
                  Mean Accuracy:{" "}
                  <span className="font-bold">{metrics.meanAccuracy}</span>
                </p>
                <p>
                  Mean Z Score:{" "}
                  <span className="font-bold">{metrics.avgZScoreAccuracy}</span>
                </p>
                <p>
                  User Z-Score: <span className="font-bold">{userZScore}</span>
                </p>
              </div>
            )}
            <button
              onClick={startGame}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      <div className="game-footer mt-6">
        <p className="text-lg font-semibold">Score: {score}</p>
        <p className="text-sm italic text-gray-200">{feedback}</p>
      </div>
    </div>
  );
}

export default ShapeColorMatchingTask;
