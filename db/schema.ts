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

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type", { 
    enum: ["young_people", "hr", "business"] 
  }).notNull(),
  path: text("path").notNull(),
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

export const hrActivities = pgTable("hr_activities", {
  id: serial("id").primaryKey(),
  type: text("type", { 
    enum: ["probation_review", "disciplinary", "supervision", "meeting"] 
  }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  employeeId: integer("employee_id").references(() => users.id),
  status: text("status", {
    enum: ["pending", "completed", "cancelled"]
  }).notNull().default("pending"),
  scheduledDate: timestamp("scheduled_date"),
  documentPath: text("document_path"),
  createdBy: integer("created_by").references(() => users.id),
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