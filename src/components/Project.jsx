import { useState } from "react";

export const Project = () => {
  const [fontSize, setFontSize] = useState(16);
  return (
    <section
      id="project"
      className="min-h-screen flex flex-col items-center justify-center text-center text-black dark:text-white px-6"
    >
      <h1 className="text-6xl font-extrabold tracking-tight">Signify</h1>

      <div className="w-full flex items-start justify-center gap-16 mt-16 ">
        {/* webcam box */}
        <div className="flex flex-col items-center hover-feature">
          <div className="bg-white dark:bg-[#0f1218] text-black dark:text-white p-4 rounded-lg shadow-lg w-96 h-96 border-2 border-[#666A86]">
            <p className="text-lg">the webcam can go here</p>
          </div>
          <button className="mt-4 px-6 py-3 bg-[#788AA3] text-black dark:bg-[#33415c] dark:text-white font-medium rounded-lg shadow hover:bg-[#666A86] dark:hover:opacity-90 transition-colors">
            Start Recording
          </button>
        </div>

        {/* translation box */}
        <div className="bg-white dark:bg-[#0f1218] text-black dark:text-white p-4 rounded-lg shadow-lg hover-feature w-96 h-96 flex flex-col border-2 border-[#666A86]">
          <div className="flex justify-end gap-2 mb-2">
            <button onClick={() => setFontSize(s => s + 2)} className="px-2 py-1 bg-[#788AA3] dark:bg-[#33415c] rounded"> + </button>
            <button onClick={() => setFontSize(s => Math.max(10, s - 2))} className="px-2 py-1 bg-[#788AA3] dark:bg-[#33415c] rounded"> - </button>
          </div>
          <textarea
            style={{ fontSize: `${fontSize}px` }}
            className="flex-1 w-full resize-none overflow-auto bg-transparent text-black dark:text-white placeholder-black dark:placeholder-white outline-none"
            placeholder="placeholder for interpreted text"
          />
        </div>
      </div>
    </section>
  );
};
