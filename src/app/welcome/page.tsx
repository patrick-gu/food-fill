"use client";
import { redirect } from 'next/navigation';
import React from 'react';

export default function WelcomePage() {

    const handlePlayGame = () => {
        console.log('Play Game button clicked');
    };

    const handleMissions = () => {
        console.log('Missions button clicked');
    };

    const handleStats = () => {
        console.log('Stats button clicked');
    };

    const handleLeaderboard = () => {
        console.log('Leaderboard button clicked');
        redirect('/leaderboard')
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <button 
                onClick={handlePlayGame}
                className="mb-4 px-8 py-4 text-2xl font-bold text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600">
                Play Game
            </button>
            <div className="flex space-x-4">
                <button 
                    onClick={handleMissions}
                    className="px-4 py-2 text-lg font-semibold text-white bg-blue-400 rounded-lg shadow hover:bg-blue-500">
                    Missions
                </button>
                <button 
                    onClick={handleStats}
                    className="px-4 py-2 text-lg font-semibold text-white bg-blue-400 rounded-lg shadow hover:bg-blue-500">
                    Stats
                </button>
                <button 
                    onClick={handleLeaderboard}
                    className="px-4 py-2 text-lg font-semibold text-white bg-blue-400 rounded-lg shadow hover:bg-blue-500">
                    Leaderboard
                </button>
            </div>
        </div>
    );
}