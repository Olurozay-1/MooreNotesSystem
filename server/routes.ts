import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { documents, tasks, youngPeople, hrActivities, users, timesheets } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import pkg from 'multer';
const { diskStorage } = pkg;
const upload = pkg({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Extend Express.User with our User type
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      role: string;
    }
  }
}

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Middleware to check if user is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated() && req.user) {
      return next();
    }
    res.status(401).send("Unauthorized");
  };

  // Middleware to check if user is a manager
  const requireManager = (req: any, res: any, next: any) => {
    if (req.isAuthenticated() && req.user && req.user.role?.toLowerCase() === "manager") {
      return next();
    }
    res.status(403).send("Forbidden");
  };

  // Documents API
  app.post("/api/documents", requireAuth, upload.single("file"), async (req, res) => {
    try {
      const { title, type } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).send("No file uploaded");
      }

      const [doc] = await db.insert(documents)
        .values({
          title,
          type,
          path: file.path,
          uploadedBy: req.user?.id
        })
        .returning();

      res.json(doc);
    } catch (error) {
      res.status(500).send("Error uploading document");
    }
  });

  app.get("/api/documents/:type", requireAuth, async (req, res) => {
    try {
      const docs = await db.select()
        .from(documents)
        .where(eq(documents.type, req.params.type));
      res.json(docs);
    } catch (error) {
      res.status(500).send("Error fetching documents");
    }
  });

  // Tasks API
  app.post("/api/tasks", requireAuth, async (req, res) => {
    try {
      const [task] = await db.insert(tasks)
        .values(req.body)
        .returning();
      res.json(task);
    } catch (error) {
      res.status(500).send("Error creating task");
    }
  });

  app.get("/api/tasks", requireAuth, async (req, res) => {
    try {
      const allTasks = await db.select().from(tasks);
      res.json(allTasks);
    } catch (error) {
      res.status(500).send("Error fetching tasks");
    }
  });

  // Users API
  app.get("/api/users", requireManager, async (req, res) => {
    try {
      const allUsers = await db.select({
        id: users.id,
        username: users.username,
        role: users.role
      }).from(users);
      res.json(allUsers);
    } catch (error) {
      res.status(500).send("Error fetching users");
    }
  });

  // Young People API
  app.post("/api/young-people", requireAuth, async (req, res) => {
    try {
      const [person] = await db.insert(youngPeople)
        .values(req.body)
        .returning();
      res.json(person);
    } catch (error) {
      res.status(500).send("Error creating record");
    }
  });

  app.get("/api/young-people", requireAuth, async (req, res) => {
    try {
      const people = await db.select().from(youngPeople);
      res.json(people);
    } catch (error) {
      res.status(500).send("Error fetching records");
    }
  });

  // Timesheets API
  app.post("/api/timesheets", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).send("User not authenticated");
      }

      const { shiftDate, timeIn, timeOut, isSleepIn, notes } = req.body;

      const [timesheet] = await db.insert(timesheets)
        .values({
          userId: req.user.id,
          shiftDate: new Date(shiftDate),
          timeIn: new Date(timeIn),
          timeOut: new Date(timeOut),
          isSleepIn: isSleepIn || false,
          notes,
          status: "pending"
        })
        .returning();

      res.json(timesheet);
    } catch (error: any) {
      console.error('Timesheet creation error:', error);
      res.status(500).send(`Error creating timesheet: ${error.message}`);
    }
  });

  app.get("/api/timesheets", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).send("User not authenticated");
      }

      const userTimesheets = await db.select()
        .from(timesheets)
        .where(eq(timesheets.userId, req.user.id))
        .orderBy(desc(timesheets.createdAt));

      res.json(userTimesheets);
    } catch (error: any) {
      console.error('Timesheet fetch error:', error);
      res.status(500).send(`Error fetching timesheets: ${error.message}`);
    }
  });

  // HR Activities API
  app.post("/api/hr-activities", requireManager, upload.single("document"), async (req, res) => {
    try {
      const file = req.file;
      const data = {
        ...req.body,
        documentPath: file?.path,
        createdBy: req.user?.id,
      };

      const [activity] = await db.insert(hrActivities)
        .values(data)
        .returning();

      res.json(activity);
    } catch (error) {
      res.status(500).send("Error creating HR activity");
    }
  });

  app.get("/api/hr-activities", requireAuth, async (req, res) => {
    try {
      const activities = await db
        .select({
          id: hrActivities.id,
          type: hrActivities.type,
          outcome: hrActivities.title,
          description: hrActivities.description,
          employee: users,
          status: hrActivities.status,
          scheduledDate: hrActivities.scheduledDate,
          documentPath: hrActivities.documentPath,
          createdAt: hrActivities.createdAt,
        })
        .from(hrActivities)
        .leftJoin(users, eq(hrActivities.employeeId, users.id))
        .orderBy(hrActivities.createdAt);

      res.json(activities);
    } catch (error) {
      res.status(500).send("Error fetching HR activities");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}