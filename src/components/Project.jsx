import { useState, useCallback } from "react";
import { WebcamCapture } from "./WebcamCapture";

export const Project = () => {
  const [fontSize, setFontSize] = useState(16);
  const [isRecording, setIsRecording] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [currentPrediction, setCurrentPrediction] = useState("");
  const [apiStatus, setApiStatus] = useState("checking");

  // Check if backend API is running
  const checkApiHealth = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        setApiStatus("connected");
      } else {
        setApiStatus("error");
      }
    } catch (error) {
      setApiStatus("error");
    }
  }, []);

  // Handle predictions from webcam
  const handlePrediction = useCallback((result) => {
    console.log('Received prediction:', result);
    if (result.prediction && result.prediction !== "No hand detected") {
      setCurrentPrediction(result.prediction);
      
      // Add to predictions list with timestamp
      const newPrediction = {
        text: result.prediction,
        timestamp: new Date().toLocaleTimeString(),
        confidence: result.confidence
      };
      
      setPredictions(prev => {
        const updated = [newPrediction, ...prev];
        return updated.slice(0, 50); // Keep last 50 predictions
      });
    } else {
      setCurrentPrediction("");
    }
  }, []);

  // Toggle recording
  const toggleRecording = useCallback(() => {
    if (!isRecording) {
      checkApiHealth();
    }
    setIsRecording(prev => !prev);
  }, [isRecording, checkApiHealth]);

  // Clear predictions
  const clearPredictions = useCallback(() => {
    setPredictions([]);
    setCurrentPrediction("");
  }, []);

  // Create translation text from predictions
  const translationText = predictions
    .map(p => p.text)
    .join(" ");

  return (
    <section
      id="project"
      className="min-h-screen flex flex-col items-center justify-center text-center text-black dark:text-white px-6"
    >
      <h1 className="text-6xl font-extrabold tracking-tight">Signify</h1>

      {/* API Status Indicator */}
      {apiStatus === "error" && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-lg">
          <p>⚠️ Backend API not running. Please start the Python server with: <code className="bg-red-200 dark:bg-red-800 px-1 rounded">python app.py</code></p>
        </div>
      )}
      
      {apiStatus === "connected" && (
        <div className="mt-4 p-2 bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-200 rounded-lg">
          <p>✅ Connected to Signify AI</p>
        </div>
      )}

      <div className="w-full flex items-start justify-center gap-16 mt-16">
        {/* webcam box */}
        <div className="flex flex-col items-center hover-feature">
          <div className="bg-white dark:bg-[#0f1218] text-black dark:text-white p-4 rounded-lg shadow-lg w-96 h-96 border-2 border-[#666A86] relative">
            <WebcamCapture 
              onPrediction={handlePrediction}
              isRecording={isRecording}
            />
            
            {/* Current prediction overlay */}
            {currentPrediction && isRecording && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-center">
                  <span className="text-lg font-bold">{currentPrediction}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 mt-4">
            <button 
              onClick={toggleRecording}
              className={`px-6 py-3 font-medium rounded-lg shadow transition-colors ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-[#788AA3] text-black dark:bg-[#33415c] dark:text-white hover:bg-[#666A86] dark:hover:opacity-90'
              }`}
              disabled={apiStatus === "checking"}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
            
            {predictions.length > 0 && (
              <button 
                onClick={clearPredictions}
                className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg shadow transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* translation box */}
        <div className="bg-white dark:bg-[#0f1218] text-black dark:text-white p-4 rounded-lg shadow-lg hover-feature w-96 h-96 flex flex-col border-2 border-[#666A86]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Translation</h3>
            <div className="flex gap-2">
              <button onClick={() => setFontSize(s => s + 2)} className="px-2 py-1 bg-[#788AA3] dark:bg-[#33415c] rounded hover:opacity-80"> + </button>
              <button onClick={() => setFontSize(s => Math.max(10, s - 2))} className="px-2 py-1 bg-[#788AA3] dark:bg-[#33415c] rounded hover:opacity-80"> - </button>
            </div>
          </div>
          
          <textarea
            value={translationText}
            onChange={(e) => {
              // Allow manual editing
              const words = e.target.value.split(" ");
              setPredictions(words.map((word, index) => ({
                text: word,
                timestamp: new Date().toLocaleTimeString(),
                confidence: "manual"
              })));
            }}
            style={{ fontSize: `${fontSize}px` }}
            className="flex-1 w-full resize-none overflow-auto bg-transparent text-black dark:text-white placeholder-black dark:placeholder-white outline-none"
            placeholder={isRecording ? "Translations will appear here..." : "Start recording to see sign language translations"}
          />
          
          {/* Prediction count */}
          {predictions.length > 0 && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {predictions.length} sign{predictions.length !== 1 ? 's' : ''} detected
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
