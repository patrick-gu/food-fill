"use client";

import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';

export default function LeaderboardPage() {
    const [players, setPlayers] = useState([
        { name: 'Player 1', score: 100 },
        { name: 'Player 2', score: 90 },
        { name: 'Player 3', score: 80 },
        { name: 'Player 4', score: 70 },
        { name: 'Player 5', score: 60 },
        { name: 'Player 6', score: 50 },
        { name: 'Player 7', score: 40 },
        { name: 'Player 8', score: 30 },
        { name: 'Player 9', score: 20 },
        { name: 'Player 10', score: 10 },
        // Add more players as needed
    ]);

    // Sort players by score in descending order
    players.sort((a, b) => b.score - a.score);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-4xl mb-4 text-center text-gray-800">Leaderboard</h1>
            <div className="bg-white shadow-md rounded-lg px-4 py-6 mx-auto max-w-md">
                {players.map((player, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                        <div className="flex items-center">
                            <span className="text-lg font-bold w-8">
                                {index < 3 ? (
                                    <FontAwesomeIcon 
                                        icon={faMedal}
                                        className={index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-yellow-600'} /> 
                                ) : index + 1}
                            </span>
                            <span className="ml-4 text-lg text-gray-700">{player.name}</span>
                        </div>
                        <span className="text-lg text-gray-700">{player.score}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}