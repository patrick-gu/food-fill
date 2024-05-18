"use client";

import Image from "next/image";
import { Suspense, forwardRef, useEffect, useRef, useState } from "react";

export default function Home() {
    return (
        <main>
            <CameraVideo />
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

    return <video ref={videoRef} autoPlay playsInline></video>;
}
