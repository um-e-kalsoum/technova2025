import { useRef, useEffect, useState, useCallback } from "react";

export const WebcamCapture = ({ onPrediction, isRecording }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const [error, setError] = useState(null);

  // start webcam when recording starts; stop when it stops
  useEffect(() => {
    let stopped = false;

    const start = async () => {
      try {
        setError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (stopped) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        const v = videoRef.current;
        if (v) {
          v.srcObject = stream;
          await v.play();
          console.log("[Webcam] playing", v.videoWidth, v.videoHeight);
        }
      } catch (e) {
        console.error("[Webcam] getUserMedia failed:", e);
        setError("Camera permission or device issue.");
      }
    };

    const stop = () => {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
    };

    if (isRecording) start(); else stop();

    return () => { stopped = true; stop(); };
  }, [isRecording]);

  const captureAndPredict = useCallback(async () => {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c || !isRecording) return;
    if (!v.videoWidth || !v.videoHeight) return;

    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, c.width, c.height);

    const imageData = c.toDataURL("image/jpeg", 0.6);
    try {
      console.log("[Predict] sending frame to /api/predict");
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });
      console.log("[Predict] status", res.status);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      console.log("[Predict] result", json);
      onPrediction?.(json);
    } catch (e) {
      console.error("[Predict] error", e);
      setError(`Prediction failed: ${e.message}`);
    }
  }, [isRecording, onPrediction]);

  // adjust this speed for how often it ids signs
  useEffect(() => {
    if (!isRecording) return;
    intervalRef.current = setInterval(captureAndPredict, 9000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRecording, captureAndPredict]);

  return (
    <div className="relative">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-lg border-2 border-[#666A86]" />
      <canvas ref={canvasRef} className="hidden" />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="bg-red-100 dark:bg-red-900 p-3 rounded text-sm">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};
