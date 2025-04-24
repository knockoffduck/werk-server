import {
  integer,
  real,
  text,
  timestamp, // Use 'timestamp' for PostgreSQL dates/times
  pgTable, // Use 'pgTable' for PostgreSQL
  foreignKey,
  unique,
  primaryKey,
  boolean,
  serial, // Common for auto-incrementing integers in PostgreSQL
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Table to store individual exercises
export const exercise = pgTable("exercise", {
  exerciseId: serial("exercise_id").primaryKey(), // Use serial for auto-incrementing
  name: text("name").notNull().unique(),
  bodyPart: text("body_part"),
  category: text("category"),
  instructions: text("instructions"),
  imageUrl: text("image_url"), // URL or path to exercise image
  videoUrl: text("video_url"), // URL or path to exercise video
});

// Table to store workout templates
export const workoutTemplate = pgTable("workout_template", {
  templateId: serial("template_id").primaryKey(), // Use serial for auto-incrementing
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(), // Use timestamp and defaultNow()
});

// Junction table to link exercises to workout templates
export const templateExercise = pgTable("template_exercise", {
  templateExerciseId: serial("template_exercise_id").primaryKey(), // Use serial
  templateId: integer("template_id")
    .notNull()
    .references(() => workoutTemplate.templateId, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercise.exerciseId, { onDelete: "cascade" }),
  // Potentially add fields here for exercise-specific settings within a template,
  // like default sets, reps, or weight if your app supports that
});

// Table to store actual completed workouts
export const workout = pgTable("workout", {
  workoutId: serial("workout_id").primaryKey(), // Use serial
  templateId: integer("template_id").references(
    () => workoutTemplate.templateId,
    { onDelete: "set null" },
  ), // Or 'cascade'
  name: text("name"), // Can be based on the template name or custom
  startTime: timestamp("start_time").defaultNow().notNull(), // Use timestamp and defaultNow()
  endTime: timestamp("end_time"),
  durationSeconds: integer("duration_seconds"),
  totalVolumeKg: real("total_volume_kg"), // Or use the appropriate unit
  prsAchieved: integer("prs_achieved").default(0).notNull(),
});

//-- Table to store exercises performed within a completed workout
export const workoutLogExercise = pgTable("workout_log_exercise", {
  workoutLogExerciseId: serial("workout_log_exercise_id").primaryKey(), // Use serial
  workoutId: integer("workout_id")
    .notNull()
    .references(() => workout.workoutId, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercise.exerciseId, { onDelete: "cascade" }),
  orderInWorkout: integer("order_in_workout"), // To maintain the order of exercises in a workout
});

//-- Table to store individual sets within an exercise in a completed workout
export const set = pgTable("set", {
  setId: serial("set_id").primaryKey(), // Use serial
  workoutLogExerciseId: integer("workout_log_exercise_id")
    .notNull()
    .references(() => workoutLogExercise.workoutLogExerciseId, {
      onDelete: "cascade",
    }),
  setNumber: integer("set_number").notNull(),
  weight: real("weight"), // Or use the appropriate unit (kg in the screenshot)
  reps: integer("reps"),
  isCompleted: boolean("is_completed").default(false).notNull(),
  // Potentially add fields like RPE, rest time, etc.
});

// Table to store personal records for each exercise
export const personalRecord = pgTable("personal_record", {
  recordId: serial("record_id").primaryKey(), // Use serial
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercise.exerciseId, { onDelete: "cascade" }),
  recordType: text("record_type").notNull(), // e.g., '1RM', 'Weight', 'Max Volume', 'Reps'
  value: real("value").notNull(), // Store the value of the record
  dateAchieved: timestamp("date_achieved").notNull(), // Use timestamp
  // Link to the specific set that achieved this record, if applicable
  setId: integer("set_id").references(() => set.setId, {
    onDelete: "set null",
  }), // Or 'cascade'
});

// Table to store predicted personal records (based on calculations)
export const predictedRecord = pgTable("predicted_record", {
  predictedRecordId: serial("predicted_record_id").primaryKey(), // Use serial
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercise.exerciseId, { onDelete: "cascade" }),
  reps: integer("reps").notNull(), // For which number of reps the prediction is made
  predictedWeight: real("predicted_weight").notNull(), // The predicted weight
  calculationDate: timestamp("calculation_date").defaultNow().notNull(), // Use timestamp and defaultNow()
});

// Table to store last performed date for templates
// This could also be calculated from the Workouts table, but a dedicated table
// might make querying for the last performed date easier.
export const templateLastPerformed = pgTable("template_last_performed", {
  templateId: integer("template_id")
    .primaryKey()
    .references(() => workoutTemplate.templateId, { onDelete: "cascade" }),
  lastPerformedAt: timestamp("last_performed_at"), // Use timestamp
});
