"use client";
import React, { useState, useEffect } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';

type Mission = {
    id: string;
    description: string;
    score: number;
}; 

export default function MissionsPage() {
    const [missions, setMissions] = useState<Mission[]>([]);

    useEffect(() => {
        fetchMissions();
    }, []);

    const fetchMissions = async () => {
        const response = await fetch("https://us-west-2.aws.neurelo.com/rest/missions", {
            method: "GET",
            headers: {
                "X-API-KEY": "neurelo_9wKFBp874Z5xFw6ZCfvhXdQI0n/IuXyaFnE2pRTKQKV1kIYj2NATYl+L0t52jsR3dHeN/1e+hI+j5Fc1Wh9ozkWhNZt7XhLhxhsp5rJn5oJKz54N2r0UA3Z1vYstHVYlb06mu90fZHBJI+axoLkdT7ooxhL9WN6TnK6qHPSFbrQijhkbTf35C7MeKwT1HOth_DKYSPo6Y4FGUXFdvVb3TcGHezJQ95M+jh9WG/Do6KVw=",
            }
        });
        const data = await response.json();

        setMissions(data.data);
    };

    return (

        // <div className="p-6">
        //     <h1 className="text-4xl mb-4">Missions</h1>
        //     <div className="bg-white shadow-md rounded-lg px-4 py-6">
        //         <ul className="overflow-y-auto max-h-96">
        //             {missions.map((mission) => (
        //                 <li key={mission.id} className="mb-4">
        //                     <h2 className="text-xl font-bold">{mission.id}</h2>
        //                     <p>{mission.description}</p>
        //                     <p>{mission.score}</p>
        //                 </li>
        //             ))}
        //         </ul>
        //     </div>
        // </div>
        // <div className="p-6">
        //     <h1 className="text-4xl mb-4">Missions</h1>
        //     <div className="bg-white shadow-md rounded-lg px-4 py-6">
        //         {missions.map((mission) => (
        //             <div key={mission.id} className="flex items-center justify-between">
        //                 <span className="font-bold text-lg">{mission.description}</span>
        //             </div>
        //         ))}
        //     </div>
        // </div>
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-4xl mb-4 text-center text-gray-800">Leaderboard</h1>
            <div className="bg-white shadow-md rounded-lg px-4 py-6 mx-auto max-w-md">
                {/* {players.map((player, index) => (
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
                ))} */}
                {missions.map((mission) => (
                    <div key={mission.id} className="flex items-center justify-between">
                        <span className="font-bold text-lg">{mission.description}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}