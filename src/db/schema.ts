import {
  integer,
  real,
  text,
  timestamp,
  pgTable,
  boolean,
  uuid, // Use uuid
} from "drizzle-orm/pg-core"; // Removed unused imports
import { sql } from "drizzle-orm";

// Table to store individual exercises
export const exercise = pgTable("exercise", {
  id: uuid("exercise_id").primaryKey().defaultRandom(), // Use uuid and defaultRandom()
  name: text("name").notNull().unique(),
  bodyPart: text("body_part"),
  category: text("category"),
  instructions: text("instructions"),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
});

// Table to store workout templates
export const workoutTemplate = pgTable("workout_template", {
  id: uuid("template_id").primaryKey().defaultRandom(), // Use uuid and defaultRandom()
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Junction table to link exercises to workout templates
export const templateExercise = pgTable("template_exercise", {
  id: uuid("template_exercise_id").primaryKey().defaultRandom(), // Use uuid and defaultRandom()
  templateId: uuid("template_id")
    .notNull()
    .references(() => workoutTemplate.id, { onDelete: "cascade" }),
  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => exercise.id, { onDelete: "cascade" }),
  // Potentially add fields here for exercise-specific settings within a template,
  // like default sets, reps, or weight if your app supports that
});

// Table to store actual completed workouts
export const workout = pgTable("workout", {
  id: uuid("workout_id").primaryKey().defaultRandom(), // Use uuid and defaultRandom()
  templateId: uuid("template_id").references(() => workoutTemplate.id, {
    onDelete: "set null",
  }),
  name: text("name"),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  durationSeconds: integer("duration_seconds"),
  totalVolumeKg: real("total_volume_kg"),
  prsAchieved: integer("prs_achieved").default(0).notNull(),
});

//-- Table to store exercises performed within a completed workout
export const workoutLogExercise = pgTable("workout_log_exercise", {
  id: uuid("workout_log_exercise_id").primaryKey().defaultRandom(), // Use uuid and defaultRandom()
  workoutId: uuid("workout_id")
    .notNull()
    .references(() => workout.id, { onDelete: "cascade" }),
  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => exercise.id, { onDelete: "cascade" }),
  orderInWorkout: integer("order_in_workout"),
});

//-- Table to store individual sets within an exercise in a completed workout
export const set = pgTable("set", {
  id: uuid("set_id").primaryKey().defaultRandom(), // Use uuid and defaultRandom()
  workoutLogExerciseId: uuid("workout_log_exercise_id")
    .notNull()
    .references(() => workoutLogExercise.id, {
      onDelete: "cascade",
    }),
  setNumber: integer("set_number").notNull(),
  weight: real("weight"),
  reps: integer("reps"),
  isCompleted: boolean("is_completed").default(false).notNull(),
  // Potentially add fields like RPE, rest time, etc.
});

// Table to store personal records for each exercise
export const personalRecord = pgTable("personal_record", {
  id: uuid("record_id").primaryKey().defaultRandom(), // Use uuid and defaultRandom()
  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => exercise.id, { onDelete: "cascade" }),
  recordType: text("record_type").notNull(),
  value: real("value").notNull(),
  dateAchieved: timestamp("date_achieved").notNull(),
  // Link to the specific set that achieved this record, if applicable
  setId: uuid("set_id").references(() => set.id, {
    onDelete: "set null",
  }),
});

// Table to store predicted personal records (based on calculations)
export const predictedRecord = pgTable("predicted_record", {
  predictedRecordId: uuid("predicted_record_id").primaryKey().defaultRandom(), // Use uuid and defaultRandom()
  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => exercise.id, { onDelete: "cascade" }),
  reps: integer("reps").notNull(),
  predictedWeight: real("predicted_weight").notNull(),
  calculationDate: timestamp("calculation_date").defaultNow().notNull(),
});

// Table to store last performed date for templates
export const templateLastPerformed = pgTable("template_last_performed", {
  templateId: uuid("template_id") // <<< Corrected to uuid()
    .primaryKey()
    .references(() => workoutTemplate.id, { onDelete: "cascade" }),
  lastPerformedAt: timestamp("last_performed_at"),
});
