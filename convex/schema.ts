import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  quizSubmissions: defineTable({
    submittedAt: v.number(),
    score: v.number(),
    quizVersion: v.optional(v.string()),
    answers: v.array(
      v.object({
        questionId: v.number(),
        answerIndex: v.number(),
      }),
    ),
  }).index("by_submittedAt", ["submittedAt"]),
});
