"use client";
import React from 'react';
import { useState } from 'react';
import Link from 'next/link';

export default function WelcomePage() {

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAge(event.target.value);
    };

    const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHeight(event.target.value);
    };

    const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWeight(event.target.value);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center justify-center space-y-0 h-screen bg-gray-100">      
                <div className="mt-0">
                    <h2 className="text-2xl font-semibold">Profile</h2>
                    <div className="mt-4">
                        <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={handleNameChange}
                            className="mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="age" className="block text-lg font-medium text-gray-700">
                            Age
                        </label>
                        <input
                            type="text"
                            id="age"
                            value={age}
                            onChange={handleAgeChange}
                            className="mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="height" className="block text-lg font-medium text-gray-700">
                            Height
                        </label>
                        <input
                            type="text"
                            id="height"
                            value={height}
                            onChange={handleHeightChange}
                            className="mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="weight" className="block text-lg font-medium text-gray-700">
                            Weight
                        </label>
                        <input
                            type="text"
                            id="weight"
                            value={weight}
                            onChange={handleWeightChange}
                            className="mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
                        />
                    </div>
                </div>
            </div>


            <Link href="/" className="mt-10 mb-4 px-32 py-6 text-3xl font-bold text-white bg-gray-500 rounded-lg shadow-lg hover:bg-blue-600">
                Fill Your Mouth!
            </Link>
            <div className="flex space-x-4">
                <Link href="/missions" className="px-8 py-4 text-xl font-semibold text-white bg-gray-400 rounded-lg shadow hover:bg-gray-500">
                    Missions
                </Link>
                <Link href="/stats" className="px-8 py-4 text-xl font-semibold text-white bg-gray-400 rounded-lg shadow hover:bg-gray-500">
                    Stats
                </Link>
                <Link href="/leaderboard" className="px-8 py-4 text-xl font-semibold text-white bg-gray-400 rounded-lg shadow hover:bg-gray-500">
                    Leaderboard
                </Link>
            </div>
            <div className="pt-4 text-lg text-gray-600">
                Made with <span className="text-red-500">❤️</span> at HawkHacks
            </div>
        </div>
    );
}