import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import WhackAMole from "./components/tests/AttentionTests/whackAMole";
import TwoBackTest from "./components/tests/FocusTests/2BackTest";
import ShapeColorMatchingTask from "./components/tests/FocusTests/shapeColor";
import StroopTest from "./components/tests/FocusTests/stroopTest";
import MemoryCardFlipGame from "./components/tests/MemoryTests/CardFlip";
import MultiWordTypingGame from "./components/tests/MemoryTests/MultiWordTypingGame";
import PatternRecallGame from "./components/tests/MemoryTests/patternRecallGame";
import Dashboard from "./components/Dashboard";
import { useSelector } from "react-redux";
import TowerOfHanoi from "./components/tests/PuzzleSolvingTests/TowerofHanoi";
import FirstHome from "./components/FirstHome";
import AllTest from "./components/AllTest";
import Leaderboard from "./components/LeaderBoard";
function App() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all" element={!user ? <Login /> : <AllTest />} />
        <Route path="/leaderboard" element={!user ? <Login /> : <Leaderboard user={user} />} />
        <Route path="/login" element={!user ? <Login /> : <Home />} />
        <Route path="/register" element={!user ? <Register /> : <Home />} />
        <Route path="/dashboard" element={!user ? <Login /> : <Dashboard />} />
        <Route
          path="/whack-a-mole"
          element={user ? <WhackAMole /> : <Login />}
        />
        <Route
          path="/2-back-test"
          element={user ? <TwoBackTest /> : <Login />}
        />
        <Route
          path="/shape-color-matching"
          element={user ? <ShapeColorMatchingTask /> : <Login />}
        />
        <Route
          path="/stroop-test"
          element={user ? <StroopTest /> : <Login />}
        />
        <Route
          path="/card-flip-game"
          element={user ? <MemoryCardFlipGame /> : <Login />}
        />
        <Route
          path="/multi-word-typing"
          element={user ? <MultiWordTypingGame /> : <Login />}
        />
        <Route
          path="/pattern-recall-game"
          element={user ? <PatternRecallGame /> : <Login />}
        />
        <Route
          path="/tower-of-hanoi"
          element={user ? <TowerOfHanoi /> : <Login />}
        />
        <Route path="/firstHome" element={<FirstHome />} />
      </Routes>
    </div>
  );
}

export default App;
