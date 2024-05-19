"use client";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function WelcomePage() {
    const [name, setName] = useState("");
    const [age, setAge] = useState(0);
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [id, setId] = useState("6649fb043336782fe87c8652");
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        fetchInfo();
    }, []);

    const fetchInfo = async () => {
        const response = await fetch(
            `https://us-west-2.aws.neurelo.com/rest/users/${id}`,
            {
                method: "GET",
                headers: {
                    "X-API-KEY":
                        "neurelo_9wKFBp874Z5xFw6ZCfvhXdQI0n/IuXyaFnE2pRTKQKV1kIYj2NATYl+L0t52jsR3dHeN/1e+hI+j5Fc1Wh9ozkWhNZt7XhLhxhsp5rJn5oJKz54N2r0UA3Z1vYstHVYlb06mu90fZHBJI+axoLkdT7ooxhL9WN6TnK6qHPSFbrQijhkbTf35C7MeKwT1HOth_DKYSPo6Y4FGUXFdvVb3TcGHezJQ95M+jh9WG/Do6KVw=",
                },
            },
        );
        const data = await response.json();

        setName(data.data.name);
        setAge(data.data.age);
        setHeight(data.data.height);
        setWeight(data.data.weight);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (isNaN(value)) setAge(0);
        else setAge(value);
    };

    const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (isNaN(value)) setHeight(0);
        else setHeight(value);
    };

    const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (isNaN(value)) setWeight(0);
        else setWeight(value);
    };

    const handleEditClick = async () => {
        if (edit) {
            const response = await fetch(
                `https://us-west-2.aws.neurelo.com/rest/users/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-KEY":
                            "neurelo_9wKFBp874Z5xFw6ZCfvhXdQI0n/IuXyaFnE2pRTKQKV1kIYj2NATYl+L0t52jsR3dHeN/1e+hI+j5Fc1Wh9ozkWhNZt7XhLhxhsp5rJn5oJKz54N2r0UA3Z1vYstHVYlb06mu90fZHBJI+axoLkdT7ooxhL9WN6TnK6qHPSFbrQijhkbTf35C7MeKwT1HOth_DKYSPo6Y4FGUXFdvVb3TcGHezJQ95M+jh9WG/Do6KVw=",
                    },
                    body: JSON.stringify({
                        name: name,
                        age: age,
                        height: height,
                        weight: weight,
                    }),
                },
            );
            const data = await response.json();
            console.log(data);
        }

        setEdit(!edit);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center justify-center space-y-0 bg-gray-100">
                <div className="mt-0">
                    <h2 className="text-2xl font-semibold">Profile</h2>
                    <div className="flex space-x-4">
                        <div className="mt-4">
                            <label
                                htmlFor="name"
                                className="block text-lg font-medium text-gray-700"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={handleNameChange}
                                disabled={!edit}
                                className="mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
                            />
                        </div>
                        <div className="mt-4">
                            <label
                                htmlFor="age"
                                className="block text-lg font-medium text-gray-700"
                            >
                                Age
                            </label>
                            <input
                                type="text"
                                id="age"
                                value={age}
                                onChange={handleAgeChange}
                                disabled={!edit}
                                className="mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="mt-4">
                            <label
                                htmlFor="height"
                                className="block text-lg font-medium text-gray-700"
                            >
                                Height
                            </label>
                            <input
                                type="text"
                                id="height"
                                value={height}
                                onChange={handleHeightChange}
                                disabled={!edit}
                                className="mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
                            />
                        </div>
                        <div className="mt-4">
                            <label
                                htmlFor="weight"
                                className="block text-lg font-medium text-gray-700"
                            >
                                Weight
                            </label>
                            <input
                                type="text"
                                id="weight"
                                value={weight}
                                onChange={handleWeightChange}
                                disabled={!edit}
                                className="mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
                            />
                        </div>
                    </div>
                    <button onClick={handleEditClick}>
                        {edit ? "Save" : "Edit"}
                    </button>
                </div>
            </div>

            <Link
                href="/"
                className="mt-20 mb-4 px-32 py-6 text-3xl font-bold text-white bg-gray-500 rounded-lg shadow-lg hover:bg-blue-600"
            >
                Fill Your Mouth!
            </Link>
            <div className="flex space-x-4">
                <Link
                    href="/missions"
                    className="px-8 py-4 text-xl font-semibold text-white bg-gray-400 rounded-lg shadow hover:bg-gray-500"
                >
                    Missions
                </Link>
                <Link
                    href="/stats"
                    className="px-8 py-4 text-xl font-semibold text-white bg-gray-400 rounded-lg shadow hover:bg-gray-500"
                >
                    Stats
                </Link>
                <Link
                    href="/leaderboard"
                    className="px-8 py-4 text-xl font-semibold text-white bg-gray-400 rounded-lg shadow hover:bg-gray-500"
                >
                    Leaderboard
                </Link>
            </div>
            <div className="mt-2 pt-4 text-lg text-gray-600">
                Made with <span className="text-red-500">❤️</span> at HawkHacks
            </div>
        </div>
    );
}
