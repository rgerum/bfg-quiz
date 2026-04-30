import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const answerValidator = v.object({
  questionId: v.number(),
  answerIndex: v.number(),
});

export const submit = mutation({
  args: {
    submittedAt: v.number(),
    score: v.number(),
    quizVersion: v.optional(v.string()),
    answers: v.array(answerValidator),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("quizSubmissions", args);
    return null;
  },
});

export const answerCounts = query({
  args: {},
  returns: v.object({
    totalSubmissions: v.number(),
    questions: v.array(
      v.object({
        questionId: v.number(),
        answers: v.array(
          v.object({
            answerIndex: v.number(),
            count: v.number(),
          }),
        ),
      }),
    ),
  }),
  handler: async (ctx) => {
    const submissions = await ctx.db.query("quizSubmissions").collect();
    const counts = new Map<number, Map<number, number>>();

    for (const submission of submissions) {
      for (const answer of submission.answers) {
        const questionCounts =
          counts.get(answer.questionId) ?? new Map<number, number>();
        questionCounts.set(
          answer.answerIndex,
          (questionCounts.get(answer.answerIndex) ?? 0) + 1,
        );
        counts.set(answer.questionId, questionCounts);
      }
    }

    const questions = [...counts.entries()]
      .sort(([a], [b]) => a - b)
      .map(([questionId, answerCounts]) => ({
        questionId,
        answers: [...answerCounts.entries()]
          .sort(([a], [b]) => a - b)
          .map(([answerIndex, count]) => ({
            answerIndex,
            count,
          })),
      }));

    return {
      totalSubmissions: submissions.length,
      questions,
    };
  },
});
