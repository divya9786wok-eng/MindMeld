import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../Redux/userActions";
import profilePic from "../assets/profile.jpg"; // Replace with actual path
import radarChart from "../assets/focusimg.png"; // Replace with actual path
import { getGameRecommendations } from './getData';
import chart from "../assets/chart.png"; // Replace with actual path

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(clearUser());
    navigate("/");
  };
  const user = useSelector((state) => state.user.user);
  const { sex, age, Category } = user || {};

  const gameIds = getGameRecommendations(sex, age, Category);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex">
        <aside className="w-1/4 bg-white p-6 rounded-lg shadow-md">
          <img
            src={profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-bold text-center">{user.name}</h2>
          <p className="text-center text-gray-600">{user.email}</p>
          <p className="mt-4">
            <strong>Age:</strong> {user.age}
          </p>
          <p>
            <strong>Occupation:</strong> {user.occupation}
          </p>
          <p>
            <strong>Cognitive Goals:</strong> {user.cognitiveGoals}
          </p>
          <img src={radarChart} alt="Radar Chart" className="w-full mt-4" />
          <button onClick={logout} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">Logout</button>
        </aside>

        <main className="flex-1 ml-8">
          <h2 className="text-3xl font-bold mb-4">Cognitive Health Overview</h2>
          <p className="text-gray-600 mb-8">01 - 19 January, 2025</p>

          <div className="grid grid-cols-4 gap-4 mb-8">
          {Category.map((cat, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold">{cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}</h3>
                <p className="text-2xl font-bold">{(cat.pscore / 10).toFixed(1)}/10</p>
                <p className={`text-${cat.pscore > 7 ? 'blue' : 'orange'}-500`}>
                  {cat.pscore > 7 ? 'Outstanding' : 'Average'}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-bold mb-4">Suggested activities:</h3>
            <div className="flex space-x-4">
              {Category.map((cat, index) => (
                <span
                  key={index}
                  className={`bg-${cat.type === 'focus' ? 'orange' : 'blue'}-100 text-${cat.type === 'focus' ? 'orange' : 'blue'}-600 text-sm font-semibold px-3 py-1 rounded-full`}
                >
                  {cat.type.charAt(0).toUpperCase() + cat.type.slice(1)} Activities
                </span>
              ))}
              {gameIds.map((gameId, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-600 text-sm font-semibold px-3 py-1 rounded-full"
                >
                  Game ID: {gameId}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-bold mb-4">Activity Charts</h3>
            <img
              src={chart}
              alt="Activity Chart"
              className="w-full"
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Your Badges</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="font-bold">Focus Freak</p>
                <p className="text-gray-500">Not Started</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="font-bold">Mega Memory</p>
                <p className="text-gray-500">75% Complete</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg text-center">
                <p className="font-bold">Attention Span 200</p>
                <p className="text-yellow-600">Recall 100%</p>
              </div>
            </div>{" "}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
