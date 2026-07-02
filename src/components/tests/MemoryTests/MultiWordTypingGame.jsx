'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { setUser } from '../../../Redux/userActions'

const words = [
    'apple', 'banana', 'grape', 'orange', 'peach', 'pear', 'plum', 'berry', 'melon', 'lemon',
    'dog', 'cat', 'mouse', 'fish', 'bird', 'rabbit', 'lion', 'tiger', 'bear', 'elephant',
    'car', 'bike', 'bus', 'train', 'plane', 'boat', 'truck', 'jeep', 'van', 'scooter',
    'happy', 'sad', 'angry', 'funny', 'kind', 'brave', 'strong', 'weak', 'tall', 'short',
    'red', 'blue', 'green', 'yellow', 'white', 'black', 'pink', 'brown', 'purple', 'orange'
]

const WORD_COUNT = 5
const DISPLAY_TIME = 5 // 7.5 seconds

export default function MultiWordTypingGame() {
    const [targetWords, setTargetWords] = useState([])
    const [userInput, setUserInput] = useState('')
    const [isPlaying, setIsPlaying] = useState(false)
    const [showWords, setShowWords] = useState(false)
    const [gameCompleted, setGameCompleted] = useState(false)
    const [overallAccuracy, setOverallAccuracy] = useState(0)
    const [totalReactionTime, setTotalReactionTime] = useState(0)
    const [error, setError] = useState('')
    const [metrics, setMetrics] = useState(null)
    const [userZScore, setUserZScore] = useState(null)

    const inputRef = useRef(null)
    const startTimeRef = useRef(0)

    const token = useSelector((state) => state.user.token)
    const dispatch = useDispatch()

    const generateWords = () => {
        const shuffledWords = words.sort(() => Math.random() - 0.5)
        return shuffledWords.slice(0, WORD_COUNT)
    }

    const startGame = () => {
        const generatedWords = generateWords()
        setTargetWords(generatedWords)
        setUserInput('')
        setIsPlaying(true)
        setShowWords(true)
        setGameCompleted(false)
        setOverallAccuracy(0)
        setTotalReactionTime(0)
        setError('')
        startTimeRef.current = Date.now()
    }

    const handleInputChange = (e) => {
        setUserInput(e.target.value)
        setError('')
    }

    const user=useSelector((state)=>state.user.user)
    const handleSubmit = async () => {
        const userWords = userInput.trim().split(' ')
        if (userWords.length !== WORD_COUNT) {
            setError(`You must type exactly ${WORD_COUNT} words before submitting.`)
            return
        }

        const endTime = Date.now()
        const reactionTime = (endTime - startTimeRef.current) / 1000

        let correctChars = 0
        let totalChars = 0
        for (let i = 0; i < WORD_COUNT; i++) {
            const inputWord = userWords[i] || ''
            const targetWord = targetWords[i]
            const maxLength = Math.max(inputWord.length, targetWord.length)

            for (let j = 0; j < maxLength; j++) {
                if (inputWord[j] === targetWord[j]) correctChars++
            }
            totalChars += maxLength
        }

        const accuracy = (correctChars / totalChars) * 100

        setGameCompleted(true)
        setOverallAccuracy(accuracy)
        setTotalReactionTime(reactionTime)

        // Send data to backend after game completion
        sendPerformanceToBackend(accuracy, reactionTime)
    }

    useEffect(() => {
        if (isPlaying && showWords) {
            const timer = setTimeout(() => {
                setShowWords(false)
                inputRef.current?.focus()
            }, DISPLAY_TIME * 1000)

            return () => clearTimeout(timer)
        }
    }, [isPlaying, showWords])

    const sendPerformanceToBackend = async (accuracy, reactionTime) => {
        const userDetails = {
            reactionTime,
            userCategory: 'memory', 
            userScore: accuracy,
            gameId: 6,
            sex: user.sex,
            age: user.age,
        }

        try {
            const response = await axios.post(
                `https://mind-c64g.onrender.com/api/cognitive-metrics`,
                { userDetails },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (response.status === 200) {
                // Assuming backend returns updated user data
                setMetrics(response.data.metrics)
                setUserZScore(response.data.userZScore)
                dispatch(setUser(response.data.user,token))
            }
        } catch (error) {
            console.error('Error sending performance data to backend:', error)
        }
    }

    const wordsTyped = userInput.trim().split(' ').filter(Boolean).length

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white shadow-md rounded p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">Multi-Word Typing Game</h1>

                {!isPlaying ? (
                    <div className="space-y-4">
                        <p className="text-center text-gray-600">
                            Words will be displayed for {DISPLAY_TIME} seconds before hiding. Type all words and click Submit when finished.
                        </p>
                        <button
                            onClick={startGame}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Start Game
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {showWords ? (
                            <div className="grid grid-cols-5 gap-2">
                                {targetWords.map((word, index) => (
                                    <div
                                        key={index}
                                        className="text-center font-semibold p-2 bg-gray-200 rounded"
                                    >
                                        {word}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center font-semibold">
                                Words hidden. Start typing!
                            </div>
                        )}
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={handleInputChange}
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Type words here, separated by spaces"
                                ref={inputRef}
                                disabled={showWords || gameCompleted}
                            />
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </div>
                        {wordsTyped >= WORD_COUNT && (
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                                disabled={gameCompleted}
                            >
                                Submit
                            </button>
                        )}
                        {gameCompleted && (
                            <div className="text-sm space-y-2">
                                <h2 className="font-semibold">Results:</h2>
                                <div className="flex justify-between">
                                    <span>Overall Accuracy:</span>
                                    <span>{overallAccuracy.toFixed(2)}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Reaction Time:</span>
                                    <span>{totalReactionTime.toFixed(2)}s</span>
                                </div>
                                {metrics && (
                                    <div className="mt-6 bg-gray-100 p-4 rounded shadow">
                                        <h2 className="text-lg font-semibold mb-2">Backend Metrics</h2>
                                        <p>Mean Accuracy: {metrics.meanAccuracy}</p>
                                        <p>Standard Deviation (Accuracy): {metrics.avgZScoreAccuracy}</p>
                                        <p>User Z-Score: {userZScore}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
