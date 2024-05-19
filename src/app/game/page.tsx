"use client";

import {
    BoundingBox,
    Detection,
    FilesetResolver,
    ObjectDetector,
    ObjectDetectorResult,
} from "@mediapipe/tasks-vision";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function Home() {
    return <HomeView />;
}

const disp = {
    apple: "🍎 Apple",
    orange: "🍊 Orange",
};

const cals = {
    apple: 0.6,
    orange: 0.4,
};

function HomeView() {
    const [cameraDataCanvas, setCameraDataCanvas] =
        useState<HTMLCanvasElement | null>(null);
    const cameraDataCanvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        const canvas = document.createElement("canvas");
        setCameraDataCanvas(canvas);
        cameraDataCanvasRef.current = canvas;
    }, []);

    const [cameraData, setCameraData] = useState<ImageData | undefined>();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // const [orangeColor, setOrangeColor] = useState("#f47624");
    // const [greenColor, setGreenColor] = useState("#12c2f5");
    const [orangeColor, setOrangeColor] = useState("#ff7500");
    const [greenColor, setGreenColor] = useState("#3aa6cd");

    const [orangePoints, setOrangePoints] = useState<[number, number][]>([]);
    const [greenPoints, setGreenPoints] = useState<[number, number][]>([]);

    const detectionRef = useRef<ObjectDetectorResult>({
        detections: [],
    });
    const [detection, setDetectionInner] = useState<ObjectDetectorResult>({
        detections: [],
    });
    const setDetection = (det: ObjectDetectorResult) => {
        setDetectionInner(det);
        detectionRef.current = det;
    };

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
            const r = cameraData.data[(y * width + width - x) * 4];
            const g = cameraData.data[(y * width + width - x) * 4 + 1];
            const b = cameraData.data[(y * width + width - x) * 4 + 2];
            return [r, g, b];
        };

        const parsedDets = detectionRef.current.detections
            .map(parseDetection)
            .filter((v) => v)
            .map((v) => v!);

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

                if (
                    parsedDets.some(
                        ({ boundingBox }) =>
                            boundingBox.originX - 25 <= x &&
                            x <= boundingBox.originX + boundingBox.width + 25 &&
                            boundingBox.originY - 25 <= y &&
                            y <= boundingBox.originY + boundingBox.height + 25,
                    )
                ) {
                    continue;
                }

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
                    colorDistance([sr, sg, sb], orange) <= 75 &&
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

        for (const det of detectionRef.current.detections) {
            const p = parseDetection(det);
            if (p) {
                if (p.cat === "apple") {
                    ctx.strokeStyle = "#ff2e2e";
                    ctx.strokeRect(
                        p.boundingBox.originX,
                        p.boundingBox.originY,
                        p.boundingBox.width,
                        p.boundingBox.height,
                    );
                } else if (p.cat === "orange") {
                    ctx.strokeStyle = "#e16200";
                    ctx.strokeRect(
                        p.boundingBox.originX,
                        p.boundingBox.originY,
                        p.boundingBox.width,
                        p.boundingBox.height,
                    );
                }
                ctx.strokeText(
                    disp[p.cat],
                    p.boundingBox.originX,
                    p.boundingBox.originY,
                );
            }
        }
    }, [orangeColor, greenColor, cameraDataCanvas, cameraData]);

    let detOne: { cat: "apple" | "orange" } | null = null;
    const parsedDets = detection.detections
        .map(parseDetection)
        .filter((v) => v)
        .map((v) => v!);
    if (parsedDets.length === 1) {
        detOne = parsedDets[0];
    }

    let data: Data = {
        orangeCount: orangePoints.length,
        greenCount: greenPoints.length,
        orange: null,
        green: null,
    };
    if (orangePoints.length === 2) {
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
        data.orange = {
            lower,
            upper,
            ang,
            angDegrees,
            angOk,
        };

        if (greenPoints.length === 1) {
            const green = greenPoints[0];
            const dispVec = [upper[0] - lower[0], upper[1] - lower[1]];
            const lToG = [green[0] - lower[0], green[1] - lower[1]];
            const greenSlide =
                (dispVec[0] * lToG[0] + dispVec[1] * lToG[1]) /
                (dispVec[0] * dispVec[0] + dispVec[1] * dispVec[1]);
            const extCm = (greenSlide - 0.5) * 24;
            const massG = Math.max(3.75 * extCm, 0);
            data.green = { greenSlide, extCm, massG };
        }
    }

    // const [lastFood, setLastFood] = useState("");
    const [lastMassG, setLastMassG] = useState(0);
    useEffect(() => {
        if (data.green?.massG) {
            setLastMassG(Math.round(data.green.massG));
        }
    }, [data]);
    const [lastFood, setLastFood] = useState<"apple" | "orange" | "">("");
    useEffect(() => {
        if (detOne) {
            setLastFood(detOne.cat);
        }
    }, [detOne]);

    const [items, setItems] = useState<
        { food: "apple" | "orange"; massG: number; cals: number }[]
    >([]);

    return (
        <main className="w-screen h-screen relative">
            {cameraDataCanvas && (
                <div className="w-full h-full absolute">
                    <CameraVideo
                        setImageData={setCameraData}
                        canvas={cameraDataCanvas}
                        setDetectionResult={setDetection}
                    />
                </div>
            )}
            {cameraData && (
                <div className="w-full h-full absolute">
                    <canvas
                        ref={canvasRef}
                        width={cameraData.width}
                        height={cameraData.height}
                        className="object-contain h-full w-full"
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
                    <PointInfo data={data} />
                    <h3 className="text-center text-xl">
                        Detections (MediaPipe)
                    </h3>
                    <ul className="list-disc list-inside">
                        {detection.detections
                            .map((det) =>
                                det.categories
                                    .map(
                                        (cat) =>
                                            `${cat.categoryName === "donut" ? "apple" : cat.categoryName} ${cat.score}`,
                                    )
                                    .join(","),
                            )
                            .map((v) => (
                                <li key={v}>{v}</li>
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
                    <div className="flex gap-2 items-center">
                        <button
                            className="px-4 py-2 rounded bg-blue-400 text-xl font-bold disabled:bg-gray-400"
                            disabled={!lastFood || !lastMassG}
                            onClick={() => {
                                if (!lastFood) return;
                                setItems([
                                    ...items,
                                    {
                                        food: lastFood,
                                        massG: lastMassG,
                                        cals: Math.round(
                                            cals[lastFood] * lastMassG,
                                        ),
                                    },
                                ]);
                            }}
                        >
                            Add
                        </button>
                        {lastFood && (
                            <p className="text-xl font-bold">
                                {disp[lastFood]}
                                {
                                    <>
                                        {" "}
                                        | {lastMassG} g |{" "}
                                        {Math.round(cals[lastFood] * lastMassG)}{" "}
                                        Cal
                                    </>
                                }
                            </p>
                        )}
                    </div>
                    <ul className="flex-grow">
                        {items.map((obj) => (
                            <>
                                <li
                                    className="p-4 flex justify-between gap-4"
                                    key={JSON.stringify(obj)}
                                >
                                    <h3 className="text-lg font-bold">
                                        {disp[obj.food]}
                                    </h3>
                                    <p>
                                        {obj.massG} g | {obj.cals} Cal
                                    </p>
                                </li>
                                <hr />
                            </>
                        ))}
                    </ul>
                    <hr />
                    <div className="flex justify-between">
                        <h3 className="text-xl font-bold">Total</h3>
                        <p className="text-xl font-bold">
                            {items
                                .map(({ massG }) => massG)
                                .reduce((a, b) => a + b, 0)}{" "}
                            g |{" "}
                            {items
                                .map(({ cals }) => cals)
                                .reduce((a, b) => a + b, 0)}{" "}
                            Cal
                        </p>
                    </div>
                    <button
                        // disabled={items.length === 0}
                        className="px-4 py-2 rounded bg-blue-400 text-xl font-bold disabled:bg-gray-400 w-full"
                        onClick={async () => {
                            const id = "6649fb043336782fe87c8652";
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
                            data.data.calorie = [
                                ...data.data.calorie,
                                items
                                    .map(({ cals }) => cals)
                                    .reduce((a, b) => a + b, 0),
                            ];
                            data.data.id = undefined;
                            data.data.score += 3;
                            const res = await fetch(
                                `https://us-west-2.aws.neurelo.com/rest/users/${id}`,
                                {
                                    method: "PATCH",
                                    headers: {
                                        "X-API-KEY":
                                            "neurelo_9wKFBp874Z5xFw6ZCfvhXdQI0n/IuXyaFnE2pRTKQKV1kIYj2NATYl+L0t52jsR3dHeN/1e+hI+j5Fc1Wh9ozkWhNZt7XhLhxhsp5rJn5oJKz54N2r0UA3Z1vYstHVYlb06mu90fZHBJI+axoLkdT7ooxhL9WN6TnK6qHPSFbrQijhkbTf35C7MeKwT1HOth_DKYSPo6Y4FGUXFdvVb3TcGHezJQ95M+jh9WG/Do6KVw=",
                                        "content-type": "application/json",
                                    },
                                    body: JSON.stringify(data.data),
                                },
                            );
                            console.log(res.status);
                        }}
                    >
                        Submit my calories!
                    </button>
                </div>
            </div>
        </main>
    );
}

function parseDetection(detection: Detection):
    | {
          cat: "apple" | "orange";
          boundingBox: BoundingBox;
      }
    | undefined {
    const cat = detection.categories.reduce((a, b) =>
        a.score >= b.score ? a : b,
    );

    if (cat.categoryName === "apple" || cat.categoryName === "donut") {
        // apparently apples look like donuts
        return {
            cat: "apple",
            boundingBox: detection.boundingBox!,
        };
    } else if (cat.categoryName === "orange") {
        return {
            cat: "orange",
            boundingBox: detection.boundingBox!,
        };
    }
}

type Data = {
    orangeCount: number;
    greenCount: number;
    orange: {
        lower: [number, number];
        upper: [number, number];
        ang: number;
        angDegrees: number;
        angOk: boolean;
    } | null;
    green: {
        greenSlide: number;
        extCm: number;
        massG: number;
    } | null;
};

function colorDistance(
    [ar, ag, ab]: [number, number, number],
    [br, bg, bb]: [number, number, number],
) {
    return Math.abs(ar - br) + Math.abs(ag - bg) + Math.abs(ab - bb);
}

function PointInfo({ data }: { data: Data }) {
    if (!data.orange) {
        return (
            <div className="w-full h-36">
                Please ensure that the utensil points are in the video and that
                there are no extra points! Orange points: {data.orangeCount}{" "}
                (should be 2). Blue points: {data.greenCount} (should be 1)
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col">
            <p className="text-center">
                Angle:{" "}
                {data.orange.angOk
                    ? `${Math.round(data.orange.angDegrees)} degrees, ok`
                    : `${Math.round(data.orange.angDegrees)} degrees, please get close to 90`}
            </p>
            {data.green && (
                <>
                    <p>
                        {data.green.extCm !== null
                            ? `${Math.round(data.green.extCm * 1000) / 1000} cm extension`
                            : "where is the green one"}
                    </p>
                    <p>
                        {data.green.massG !== null
                            ? `${Math.round(data.green.massG)} g mass`
                            : "where is the green one"}
                    </p>
                </>
            )}
            <div className="w-36 h-24 flex justify-center items-center">
                <div
                    className="w-24 h-4 relative"
                    style={{
                        transform: `rotate(${data.orange.ang}rad)`,
                    }}
                >
                    <div
                        className={twMerge(
                            "w-24 h-4 border border-black absolute",
                            data.orange.angOk ? "bg-green-500" : "bg-red-500",
                        )}
                    ></div>
                    {data.green && (
                        <div
                            className="w-4 h-4 bg-yellow-500"
                            style={{
                                transform: `translateX(calc(${data.green?.greenSlide} * 6rem))`,
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
    setDetectionResult,
    canvas,
}: {
    setImageData: (data: ImageData | undefined) => void;
    setDetectionResult: (res: ObjectDetectorResult) => void;
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
            onPlay={async () => {
                console.log(`onplay!`);
                canvas.width = videoRef.current!.videoWidth;
                canvas.height = videoRef.current!.videoHeight;
                const ctx = canvas.getContext("2d", {
                    willReadFrequently: true,
                });
                videoRef.current!.requestVideoFrameCallback(function frame() {
                    ctx?.drawImage(
                        videoRef.current!,
                        0,
                        0,
                        canvas.width,
                        canvas.height,
                    );
                    setImageData(
                        ctx?.getImageData(0, 0, canvas.width, canvas.height),
                    );
                    drawCanvasRef.current =
                        videoRef.current!.requestVideoFrameCallback(frame);
                });
                const vision = await FilesetResolver.forVisionTasks(
                    // path/to/wasm/root
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
                );
                const objectDetector = await ObjectDetector.createFromOptions(
                    vision,
                    {
                        baseOptions: {
                            modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/object_detector/efficientdet_lite0_uint8.tflite`,
                        },
                        scoreThreshold: 0.2,
                        runningMode: "VIDEO",
                    },
                );
                videoRef.current!.requestVideoFrameCallback(function frame() {
                    const res = objectDetector.detectForVideo(
                        videoRef.current!,
                        performance.now(),
                    );
                    for (const det of res.detections) {
                        if (det.boundingBox) {
                            det.boundingBox.originX =
                                canvas.width -
                                (det.boundingBox.originX +
                                    det.boundingBox.width);
                        }
                    }
                    setDetectionResult(res);
                    drawCanvasRef.current =
                        videoRef.current!.requestVideoFrameCallback(frame);
                });
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
