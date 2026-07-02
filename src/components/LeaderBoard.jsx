import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Leaderboard = ({ user }) => {
  const [sortedData, setSortedData] = useState([]);
  const [problemOfTheDay, setProblemOfTheDay] = useState('');
  const [problemRoute, setProblemRoute] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    // List of cognitive tests and their routes
    const cognitiveTests = [
      { name: 'Whack-A-Mole', route: '/whack-a-mole' },
      { name: 'Two-Back Test', route: '/2-back-test' },
      { name: 'Shape-Color Matching Task', route: '/shape-color-matching' },
      { name: 'Stroop Test', route: '/stroop-test' },
      { name: 'Memory Card Flip Game', route: '/memory-card-flip' },
      { name: 'Multi-Word Typing Game', route: '/multi-word-typing' },
      { name: 'Pattern Recall Game', route: '/pattern-recall' },
      { name: 'Tower of Hanoi', route: '/tower-of-hanoi' },
      { name: 'Math Puzzle', route: '/math-puzzle' }
    ];
    // Check if the problem of the day is already stored in local storage
    const storedProblem = localStorage.getItem('problemOfTheDay');
    const storedRoute = localStorage.getItem('problemRoute');
    const storedDate = localStorage.getItem('problemDate');
    const today = new Date().toDateString();
    if (storedProblem && storedRoute && storedDate === today) {
      setProblemOfTheDay(storedProblem);
      setProblemRoute(storedRoute);
    } else {
      // Randomly select a cognitive test as the "Problem of the Day"
      const randomTest = cognitiveTests[Math.floor(Math.random() * cognitiveTests.length)];
      setProblemOfTheDay(randomTest.name);
      setProblemRoute(randomTest.route);
      // Store the selected problem and route in local storage
      localStorage.setItem('problemOfTheDay', randomTest.name);
      localStorage.setItem('problemRoute', randomTest.route);
      localStorage.setItem('problemDate', today);
    }
    // Generate random leaderboard data
    const randomNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy'];
    const randomScores = Array.from({ length: 9 }, () => Math.floor(Math.random() * 100));
    const randomLeaderboardData = randomNames.slice(0, 9).map((name, index) => ({
      id: index + 1,
      name,
      score: randomScores[index],
    }));
    // Insert the current user into the leaderboard data
    if (user) {
      const userScore = Math.floor(Math.random() * 100); // Random score for the user
      const userEntry = { id: 10, name: user.name, score: userScore };
      const randomIndex = Math.floor(Math.random() * (randomLeaderboardData.length + 1));
      randomLeaderboardData.splice(randomIndex, 0, userEntry);
    }
    // Sort the data by scores in descending order
    const sorted = [...randomLeaderboardData].sort((a, b) => b.score - a.score);
    setSortedData(sorted);
  }, [user]);
  const handleProblemClick = () => {
    navigate(problemRoute);
  };
  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4">Leaderboard</h2>
      <div className="overflow-x-auto w-full max-w-4xl mb-8">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 text-center">Rank</th>
              <th className="py-2 px-4 bg-gray-200 text-center">Name</th>
              <th className="py-2 px-4 bg-gray-200 text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((user, index) => (
              <tr key={user.id} className="border-b">
                <td className="py-2 px-4 text-center">{index + 1}</td>
                <td className="py-2 px-4 text-center">{user.name}</td>
                <td className="py-2 px-4 text-center">{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-4xl text-center">
        <h3 className="text-2xl font-bold mb-2">Problem of the Day</h3>
        <p className="text-xl text-blue-500 cursor-pointer" onClick={handleProblemClick}>
          {problemOfTheDay}
        </p>
      </div>
    </div>
  );
};
export default Leaderboard;