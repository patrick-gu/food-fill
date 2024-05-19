import React from 'react';
import Link from 'next/link';

export default function WelcomePage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <Link href="/playgame" className="mb-4 px-8 py-4 text-2xl font-bold text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600">
                Play Game
            </Link>
            <div className="flex space-x-4">
                <Link href="/missions" className="px-4 py-2 text-lg font-semibold text-white bg-blue-400 rounded-lg shadow hover:bg-blue-500">
                    Missions
                </Link>
                <Link href="/stats" className="px-4 py-2 text-lg font-semibold text-white bg-blue-400 rounded-lg shadow hover:bg-blue-500">
                    Stats
                </Link>
                <Link href="/leaderboard" className="px-4 py-2 text-lg font-semibold text-white bg-blue-400 rounded-lg shadow hover:bg-blue-500">
                    Leaderboard
                </Link>
            </div>
        </div>
    );
}