"use client";
import React, { useState, useEffect } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

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
        <div className="p-6 bg-gray-100 min-h-screen">
            <Link href="/welcome">
                    <FontAwesomeIcon icon={faHome} size="2x" />
            </Link>
            <h1 className="text-4xl mb-4 text-center text-gray-800">Missions</h1>
            <div className="bg-white shadow-md rounded-lg px-4 py-6 mx-auto max-w-xxl">
                {missions.map((mission) => (
                    <div key={mission.id} className="flex justify-between items-center py-2 border-b">
                        <span className="text-lg">{mission.description}</span>
                        <span className="text-lg font-bold">{mission.score} points</span>
                    </div>
                ))}
            </div>
        </div>
            );
}