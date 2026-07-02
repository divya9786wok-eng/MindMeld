import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUser } from '../../../Redux/userActions';
import { Toaster, toast } from 'react-hot-toast';

const TowerOfHanoi = () => {
    const [numDisks, setNumDisks] = useState(3); // Default to 3 disks
    const [towers, setTowers] = useState([[], [], []]);
    const [selectedTower, setSelectedTower] = useState(null);
    const [reactionTime, setReactionTime] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [moves, setMoves] = useState([]);
    const [correctMoves, setCorrectMoves] = useState(0);
    const [accuracy, setAccuracy] = useState(null);
    const [timer, setTimer] = useState(120); // 2 minutes in seconds
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [metrics, setMetrics] = useState(null);
    const [userZScore, setUserZScore] = useState(null);

    const token = useSelector(state => state.user.token);
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();

    // Initialize the towers with disks
    const initializeTowers = () => {
        const initialTowers = [Array.from({ length: numDisks }, (_, i) => numDisks - i), [], []];
        setTowers(initialTowers);
        setMoves([]);
        setCorrectMoves(0);
        setReactionTime(0);
        setAccuracy(null);
        setStartTime(Date.now());
        setTimer(120); // Reset timer to 2 minutes
        setIsTimerRunning(true); // Start the timer
    };

    // Move disk from one tower to another
    const moveDisk = (fromTowerIndex, toTowerIndex) => {
        const newTowers = [...towers];
        const diskToMove = newTowers[fromTowerIndex][newTowers[fromTowerIndex].length - 1]; // Get the top disk

        if (
            !newTowers[toTowerIndex].length || // Target tower is empty
            diskToMove < newTowers[toTowerIndex][newTowers[toTowerIndex].length - 1] // Disk is smaller than the top disk on the target tower
        ) {
            newTowers[fromTowerIndex].pop(); // Remove the disk from the source tower
            newTowers[toTowerIndex].push(diskToMove); // Add the disk to the target tower
            setTowers(newTowers);
            setMoves([...moves, { from: fromTowerIndex, to: toTowerIndex }]);
            setCorrectMoves((prev) => prev + 1); // Increment correct moves
        } else {
            toast.error("Invalid move: Cannot place a larger disk on a smaller disk.");
        }

        setSelectedTower(null); // Reset selected tower
    };

    // Handle tower selection and movement
    const handleTowerClick = (index) => {
        if (selectedTower === null) {
            setSelectedTower(index); // Select the tower to pick up a disk
        } else {
            if (selectedTower === index) {
                toast.error("Cannot move disk to the same tower.");
                setSelectedTower(null); // Deselect if the same tower is clicked
            } else {
                moveDisk(selectedTower, index); // Move the disk to the selected tower
            }
        }
    };

    // Calculate accuracy based on correct moves and total moves
    const calculateAccuracy = () => {
        const optimalMoves = Math.pow(2, numDisks) - 1; // Minimum moves required
        const totalMoves = moves.length;

      

        const accuracyPercentage = (optimalMoves / totalMoves) * 100;
        return Math.min(accuracyPercentage, 100).toFixed(2); // Cap accuracy at 100%
    };

    const handleSubmit = () => {
        const endTime = Date.now();
        const totalTime = (endTime - startTime) / 1000; // Reaction time in seconds
        setReactionTime(totalTime);

        const optimalMoves = Math.pow(2, numDisks) - 1;
        const totalMoves = moves.length;

        if (timer === 0 || totalMoves < optimalMoves) {
            setAccuracy(0);
            toast.error("Game incomplete or not solved optimally. Accuracy is 0%.");
        } else {
            const accuracyPercentage = calculateAccuracy();
            setAccuracy(accuracyPercentage);
        }

        setIsTimerRunning(false); // Stop the timer
        sendPerformanceToBackend(totalTime, accuracy);
    };

    const sendPerformanceToBackend = async (reactionTime, accuracy) => {
        const userDetails = {
            userScore: accuracy,
            reactionTime,
            userCategory: 'problemSolving',
            gameId: 9,
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

    useEffect(() => {
        if (isTimerRunning && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);

            return () => clearInterval(interval); // Cleanup interval on unmount
        } else if (timer === 0) {
            handleSubmit(); // Automatically submit when timer reaches 0
        }
    }, [isTimerRunning, timer]);

    // Format timer into MM:SS
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    return (   
        <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100">
            <div className="absolute top-20 right-4 bg-gray-700 text-white px-4 py-2 rounded shadow">
                <p className="text-lg font-semibold">Time Left: {formatTime(timer)}</p>
            </div>

            <h1 className="text-3xl font-bold mb-6">Tower of Hanoi</h1>

            <div className="flex justify-around w-full mb-6">
                {towers.map((tower, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => handleTowerClick(index)}
                    >
                        <div
                            className="w-2.5 h-72 bg-gray-700 relative"
                            style={{ borderRadius: '10px' }}
                        >
                            {tower.map((disk, idx) => (
                                <div
                                    key={idx}
                                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                                    style={{
                                        width: `${(disk / numDisks) * 60 + 40}px`,
                                        height: '20px',
                                        background: 'red',
                                        borderRadius: '10px',
                                        bottom: `${idx * 22}px`,
                                    }}
                                ></div>
                            ))}
                        </div>

                        <div
                            className="w-40 h-3 bg-gray-700 mt-0"
                            style={{ borderRadius: '5px' }}
                        ></div>

                        <p className="text-xl font-bold mt-2">{['A', 'B', 'C'][index]}</p>
                    </div>
                ))}
            </div>

            <div className="flex justify-around w-full mb-6">
                <div className="text-center">
                    <p className="text-lg font-semibold">Ideal Moves</p>
                    <p className="text-lg">{Math.pow(2, numDisks) - 1}</p>
                </div>

                <div className="text-center">
                    <p className="text-lg font-semibold">Moves</p>
                    <p className="text-lg">{moves.length}</p>
                </div>
            </div>

            <button className="bg-blue-600 text-white px-4 py-2 rounded shadow" onClick={initializeTowers}>
                Start Game
            </button>

            <button
                className="bg-green-600 text-white px-4 py-2 rounded shadow mt-4"
                onClick={handleSubmit}
            >
                Submit Game
            </button>

            {reactionTime > 0 && (
                <div className="mt-4 text-center">
                    <p className="text-lg font-semibold">Time Taken: {reactionTime.toFixed(2)} seconds</p>
                    <p className="text-lg font-semibold">Total Moves: {correctMoves}</p>
                    <p className="text-lg font-semibold">Accuracy: {accuracy}%</p>
                </div>
            )}

            {metrics && (
                <div className="mt-6 bg-gray-100 p-4 rounded shadow text-black">
                    <h2 className="text-lg font-semibold mb-2">Backend Metrics</h2>
                    <p>Mean Accuracy: {metrics.meanAccuracy}</p>
                    <p>Standard Deviation (Accuracy): {metrics.avgZScoreAccuracy}</p>
                    <p>User Z-Score: {userZScore}</p>
                </div>
            )}

            <Toaster />
        </div>
    );
};

export default TowerOfHanoi;