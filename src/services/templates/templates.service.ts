import { eq, or } from "drizzle-orm";
import { db } from "../../db";
import { exercise, templateExercise, workoutTemplate } from "../../db/schema";

interface WorkoutTemplateWithExercises {
  workoutTemplateId: string;
  workoutName: string;
  exercises: { exerciseId: string; exerciseName: string }[];
}

export const getWorkoutTemplates = async () => {
  const workoutTemplatesWithExercises = await db
    .select({
      workoutTemplateId: workoutTemplate.id,
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
