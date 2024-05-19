"use client";
import React, { useState, useEffect } from 'react';

type Mission = {
    id: number;
    title: string;
    description: string;
}; 

export default function MissionsPage() {
    const [missions, setMissions] = useState<Mission[]>([]);

    useEffect(() => {
        fetchMissions();
    }, []);

    const fetchMissions = async () => {
        const data = [
            { id: 1, title: 'Mission 1', description: 'Description for Mission 1' },
            { id: 2, title: 'Mission 2', description: 'Description for Mission 2' },
            { id: 3, title: 'Mission 3', description: 'Description for Mission 3'}
        ];
        setMissions(data);
    };

    return (

        <div className="p-6">
            <h1 className="text-4xl mb-4">Missions</h1>
            <div className="bg-white shadow-md rounded-lg px-4 py-6">
                <ul className="overflow-y-auto max-h-96">
                    {missions.map((mission) => (
                        <li key={mission.id} className="mb-4">
                            <h2 className="text-xl font-bold">{mission.title}</h2>
                            <p>{mission.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}