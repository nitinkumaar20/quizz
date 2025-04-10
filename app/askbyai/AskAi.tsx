"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Tesseract from "tesseract.js";

const AIQuestionSolver = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const toggleWebcam = () => setShowWebcam(!showWebcam);

  const capture = () => {
    const imageSrc = (webcamRef.current as any).getScreenshot();
    setImage(imageSrc);
    processOCR(imageSrc);
    setShowWebcam(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        const base64 = reader.result.toString();
        setImage(base64);
        processOCR(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const processOCR = async (base64Image: string) => {
    setLoading(true);
    try {
      const result = await Tesseract.recognize(base64Image, "eng", {
        logger: (m) => console.log(m),
      });

      const text = result.data.text;
      setQuestionText(text.trim());
    } catch (err) {
      alert("Text extraction failed.");
      console.error("OCR ERROR:", err);
    }
    setLoading(false);
  };

  const getAnswers = async (question: string) => {
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }
  
    setLoading(true);
    const prompt = `
    You are an expert AI designed to help students prepare for government exams with time-saving techniques.
    
    Analyze the question below. Identify the subject (Math, Reasoning, English, GK, Hindi, Uttarakhand GK, Uttar Pradesh GK).
    
    - If it's **Math**, give  three fastest trick or method to solve it within 1 minute or max 2 minute.
    - If it's **Reasoning**, give  three sharp trick to solve it within 30 seconds or maximum 1 min.
    - If it's **theoretical** (English, GK, Hindi, etc.), give ONLY ONE factual answer in a single line.
    
Format:
- Each answer must be numbered like: 1., 2., 3.
- Each answer must appear on a new line.
- Add a blank line between each answer.
- Do NOT include subject name, explanation, or any extra text — just the direct answers.
    
    Question: "${question}"
    `;
    
    
    
  
    try {
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mistral-7b-instruct",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000", // update for prod
            "X-Title": "GovtQuizApp",
          },
        }
      );
  
      const text = res.data.choices[0].message.content;
      setAnswers([text.trim()]);
    } catch (err: any) {
      console.error("AI ERROR:", err.response?.data || err.message);
      alert(
        "AI response failed. " +
          (err.response?.data?.error?.message || err.message || "")
      );
    }
  
    setLoading(false);
  };
  

  return (
    <div className="p-4 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center">
        📘 Ask AI – Govt Exam Helper
      </h2>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Upload or Camera */}
        <div className="space-y-3 w-full">
          <button
            onClick={toggleWebcam}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {showWebcam ? "Close Camera" : "📷 Open Camera"}
          </button>

          {showWebcam && (
            <div className="space-y-2">
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
              <button
                onClick={capture}
                className="bg-indigo-600 text-white p-2 rounded w-full"
              >
                ✅ Capture Question
              </button>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
          />
        </div>

        {/* Manual Question */}
        <div className="w-full space-y-2">
          <textarea
            rows={5}
            placeholder="📝 Type your question here..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="border border-gray-300 rounded p-3 w-full"
          />
          <button
            onClick={() => getAnswers(questionText)}
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            ✨ Get Answers
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <p className="text-yellow-600">⏳ Processing...</p>}

      {/* Results */}
      {answers.length > 0 && (
  <div className="mt-6 space-y-2">
    <h3 className="text-xl font-semibold">✅ Easy Solution:</h3>
    <div className="bg-gray-100 border-l-4 border-green-500 p-3 rounded whitespace-pre-line">
      {answers[0]}
    </div>
  </div>
)}


    </div>
  );
};

export default AIQuestionSolver;
