import React, { useState, useEffect } from "react";
import moleImg from "../../../assets/mole.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"; // Import axios
import { setUser } from "../../../Redux/userActions";

const WhackAMoleTest = () => {
  const [grid, setGrid] = useState(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [iterations, setIterations] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [metrics, setMetrics] = useState(null); // For backend metrics
  const [userZScore, setUserZScore] = useState(null); // For user Z-Score
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const maxIterations = 20;
  const moleDisappearanceDelay = 1000;
  const dispatch = useDispatch();
  // Start mole game logic
  useEffect(() => {
    if (iterations >= maxIterations) {
      setTestComplete(true);
      return;
    }

    const moleIndex = Math.floor(Math.random() * 9);
    const newGrid = Array(9).fill(false);
    newGrid[moleIndex] = true;

    setGrid(newGrid);
    setStartTime(Date.now());

    const moleTimeout = setTimeout(() => {
      setGrid(Array(9).fill(false));
      setMisses((prevMisses) => prevMisses + 1);
      setIterations((prevIterations) => prevIterations + 1);
    }, moleDisappearanceDelay);

    return () => clearTimeout(moleTimeout);
  }, [iterations]);

  const handleClick = (index) => {
    if (testComplete) return;

    const currentTime = Date.now();
    if (grid[index]) {
      setScore(score + 1);
      setReactionTimes([...reactionTimes, currentTime - startTime]);
    } else {
      setMisses(misses + 1);
    }

    setGrid(Array(9).fill(false));
    setIterations(iterations + 1);
  };

  // Analyze results (average reaction time)
  const analyzeResults = () => {
    const total = reactionTimes.length;
    const averageTime =
      total > 0
        ? (reactionTimes.reduce((a, b) => a + b, 0) / total).toFixed(2)
        : 0;
    return { averageTime };
  };

  // Send user details to backend for analysis using axios
  const sendUserDetailsToBackend = async () => {
    const userDetails = {
      sex: user.sex, // Hardcoded as an example; update with actual data
      age: user.age, // Hardcoded as an example; update with actual data
      userScore: score,
      gameId: 1,
      userCategory: "attention",
    };

    try {
      const response = await axios.post(
        `https://mind-c64g.onrender.com/api/cognitive-metrics`,
        { userDetails },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Check if the response is successful
      if (response.status === 200) {
        const data = response.data;
        dispatch(setUser(response.data.user,token));
        setMetrics(data.metrics); // Store the backend metrics
        setUserZScore(data.userZScore); // Store the user's Z-Score
      } else {
        console.error("Error response:", response);
      }
    } catch (error) {
      console.error("Error sending user details:", error);
    }
  };

  useEffect(() => {
    if (testComplete) {
      sendUserDetailsToBackend();
    }
  }, [testComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Whack-A-Mole Test
      </h1>
      {!testComplete ? (
        <div className="grid grid-cols-3 gap-4">
          {grid.map((isMole, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`w-24 h-24 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isMole
                  ? "bg-green-500 focus:ring-green-300"
                  : "bg-gray-300 focus:ring-gray-200"
              } flex items-center justify-center`}
            >
              {isMole && <img src={moleImg} alt="Mole" className="w-16 h-16" />}
            </button>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Test Complete!
          </h2>
          <p className="text-gray-700 mb-2">
            Score: <span className="font-semibold">{score}</span>
          </p>
          <p className="text-gray-700 mb-2">
            Misses: <span className="font-semibold">{misses}</span>
          </p>
          <p className="text-gray-700 mb-4">
            Average Reaction Time:{" "}
            <span className="font-semibold">
              {analyzeResults().averageTime} ms
            </span>
          </p>

          {/* Display the backend metrics and user Z-Score */}
          {metrics && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Backend Metrics
              </h3>
              <p>
                Mean Accuracy:{" "}
                <span className="font-semibold">{metrics.meanAccuracy}</span>
              </p>
              <p>
                Standard Deviation (Accuracy):{" "}
                <span className="font-semibold">{metrics.stdAccuracy}</span>
              </p>
              <p>
                User Z-Score:{" "}
                <span className="font-semibold">{userZScore}</span>
              </p>
            </div>
          )}

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
          >
            Restart Test
          </button>
        </div>
      )}
    </div>
  );
};

export default WhackAMoleTest;
