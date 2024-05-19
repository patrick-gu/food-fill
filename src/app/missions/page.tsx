"use client";
import React, { useState, useEffect } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';

type Mission = {
    id: number;
    age: string;
    height: string;
    score: string;
    target: string;
    missions: string[];
}; 

export default function MissionsPage() {
    const [missions, setMissions] = useState<Mission[]>([]);

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

        setMissions(data.data);
    };

    return (

        <div className="p-6">
            <h1 className="text-4xl mb-4">Missions</h1>
            <div className="bg-white shadow-md rounded-lg px-4 py-6">
                <ul className="overflow-y-auto max-h-96">
                    {missions.map((mission) => (
                        <li key={mission.id} className="mb-4">
                            <h2 className="text-xl font-bold">{mission.id}</h2>
                            <p>{mission.age}</p>
                            <p>{mission.height}</p>
                            <p>{mission.score}</p>
                            <p>{mission.target}</p>
                            <p>{mission.id}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}