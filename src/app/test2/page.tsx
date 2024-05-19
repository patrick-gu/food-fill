"use client";

import { useCookies } from "react-cookie";
import { cookies } from 'next/headers';

export default function Test2() {
    const [cookies] = useCookies(["username"]);

    return (
        <div className="p-6">
            <h1 className="text-4xl mb-4">Test2</h1>
            <div className="bg-white shadow-md rounded-lg px-4 py-6">
                {cookies.username}
            </div>
        </div>
    );
}