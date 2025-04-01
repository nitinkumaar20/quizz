"use client";

import React, { useState } from "react";

const AskAi = () => {
  const [question, setQuestion] = useState("");
  const [tricks, setTricks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setTricks([]); // Clear previous tricks

    try {
      // ✅ FIXED API ROUTE (Ensure it's correct)
      const response = await fetch("/api/getShortTricks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      setTricks(data.tricks);
    } catch (err) {
      console.error("Error fetching tricks:", err); // ✅ Logs error to console
      setTricks(["Error fetching tricks. Try again!"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Ask AI for Short Tricks</h2>
      <input
        type="text"
        placeholder="Ask about Math, English, Reasoning..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-2 border rounded-lg mb-3"
      />
      <button
        onClick={handleAsk}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Get Short Tricks"}
      </button>

      {/* Show AI Answers */}
      {tricks.length > 0 && (
        <div className="mt-4 bg-gray-100 p-3 rounded-lg">
          <h3 className="font-semibold">Short Tricks:</h3>
          <ul className="list-disc ml-5">
            {tricks.map((trick, index) => (
              <li key={index}>{trick}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AskAi;
