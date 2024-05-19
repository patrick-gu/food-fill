"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function Home() {
    const [cameraDataCanvas, setCameraDataCanvas] =
        useState<HTMLCanvasElement | null>(null);
    const cameraDataCanvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        const canvas = document.createElement("canvas");
        setCameraDataCanvas(canvas);
        cameraDataCanvasRef.current = canvas;
    }, []);
    const cameraDataRef = useRef<ImageData | undefined>();
    const [cameraData, setCameraDataRaw] = useState<ImageData | undefined>();
    const setCameraData = (cameraData: ImageData | undefined) => {
        cameraDataRef.current = cameraData;
        setCameraDataRaw(cameraData);
    };
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [orangeColor, setOrangeColor] = useState("#f47624");
    const [greenColor, setGreenColor] = useState("#12c2f5");

    const [orangePoints, setOrangePoints] = useState<[number, number][]>([]);
    const [greenPoints, setGreenPoints] = useState<[number, number][]>([]);

    const [recog, setRecog] = useState<{ label: string; score: number }[]>([]);

    useEffect(() => {
        if (!cameraData) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const { width, height } = canvas;
        if (width === 0 || height === 0) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!cameraDataCanvas) return;

        const getData = (y: number, x: number) => {
            const r = cameraData.data[(y * width + x) * 4];
            const g = cameraData.data[(y * width + x) * 4 + 1];
            const b = cameraData.data[(y * width + x) * 4 + 2];
            return [r, g, b];
        };

        let orangeGroups: [number, number][] = [];
        let greenGroups: [number, number][] = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const [r, g, b] = getData(y, x);
                let sr = 0,
                    sg = 0,
                    sb = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        const y1 = y + i;
                        const x1 = x + j;
                        const [r1, g1, b1] =
                            0 <= y1 && y1 < height && 0 <= x1 && x1 < width
                                ? getData(y1, x1)
                                : [r, g, b];
                        sr += r1;
                        sg += g1;
                        sb += b1;
                    }
                }
                (sr /= 9), (sg /= 9), (sb /= 9);
                // [118, 174, 236] purple
                const orange: [number, number, number] = [
                    parseInt(orangeColor.slice(1, 3), 16),
                    parseInt(orangeColor.slice(3, 5), 16),
                    parseInt(orangeColor.slice(5, 7), 16),
                ];
                const green: [number, number, number] = [
                    parseInt(greenColor.slice(1, 3), 16),
                    parseInt(greenColor.slice(3, 5), 16),
                    parseInt(greenColor.slice(5, 7), 16),
                ];
                if (
                    colorDistance([sr, sg, sb], orange) <= 100 &&
                    orangeGroups.every(
                        ([ox, oy]) =>
                            Math.sqrt((x - ox) ** 2 + (y - oy) ** 2) >= 50,
                    )
                ) {
                    ctx.fillStyle = `#ff000080`;
                    ctx.beginPath();
                    ctx.arc(x, y, 20, 0, 360);
                    ctx.fill();
                    orangeGroups.push([x, y]);
                }
                if (
                    colorDistance([sr, sg, sb], green) <= 100 &&
                    greenGroups.every(
                        ([ox, oy]) =>
                            Math.sqrt((x - ox) ** 2 + (y - oy) ** 2) >= 50,
                    )
                ) {
                    ctx.fillStyle = `#0000ff80`;
                    ctx.beginPath();
                    ctx.arc(x, y, 20, 0, 360);
                    ctx.fill();
                    greenGroups.push([x, y]);
                }
            }
        }

        setOrangePoints(orangeGroups);
        setGreenPoints(greenGroups);
    }, [orangeColor, greenColor, cameraDataCanvas, cameraData]);

    const intervalRef = useRef(0);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            cameraDataCanvasRef.current?.toBlob(async (blob) => {
                const res = await fetch("http://localhost:5000/recognize", {
                    method: "POST",
                    body: blob,
                    headers: {
                        "content-type": "image/png",
                    },
                });
                if (res.ok) {
                    setRecog(await res.json());
                }
            });
        }, 1000) as any;
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <main className="w-screen h-screen relative">
            {cameraDataCanvas && (
                <div className="w-full h-full absolute">
                    <CameraVideo
                        setImageData={setCameraData}
                        canvas={cameraDataCanvas}
                    />
                </div>
            )}
            {cameraData && (
                <div className="w-full h-full absolute">
                    <canvas
                        ref={canvasRef}
                        width={cameraData.width}
                        height={cameraData.height}
                        className="object-contain h-full w-full -scale-x-100"
                    ></canvas>
                </div>
            )}
            <div className="w-full h-full absolute">
                <h1 className="text-center text-4xl font-bold p-4">
                    Food Fill 🍞
                </h1>
            </div>
            <div className="w-full h-full absolute flex justify-between">
                <div className="bg-white/50 w-96 h-full space-y-4 p-4">
                    <h2 className="text-center text-2xl font-bold">Current</h2>
                    <input
                        type="color"
                        value={orangeColor}
                        onChange={(event) => setOrangeColor(event.target.value)}
                    />
                    <input
                        type="color"
                        value={greenColor}
                        onChange={(event) => setGreenColor(event.target.value)}
                    />
                    <PointInfo
                        orangePoints={orangePoints}
                        greenPoints={greenPoints}
                    />
                    <h3 className="text-xl">Food recognized</h3>
                    <ul className="list-disc">
                        {recog.map((obj) => (
                            <li key={JSON.stringify(obj)}>
                                {obj.label}: {obj.score}
                            </li>
                        ))}
                    </ul>
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

function colorDistance(
    [ar, ag, ab]: [number, number, number],
    [br, bg, bb]: [number, number, number],
) {
    return Math.abs(ar - br) + Math.abs(ag - bg) + Math.abs(ab - bb);
}

function PointInfo({
    orangePoints,
    greenPoints,
}: {
    orangePoints: [number, number][];
    greenPoints: [number, number][];
}) {
    if (orangePoints.length !== 2 || greenPoints.length !== 1) {
        return (
            <div className="w-full h-36">
                Please ensure that the utensil points are in the video and that
                there are no extra points! Orange points: {orangePoints.length}{" "}
                (should be 2). Green points: {greenPoints.length} (should be 1)
            </div>
        );
    }
    const lower =
        orangePoints[0][1] < orangePoints[1][1]
            ? orangePoints[0]
            : orangePoints[1];
    const upper =
        orangePoints[0][1] < orangePoints[1][1]
            ? orangePoints[1]
            : orangePoints[0];
    const ang = Math.atan2(upper[1] - lower[1], upper[0] - lower[0]);
    const angDegrees = (ang / Math.PI) * 180;

    const angOk = Math.abs(angDegrees - 90) <= 20;

    let greenSlide = null;
    let extCm = null;
    let massG = null;
    if (greenPoints.length === 1) {
        const green = greenPoints[0];
        const dispVec = [upper[0] - lower[0], upper[1] - lower[1]];
        const lToG = [green[0] - lower[0], green[1] - lower[1]];
        greenSlide =
            (dispVec[0] * lToG[0] + dispVec[1] * lToG[1]) /
            (dispVec[0] * dispVec[0] + dispVec[1] * dispVec[1]);
        extCm = (greenSlide - 0.5) * 24;
        massG = 3.75 * extCm;
    }

    return (
        <div className="w-full flex flex-col">
            <p className="text-center">
                Angle:{" "}
                {angOk
                    ? `${Math.round(angDegrees)} degrees, ok`
                    : `${Math.round(angDegrees)} degrees, please get close to 90`}
            </p>
            <p>
                {extCm !== null
                    ? `${Math.round(extCm * 1000) / 1000} cm extension`
                    : "where is the green one"}
            </p>
            <p>
                {massG !== null
                    ? `${Math.round(massG)} g mass`
                    : "where is the green one"}
            </p>
            <div className="w-36 h-24 flex justify-center items-center">
                <div
                    className="w-24 h-4 relative"
                    style={{
                        transform: `rotate(-${ang}rad)`,
                    }}
                >
                    <div
                        className={twMerge(
                            "w-24 h-4 border border-black absolute",
                            angOk ? "bg-green-500" : "bg-red-500",
                        )}
                    ></div>
                    {greenSlide !== null && (
                        <div
                            className="w-4 h-4 bg-yellow-500"
                            style={{
                                transform: `translateX(calc(${1 - greenSlide} * 6rem))`,
                            }}
                        ></div>
                    )}
                </div>
            </div>
        </div>
    );
}

function proj(d: [number, number], x: [number, number]) {
    const coeff = (x[0] * d[0] + x[1] * d[1]) / (d[0] * d[0] + d[1] * d[1]);
    return [coeff * d[0], coeff * d[1]];
}

function CameraVideo({
    setImageData,
    canvas,
}: {
    setImageData: (data: ImageData | undefined) => void;
    canvas: HTMLCanvasElement;
}) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            videoRef.current!.srcObject = stream;
        });
    }, []);

    const drawCanvasRef = useRef(0);

    useEffect(() => {
        return () => {
            const cur = drawCanvasRef.current;
            if (cur !== 0) {
                cancelAnimationFrame(cur);
            }
        };
    }, []);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            className="object-contain h-full w-full -scale-x-100"
            onPlay={() => {
                canvas.width = videoRef.current!.videoWidth;
                canvas.height = videoRef.current!.videoHeight;
                const ctx = canvas.getContext("2d", {
                    willReadFrequently: true,
                });
                drawCanvasRef.current = requestAnimationFrame(
                    function animate() {
                        ctx?.drawImage(
                            videoRef.current!,
                            0,
                            0,
                            canvas.width,
                            canvas.height,
                        );
                        setImageData(
                            ctx?.getImageData(
                                0,
                                0,
                                canvas.width,
                                canvas.height,
                            ),
                        );
                        drawCanvasRef.current = requestAnimationFrame(animate);
                    },
                );
                console.log(videoRef.current!.videoWidth);
            }}
        ></video>
    );
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Etc/UTC",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
});

function Timer() {
    const startTimeRef = useRef(0);
    if (startTimeRef.current === 0) {
        startTimeRef.current = new Date().getTime();
    }
    const spanRef = useRef<HTMLElement | null>(null);

    const requestRef = useRef(0);
    useEffect(() => {
        requestRef.current = requestAnimationFrame(function animate() {
            const span = spanRef.current;
            if (span) {
                span.innerText = dateFormatter.format(
                    new Date().getTime() - startTimeRef.current,
                );
            }
            requestRef.current = requestAnimationFrame(animate);
        });
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return <span ref={spanRef}>00:00:00</span>;
}
