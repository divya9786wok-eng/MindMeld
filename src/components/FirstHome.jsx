import React from 'react';
import brain from '../assets/brain.png';
import { useNavigate } from 'react-router-dom';

const FirstHome = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            <main className="flex flex-1 items-center justify-center w-full">
                <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl p-8">
                    <div className="text-center md:text-left md:w-1/2">
                        <h1 className="text-5xl font-bold mb-4">Your Path to Cognitive Wellness Starts Here</h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Go through a defined set of activities to let us personalize our services based on our analysis of your cognitive health
                        </p>
                        <button
                            onClick={() => navigate('/all')}
                            className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold"
                        >
                            GET STARTED
                        </button>
                    </div>
                    <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
                        <img src={brain} alt="Brain" className="w-80 h-auto" />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FirstHome;