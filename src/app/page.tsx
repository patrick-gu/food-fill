"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
    const [startDate] = useState(() => new Date());

    return (
        <main className="w-screen h-screen relative">
            <div className="w-full h-full absolute">
                <CameraVideo />
            </div>
            <div className="w-full h-full absolute">
                <h1 className="text-center text-4xl font-bold p-4">
                    Food Fill 🍞
                </h1>
            </div>
            <div className="w-full h-full absolute flex justify-between">
                <div className="bg-white/50 w-96 h-full space-y-4 p-4">
                    <h2 className="text-center text-2xl font-bold">Logs</h2>
                    <p className="text-center">this is a test log</p>
                </div>
                <div className="bg-white/50 w-96 h-full flex flex-col gap-4 p-4">
                    <h2 className="text-center text-2xl font-bold">
                        Food Eaten
                    </h2>
                    <p className="text-center">
                        You&apos;ve been eating for {<Timer />}
                    </p>
                    <ul className="flex-grow">
                        <li className="p-4 flex justify-between gap-4">
                            <h3 className="text-lg font-bold">🍎 Apple</h3>
                            <p>200 g | 300 Cal</p>
                        </li>
                        <hr />
                    </ul>
                    <hr />
                    <div className="flex justify-between">
                        <h3 className="text-xl">Total</h3>
                        <p>500 g | 800 Cal</p>
                    </div>
                </div>
            </div>
        </main>
    );
}

function CameraVideo() {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            videoRef.current!.srcObject = stream;
        });
    }, []);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            className="object-contain h-full w-full"
        ></video>
    );
}

function Timer() {
    const [startTime] = useState(() => new Date().getTime());

    const [renderDuration, setRenderDuration] = useState("00:00:00");

    const dateFormatter = useMemo(
        () =>
            new Intl.DateTimeFormat("en-GB", {
                timeZone: "Etc/UTC",
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }),
        [],
    );

    const requestRef = useRef(0);
    const animate = useCallback(() => {
        setRenderDuration(
            dateFormatter.format(new Date().getTime() - startTime),
        );
        requestRef.current = requestAnimationFrame(animate);
    }, [dateFormatter, startTime]);
    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [animate]);

    return <>{renderDuration}</>;
}
