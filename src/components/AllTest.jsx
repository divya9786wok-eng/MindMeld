import React, { useState } from 'react';
import WhackAMole from "./tests/AttentionTests/whackAMole";
import TwoBackTest from "./tests/FocusTests/2BackTest";
import ShapeColorMatchingTask from "./tests/FocusTests/shapeColor";
import StroopTest from "./tests/FocusTests/stroopTest";
import MemoryCardFlipGame from "./tests/MemoryTests/CardFlip";
import MultiWordTypingGame from "./tests/MemoryTests/MultiWordTypingGame";
import PatternRecallGame from "./tests/MemoryTests/patternRecallGame";
import TowerOfHanoi from "./tests/PuzzleSolvingTests/TowerofHanoi";
import MathPuzzle from "./tests/PuzzleSolvingTests/mathPuzzle";

const AllTest = () => {
    const [currentGame, setCurrentGame] = useState(0);
    const games = [
        <TowerOfHanoi />,
        <MathPuzzle />,
        <PatternRecallGame />,
        <MultiWordTypingGame />,
        <MemoryCardFlipGame />,
        <StroopTest />,
        <ShapeColorMatchingTask />,
        <TwoBackTest />,
        <WhackAMole />
    ];

    const handleNextGame = () => {
        if (currentGame < games.length - 1) {
            setCurrentGame(currentGame + 1);
        }
    };

    const handlePreviousGame = () => {
        if (currentGame > 0) {
            setCurrentGame(currentGame - 1);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
                {games[currentGame]}
            </div>
            <div className="mt-4 flex space-x-4">
                <button
                    onClick={handlePreviousGame}
                    disabled={currentGame <= 0}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-400"
                >
                    Previous Game
                </button>
                <button
                    onClick={handleNextGame}
                    disabled={currentGame >= games.length - 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-400"
                >
                    Next Game
                </button>
            </div>
        </div>
    );
};

export default AllTest;