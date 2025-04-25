import { eq } from "drizzle-orm";
import { exercise, templateExercise, workoutTemplate } from "../db/schema";
import { db } from "../db";
import { WorkoutTemplateWithExercises } from "../models/templates.model";

export const getWorkoutTemplates = async () => {
  const workoutTemplatesWithExercises = await db
    .select({
      id: workoutTemplate.id,
      templateName: workoutTemplate.name,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
    })
    .from(workoutTemplate)
    .leftJoin(
      templateExercise,
      eq(workoutTemplate.id, templateExercise.templateId),
    )
    .leftJoin(exercise, eq(templateExercise.exerciseId, exercise.id));

  const groupedResults: Record<string, WorkoutTemplateWithExercises> = {};

  workoutTemplatesWithExercises.forEach((row) => {
    if (!groupedResults[row.id]) {
      groupedResults[row.id] = {
        id: row.id,
        workoutName: row.templateName,
        exercises: [],
      };
    }
    if (row.exerciseId && row.exerciseName) {
      groupedResults[row.id].exercises.push({
        id: row.exerciseId,
        exerciseName: row.exerciseName,
      });
    }
  });

  return Object.values(groupedResults);
};
