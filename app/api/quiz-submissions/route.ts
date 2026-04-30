import { NextResponse } from "next/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

type SubmissionRequest = {
  answers?: Array<{
    questionId?: unknown;
    answerIndex?: unknown;
  }>;
  score?: unknown;
  quizVersion?: unknown;
};

export async function POST(request: Request) {
  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return new NextResponse(null, { status: 204 });
    }

    const body = (await request.json().catch(() => null)) as SubmissionRequest | null;
    if (!body || !Array.isArray(body.answers) || typeof body.score !== "number") {
      return new NextResponse(null, { status: 204 });
    }

    const answers = body.answers
      .filter(
        (answer) =>
          typeof answer?.questionId === "number" &&
          typeof answer?.answerIndex === "number",
      )
      .map((answer) => ({
        questionId: answer.questionId as number,
        answerIndex: answer.answerIndex as number,
      }));

    if (answers.length === 0) {
      return new NextResponse(null, { status: 204 });
    }

    await fetchMutation(
      api.quizSubmissions.submit,
      {
        submittedAt: Date.now(),
        score: body.score,
        quizVersion:
          typeof body.quizVersion === "string" ? body.quizVersion : "2026-04-30",
        answers,
      },
      { url: convexUrl },
    );
  } catch {
    // Logging must not affect the user flow for this one-off quiz.
  }

  return new NextResponse(null, { status: 204 });
}
