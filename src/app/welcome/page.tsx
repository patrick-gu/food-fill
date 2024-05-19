import React from 'react';
import Link from 'next/link';

export default function WelcomePage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 mt-48">
            <Link href="/" className="mb-4 px-32 py-6 text-3xl font-bold text-white bg-gray-500 rounded-lg shadow-lg hover:bg-blue-600">
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
            <div className="mt-10 text-lg text-gray-600">
                Made with <span className="text-red-500">❤️</span> by the Food Fill team
            </div>
        </div>
    );
}