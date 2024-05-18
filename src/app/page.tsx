"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import cv from "@techstark/opencv-js";

import simpleBlobDetector from "@/vision/simple-blob-detector";

export default function Home() {
    const [cameraDataCanvas, setCameraDataCanvas] =
        useState<HTMLCanvasElement | null>(null);
    useEffect(() => {
        setCameraDataCanvas(document.createElement("canvas"));
    }, []);
    const [cameraData, setCameraData] = useState<ImageData | undefined>();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [orangeColor, setOrangeColor] = useState("#F47624");

    const [orangePoints, setOrangePoints] = useState<[number, number][]>([]);
    const [greenPoints, setGreenPoints] = useState<[number, number][]>([]);

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

        // const image = cv.imread(cameraDataCanvas);
        // const blobs = simpleBlobDetector(image, {
        //     filterByColor: false,
        //     minThreshold: 30,
        //     // minRepeatability: 1,
        //     filterByArea: true,
        //     minArea: 100,
        //     maxArea: 10000,
        //     filterByInertia: false,
        //     filterByConvexity: true,
        //     minConvexity: 0.5,
        // });
        // console.log(blobs);
        const getData = (y: number, x: number) => {
            const r = cameraData.data[(y * width + x) * 4];
            const g = cameraData.data[(y * width + x) * 4 + 1];
            const b = cameraData.data[(y * width + x) * 4 + 2];
            return [r, g, b];
        };
        // for (const blob of blobs) {
        //     const [r, g, b] = getData(
        //         Math.floor(blob.pt.y),
        //         Math.floor(blob.pt.x),
        //     );
        //     ctx.fillStyle = `rgba(${r},${g},${b},1)`;
        //     // ctx.beginPath();
        //     // ctx.arc(blob.pt.x, blob.pt.y, blob.size, 0, 360);
        //     // ctx.fill();
        // }
        // console.log(
        // );

        // let minDist = Infinity;
        // let minX = -1;
        // let minY = -1;

        // const sobelX = [
        //     [1, 0, -1],
        //     [2, 0, -2],
        //     [1, 0, -1],
        // ];
        // const sobelY = [
        //     [1, 2, 1],
        //     [0, 0, 0],
        //     [-1, -2, -1],
        // ];

        // for (let y = 0; y < height; y++) {
        //     for (let x = 0; x < width; x++) {
        //         const [r, g, b] = getData(y, x);
        //         let sx = 0,
        //             sy = 0;
        //         for (let i = -1; i <= 1; i++) {
        //             for (let j = -1; j <= 1; j++) {
        //                 const y1 = y + i;
        //                 const x1 = x + j;
        //                 const [r1, g1, b1] =
        //                     0 <= y1 && y1 < height && 0 <= x1 && x1 < width
        //                         ? getData(y1, x1)
        //                         : [r, g, b];
        //                 sx +=
        //                     sobelX[1 + i][1 + j] *
        //                     Math.floor((r1 + g1 + b1) / 3);
        //                 sy +=
        //                     sobelY[1 + i][1 + j] *
        //                     Math.floor((r1 + g1 + b1) / 3);
        //             }
        //         }
        //         const s = Math.sqrt(sx ** 2 + sy ** 2);
        //         ctx.fillStyle = `rgb(${s},${s},${s})`;
        //         ctx.fillRect(x, y, 1, 1);
        //     }
        // }

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
                const orange: [number, number, number] = [244, 118, 36];
                const green: [number, number, number] = [0, 247, 171];
                if (
                    colorDistance([sr, sg, sb], orange) <= 50 &&
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
                    colorDistance([sr, sg, sb], green) <= 50 &&
                    greenGroups.every(
                        ([ox, oy]) =>
                            Math.sqrt((x - ox) ** 2 + (y - oy) ** 2) >= 50,
                    )
                ) {
                    ctx.fillStyle = `#00ff0080`;
                    ctx.beginPath();
                    ctx.arc(x, y, 20, 0, 360);
                    ctx.fill();
                    greenGroups.push([x, y]);
                }
            }
        }

        setOrangePoints(orangeGroups);
        setGreenPoints(greenGroups);
    }, [cameraDataCanvas, cameraData]);

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
                    <h2 className="text-center text-2xl font-bold">Logs</h2>
                    <PointInfo
                        orangePoints={orangePoints}
                        greenPoints={greenPoints}
                    />
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

function colorDistance(
    [ar, ag, ab]: [number, number, number],
    [br, bg, bb]: [number, number, number],
) {
    // return Math.min(
    //     255,
    //     Math.sqrt((ar - br) ** 2 + (ag - bg) ** 2 + (ab - bb) ** 2),
    // );

    // return Math.min(
    // 255,
    return Math.abs(ar - br) + Math.abs(ag - bg) + Math.abs(ab - bb);
    // );
}

function PointInfo({
    orangePoints,
    greenPoints,
}: {
    orangePoints: [number, number][];
    greenPoints: [number, number][];
}) {
    if (orangePoints.length !== 2) {
        return (
            <div className="w-full h-36">
                Please ensure that the utensil points are in the video and that
                there are no extra points! Orange points: {orangePoints.length}
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
    const ang = Math.atan2(upper[1] - lower[1], Math.abs(upper[0] - lower[0]));

    return (
        <div className="w-full">
            <div className="w-36 h-24">
                <div
                    className="w-12 h-2 border border-black"
                    style={{
                        transform: `rotate(-${ang}rad)`,
                    }}
                ></div>
            </div>
        </div>
    );
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
            // onTimeUpdate={() => console.log(new Date().getTime())}
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
