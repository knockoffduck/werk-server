import { db } from "../db";
import { exercise } from "../db/schema";

export const getExercises = async () => {
  const result = await db.select().from(exercise);

  if (!result) {
    throw new Error("No exercises found");
  }

  return result;
};
