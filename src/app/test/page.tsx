"use client";

import { useState } from "react";
import { useCookies } from "react-cookie";
import { cookies } from "next/headers";

export default function TestPage() {
    const [login, setLogin] = useState("");
    const [cookies, setCookie] = useCookies(["username"]);
    // const cookieStore = cookies();

    const handleLogin = () => {
        setCookie("username", login);
        // cookieStore.set("username", login);
    };

    return (
        <div className="p-6">
            <h1 className="text-4xl mb-4">Test</h1>
            <div className="bg-white shadow-md rounded-lg px-4 py-6">
                <input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Enter your login"
                    className="border border-gray-300 rounded-md px-3 py-2"
                />
                <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">
                    Login
                </button>
                <p>This is a test page.</p>
            </div>
        </div>
    );
}
