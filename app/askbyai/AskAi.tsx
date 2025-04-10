"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Tesseract from "tesseract.js";

const AIQuestionSolver = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const toggleWebcam = () => setShowWebcam(!showWebcam);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      processOCR(imageSrc);
      setShowWebcam(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        const base64 = reader.result.toString();
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
    const cleanedQuestion = question.trim();
    if (!cleanedQuestion) {
      alert("Please enter a question.");
      return;
    }
  
    setLoading(true);
    const prompt = `
    You are a highly intelligent AI tutor for Indian government exam aspirants.
    
    Your tasks:
    1. Silently correct any spelling or grammar mistakes in the input.
    2. If a word has multiple meanings, always prefer **Indian exam-related historical or academic context** (not pop culture or Pokémon, etc.).
    3. Identify the subject based on the content.
    
    Subjects include:
    - Math (if calculations or numbers involved)
    - Reasoning (logic or patterns)
    - English, Hindi
    - GK, General Studies (History, Polity, Science, Geography, Economics)
    - Uttarakhand GK, UP GK
    
    Instructions:
    - For Math or Reasoning: Give 3 easy short tricks (numbered 1., 2., 3.) to solve the question in 1 minute or maximum 2 minute.
    - For theoretical questions: Give **only one short factual answer in one line**, without explanation or numbering.
    - Do not include commentary, any subject name or other thing, context, or extra lines.
    
    Correct and answer the following question:
    
    "${cleanedQuestion}"
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
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "GovtQuizApp",
          },
        }
      );
  
      const text = res.data.choices[0].message.content;
      setAnswers([text.trim()]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (axios.isAxiosError(err) && err.response) {
          console.error("AI ERROR:", err.response.data);
        } else {
          console.error("AI ERROR:", err.message);
        }
        alert(
          "AI response failed. " +
            ((axios.isAxiosError(err) && err.response?.data?.error?.message) || err.message || "")
        );
      } else {
        console.error("Unexpected error:", err);
        alert("An unexpected error occurred.");
      }
    }
  
    setLoading(false);
  };
  

  return (
    <div className="p-4 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center">
      Ask with AI 
      </h2>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
        {/* Upload or Camera */}
        <div className="space-y-3 w-full">
          <button
            onClick={toggleWebcam}
            className="bg-[--primary] text-white px-4 py-2 rounded w-full"
          >
            {showWebcam ? "Close Camera" : "📷 Open Camera"}
          </button>

          {showWebcam && (
            <div className="space-y-2">
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
              <button
                onClick={capture}
                className="bg-[--primary] text-white p-2 rounded w-full"
              >
                ✅ Capture Question 
              </button>
            </div>
          )}

<div className="w-full">
  <label className="block w-full ">
    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="block w-full text-sm text-gray-500
                 file:mr-4 file:py-2 file:px-4
                 file:rounded file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700
                 hover:file:bg-blue-100
               "
    />
  </label>
</div>

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
            className="bg-[--secondary] text-white px-4 py-2 rounded w-full"
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
          {/* <h3 className="text-xl font-semibold">✅ Easy Solution:</h3> */}
          <div className="bg-gray-100 border-l-4 border-[--secondary] p-3 rounded whitespace-pre-line">
            {answers[0]}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIQuestionSolver;
