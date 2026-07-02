import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../Redux/userActions";

const StroopTest = () => {
  const [currentWord, setCurrentWord] = useState({});
  const [options, setOptions] = useState([]);
  const [results, setResults] = useState([]);
  const [startTime, setStartTime] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [testStarted, setTestStarted] = useState(false); // Tracks whether the test has started
  const [metrics, setMetrics] = useState(null);
  const [userZScore, setUserZScore] = useState(null);

  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const words = ["Red", "Blue", "Green", "Yellow"];
  const colors = ["red", "blue", "green", "yellow"];

  const generateWord = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    let color = colors[Math.floor(Math.random() * colors.length)];
    while (color === word.toLowerCase()) {
      color = colors[Math.floor(Math.random() * colors.length)];
    }
    return { word, color };
  };

  const startTest = () => {
    setResults([]);
    setTestComplete(false);
    setTestStarted(true); // Set test as started
    nextTrial();
  };

  const nextTrial = () => {
    if (results.length >= 10) {
      setTestComplete(true);
      return;
    }
    const newWord = generateWord();
    setCurrentWord(newWord);
    setOptions([...colors.sort(() => Math.random() - 0.5)]);
    setStartTime(Date.now());
  };

  const handleResponse = (color) => {
    const reactionTime = Date.now() - startTime;
    const isCorrect = color === currentWord.color;
    setResults((prevResults) => [
      ...prevResults,
      {
        word: currentWord.word,
        color: currentWord.color,
        response: color,
        isCorrect,
        reactionTime,
      },
    ]);
    nextTrial();
  };

  const analyzeResults = () => {
    const total = results.length;
    const correct = results.filter((result) => result.isCorrect).length;
    const accuracy = ((correct / total) * 100).toFixed(2);
    const averageTime = (
      results.reduce((sum, result) => sum + result.reactionTime, 0) / total
    ).toFixed(2);
    return { accuracy, averageTime };
  };

  const sendResultsToBackend = async () => {
    const { accuracy, averageTime } = analyzeResults();

    const userDetails = {
      sex: user.sex,
      age: user.age,
      userScore: accuracy,
      reactionTimes: results.map((result) => result.reactionTime),
      gameId: 4,
      userCategory: "attention",
    };

    try {
      const response = await axios.post(
        `https://mind-c64g.onrender.com/api/cognitive-metrics`,
        { userDetails },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setMetrics(response.data.metrics);
        dispatch(setUser(response.data.user,token));

        setUserZScore(response.data.userZScore);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Stroop Test</h1>

      {!testStarted ? (
        <button
          onClick={startTest}
          className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2"
        >
          Start Test
        </button>
      ) : !testComplete ? (
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700 text-center mb-4">
            Click on the color of the text, not the word itself!
          </p>
          {currentWord.word && (
            <div className="text-center mb-6">
              <h2
                className="text-4xl font-bold mb-4"
                style={{ color: currentWord.color }}
              >
                {currentWord.word}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {options.map((color) => (
                  <button
                    key={color}
                    className={`px-4 py-2 rounded-lg text-white font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      color === "red"
                        ? "bg-red-500 hover:bg-red-600 focus:ring-red-300"
                        : color === "blue"
                        ? "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300"
                        : color === "green"
                        ? "bg-green-500 hover:bg-green-600 focus:ring-green-300"
                        : "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-300"
                    }`}
                    onClick={() => handleResponse(color)}
                  >
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Results</h2>
          <p className="text-gray-700 mb-2">
            Accuracy:{" "}
            <span className="font-semibold">{analyzeResults().accuracy}%</span>
          </p>
          <p className="text-gray-700 mb-4">
            Average Reaction Time:{" "}
            <span className="font-semibold">
              {analyzeResults().averageTime} ms
            </span>
          </p>

          {metrics && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Backend Metrics</h3>
              <p>Mean Accuracy: {metrics.meanAccuracy}</p>
              <p>Standard Deviation: {metrics.stdAccuracy}</p>
              <p>User Z-Score: {userZScore}</p>
            </div>
          )}

          <button
            onClick={startTest}
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
          >
            Retry Test
          </button>
        </div>
      )}
    </div>
  );
};

export default StroopTest;
