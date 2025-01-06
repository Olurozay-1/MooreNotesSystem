import { pgTable, text, serial, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  role: text("role", { enum: ["carer", "manager"] }).notNull().default("carer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const hrActivities = pgTable("hr_activities", {
  id: serial("id").primaryKey(),
  type: text("type", {
    enum: ["probation_review", "disciplinary", "supervision", "meeting"]
  }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  employeeId: integer("employee_id").notNull().references(() => users.id),
  status: text("status", {
    enum: ["pending", "completed", "cancelled"]
  }).notNull().default("pending"),
  scheduledDate: timestamp("scheduled_date"),
  documentPath: text("document_path"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  hrActivitiesAsEmployee: many(hrActivities, { relationName: "employeeActivities" }),
  hrActivitiesAsCreator: many(hrActivities, { relationName: "createdActivities" }),
}));

export const hrActivitiesRelations = relations(hrActivities, ({ one }) => ({
  employee: one(users, {
    fields: [hrActivities.employeeId],
    references: [users.id],
    relationName: "employeeActivities",
  }),
  creator: one(users, {
    fields: [hrActivities.createdBy],
    references: [users.id],
    relationName: "createdActivities",
  }),
}));

export const timesheets = pgTable("timesheets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  shiftDate: timestamp("shift_date").notNull(),
  timeIn: timestamp("time_in").notNull(),
  timeOut: timestamp("time_out").notNull(),
  isSleepIn: boolean("is_sleep_in").default(false),
  notes: text("notes"),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});


export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type", {
    enum: ["onboarding", "compliance", "training", "other"]
  }).notNull(),
  path: text("path").notNull(),
  reviewDate: timestamp("review_date"),
  notes: text("notes"),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  frequency: text("frequency", {
    enum: ["daily", "weekly", "monthly"]
  }).notNull(),
  assignedTo: integer("assigned_to").references(() => users.id),
  completed: boolean("completed").default(false),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const youngPeople = pgTable("young_people", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  notes: jsonb("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const insertHrActivitySchema = createInsertSchema(hrActivities);
export const selectHrActivitySchema = createSelectSchema(hrActivities);
export type HrActivity = typeof hrActivities.$inferSelect;
export type NewHrActivity = typeof hrActivities.$inferInsert;

export const insertTimesheetSchema = createInsertSchema(timesheets);
export const selectTimesheetSchema = createSelectSchema(timesheets);
export type Timesheet = typeof timesheets.$inferSelect;
export type NewTimesheet = typeof timesheets.$inferInsert;