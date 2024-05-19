"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';

type Player = {
    id: number;
    age: number;
    height: number;
    weight: number;
    score: number;
    target: string;
    missions: string[];
    calorie: number;
    name: string;
}; 

export default function LeaderboardPage() {
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        fetchMissions();
    }, []);

    const fetchMissions = async () => {
        const response = await fetch("https://us-west-2.aws.neurelo.com/rest/users", {
            method: "GET",
            headers: {
                "X-API-KEY": "neurelo_9wKFBp874Z5xFw6ZCfvhXdQI0n/IuXyaFnE2pRTKQKV1kIYj2NATYl+L0t52jsR3dHeN/1e+hI+j5Fc1Wh9ozkWhNZt7XhLhxhsp5rJn5oJKz54N2r0UA3Z1vYstHVYlb06mu90fZHBJI+axoLkdT7ooxhL9WN6TnK6qHPSFbrQijhkbTf35C7MeKwT1HOth_DKYSPo6Y4FGUXFdvVb3TcGHezJQ95M+jh9WG/Do6KVw=",
            }
        });
        const data = await response.json();

        console.log(data.data);
        setPlayers(data.data);
    };
    // Sort players by score in descending order
    players.sort((a, b) => b.score - a.score);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Link href="/welcome">
                    <FontAwesomeIcon icon={faHome} size="2x" />
            </Link>
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