import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "No question provided" }, { status: 400 });
    }

    // Mock AI short tricks (Replace this with an actual AI API later)
    const shortTricks = [
      `Shortcut 1 for "${question}": Use estimation to simplify calculations.`,
      `Shortcut 2 for "${question}": Apply elimination method in multiple-choice questions.`,
      `Shortcut 3 for "${question}": Use Vedic Maths techniques.`,
    ];

    return NextResponse.json({ tricks: shortTricks }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error); // ✅ Logs the error to the console
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
