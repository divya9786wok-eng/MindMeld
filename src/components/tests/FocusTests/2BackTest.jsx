import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../Redux/userActions";

const TwoBackTest = () => {
  const [sequence, setSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responseTimes, setResponseTimes] = useState([]);
  const [correctResponses, setCorrectResponses] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [userResponses, setUserResponses] = useState([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [zScore, setZScore] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const dispatch=useDispatch()

  const sequenceLength = 10;

  const generateSequence = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from({ length: sequenceLength }, () =>
      letters.charAt(Math.floor(Math.random() * letters.length))
    );
  };

  const startTest = () => {
    setSequence(generateSequence());
    setCurrentIndex(0);
    setResponseTimes([]);
    setCorrectResponses(0);
    setUserResponses([]);
    setTestStarted(true);
    setTestCompleted(false);
  };

  const handleResponse = (isMatch) => {
    if (currentIndex < 2) return;

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    setResponseTimes((prev) => [...prev, responseTime]);

    const actualMatch = sequence[currentIndex] === sequence[currentIndex - 2];
    if (isMatch === actualMatch) {
      setCorrectResponses((prev) => prev + 1);
    }

    setUserResponses((prev) => [...prev, isMatch]);
  };

  useEffect(() => {
    if (!testStarted || currentIndex >= sequenceLength) return;

    const timer = setTimeout(() => {
      setStartTime(Date.now());
      setCurrentIndex((prev) => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, testStarted]);

  const calculateAccuracy = () => {
    return userResponses.length > 0
      ? ((correctResponses / userResponses.length) * 100).toFixed(2)
      : 0;
  };

  const handleTestCompletion = async () => {
    setTestCompleted(true);
    const accuracy = calculateAccuracy();
    const userScore = Number(accuracy);

    setLoading(true);

    try {
      const response = await axios.post(
        `https://mind-c64g.onrender.com/api/cognitive-metrics`,
        {
          userDetails: {
            sex: user.sex,
            age: user.age,
            userScore,
            gameId: 2,
      userCategory : 'memory'

          },
          
        },
        {    headers: { Authorization: `Bearer ${token}` },}
      );
      dispatch(setUser(response.data.user,token))

      setZScore(response.data.userZScore);
      setMetrics(response.data.metrics);
    } catch (error) {
      console.error("Error submitting test results:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">2-Back Cognitive Test</h1>
      {!testStarted ? (
        <div className="mb-6">
          <button
            onClick={startTest}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Start Test
          </button>
        </div>
      ) : currentIndex < sequenceLength ? (
        <div className="text-center">
          <p className="text-5xl font-mono mb-4">
            {sequence[currentIndex] || ""}
          </p>
          {currentIndex >= 2 && (
            <div className="space-x-4">
              <button
                onClick={() => handleResponse(true)}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Match
              </button>
              <button
                onClick={() => handleResponse(false)}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                No Match
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Test Completed</h2>
          <p>Accuracy: {calculateAccuracy()}%</p>
          <button
            onClick={handleTestCompletion}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Submit Results
          </button>
          {loading && <p>Submitting results...</p>}
          {zScore && metrics && (
            <div className="mt-4">
              <h3 className="font-bold">Results</h3>
              <p>Z-Score: {zScore}</p>
              <p>Mean Accuracy: {metrics.meanAccuracy}</p>
              <p>Standard Deviation: {metrics.stdAccuracy}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TwoBackTest;
