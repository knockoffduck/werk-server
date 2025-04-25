import { eq } from "drizzle-orm";
import { exercise, templateExercise, workoutTemplate } from "../db/schema";
import { db } from "../db";
import { WorkoutTemplateWithExercises } from "../models/templates.model";

export const getWorkoutTemplates = async () => {
  const workoutTemplatesWithExercises = await db
    .select({
      workoutTemplateId: workoutTemplate.templateId,
      templateName: workoutTemplate.name,
      exerciseId: exercise.exerciseId,
      exerciseName: exercise.name,
    })
    .from(workoutTemplate)
    .leftJoin(
      templateExercise,
      eq(workoutTemplate.templateId, templateExercise.templateId),
    )
    .leftJoin(exercise, eq(templateExercise.exerciseId, exercise.exerciseId));

  const groupedResults: Record<number, WorkoutTemplateWithExercises> = {};

  workoutTemplatesWithExercises.forEach((row) => {
    if (!groupedResults[row.workoutTemplateId]) {
      groupedResults[row.workoutTemplateId] = {
        workoutTemplateId: row.workoutTemplateId,
        workoutName: row.templateName,
        exercises: [],
      };
    }
    if (row.exerciseId && row.exerciseName) {
      groupedResults[row.workoutTemplateId].exercises.push({
        exerciseId: row.exerciseId,
        exerciseName: row.exerciseName,
      });
    }
  });

  return Object.values(groupedResults);
};
