"use client";

import { useState } from 'react';

export default function LeaderboardPage() {
    const [players, setPlayers] = useState([
        { name: 'Player 1', score: 100 },
        { name: 'Player 2', score: 90 },
        { name: 'Player 3', score: 80 },
        // Add more players as needed
    ]);

    // Sort players by score in descending order
    players.sort((a, b) => b.score - a.score);

    

    return (
        <div className="p-6">
            <h1 className="text-4xl mb-4">Leaderboard</h1>
            <div className="bg-white shadow-md rounded-lg px-4 py-6">
                {players.map((player, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                        <div className="flex items-center">
                            <span className="text-lg font-bold w-8">{index + 1}.</span>
                            <span className="ml-4 text-lg">{player.name}</span>
                        </div>
                        <span className="text-lg">{player.score}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}