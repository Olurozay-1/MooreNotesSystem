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
  gender: text("gender"),
  phoneNumber: text("phone_number"),
  roomNumber: text("room_number"),
  dateAdmitted: timestamp("date_admitted"),
  careStatus: text("care_status"),
  localAuthority: text("local_authority"),
  allergies: text("allergies"),
  conditions: text("conditions"),
  medications: text("medications"),
  dietaryRequirements: text("dietary_requirements"),
  notes: jsonb("notes"),
  recentIncidents: text("recent_incidents"),
  missingPersonReports: text("missing_person_reports"),

  // Next of Kin Details
  nextOfKinName: text("next_of_kin_name"),
  nextOfKinPhone: text("next_of_kin_phone"),
  nextOfKinEmail: text("next_of_kin_email"),

  // Social Worker Details
  socialWorkerName: text("social_worker_name"),
  socialWorkerPhone: text("social_worker_phone"),
  socialWorkerEmail: text("social_worker_email"),

  // School Details
  schoolName: text("school_name"),
  schoolContact: text("school_contact"),
  schoolPhone: text("school_phone"),
  schoolEmail: text("school_email"),
  schoolDays: text("school_days"),

  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
});

export const ypFolderDocuments = pgTable("yp_folder_documents", {
  id: serial("id").primaryKey(),
  youngPersonId: integer("young_person_id").notNull().references(() => youngPeople.id),
  title: text("title").notNull(),
  category: text("category", {
    enum: ["Health & Wellbeing", "Financial", "Agreements", "Education", "Care Plans", "Risk Assessments"]
  }).notNull(),
  path: text("path").notNull(),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shiftLogs = pgTable("shift_logs", {
  id: serial("id").primaryKey(),
  youngPersonId: integer("young_person_id").notNull().references(() => youngPeople.id),
  carerId: integer("carer_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  shiftType: text("shift_type", {
    enum: ["Morning", "Afternoon", "Night"]
  }).notNull(),
  logType: text("log_type", {
    enum: ["Daily Log", "Grumbles log", "Takeaway Log", "Reported Missing", "Found"]
  }).notNull(),
  concerns: text("concerns"),
  mood: text("mood"),
  activities: text("activities"),
  incidents: text("incidents"),
  medications: text("medications"),
  shiftDate: timestamp("shift_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const youngPeopleRelations = relations(youngPeople, ({ many, one }) => ({
  documents: many(ypFolderDocuments),
  shiftLogs: many(shiftLogs),
  creator: one(users, {
    fields: [youngPeople.createdBy],
    references: [users.id],
  }),
}));

export const ypFolderDocumentsRelations = relations(ypFolderDocuments, ({ one }) => ({
  youngPerson: one(youngPeople, {
    fields: [ypFolderDocuments.youngPersonId],
    references: [youngPeople.id],
  }),
  uploader: one(users, {
    fields: [ypFolderDocuments.uploadedBy],
    references: [users.id],
  }),
}));

export const shiftLogsRelations = relations(shiftLogs, ({ one }) => ({
  youngPerson: one(youngPeople, {
    fields: [shiftLogs.youngPersonId],
    references: [youngPeople.id],
  }),
  carer: one(users, {
    fields: [shiftLogs.carerId],
    references: [users.id],
  }),
}));

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

export const insertYoungPersonSchema = createInsertSchema(youngPeople);
export const selectYoungPersonSchema = createSelectSchema(youngPeople);
export type YoungPerson = typeof youngPeople.$inferSelect;
export type NewYoungPerson = typeof youngPeople.$inferInsert;

export const insertShiftLogSchema = createInsertSchema(shiftLogs);
export const selectShiftLogSchema = createSelectSchema(shiftLogs);
export type ShiftLog = typeof shiftLogs.$inferSelect;
export type NewShiftLog = typeof shiftLogs.$inferInsert;

export const insertYPFolderDocumentSchema = createInsertSchema(ypFolderDocuments);
export const selectYPFolderDocumentSchema = createSelectSchema(ypFolderDocuments);
export type YPFolderDocument = typeof ypFolderDocuments.$inferSelect;
export type NewYPFolderDocument = typeof ypFolderDocuments.$inferInsert;