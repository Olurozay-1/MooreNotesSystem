import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import {
  documents, tasks, youngPeople, hrActivities, users, timesheets,
  ypFolderDocuments, shiftLogs, helpSupportContacts
} from "@db/schema";
import { eq, desc, and } from "drizzle-orm";
import pkg from 'multer';
const { diskStorage } = pkg;
const upload = pkg({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Update document type enum
const documentTypes = ['insurance', 'finances', 'legal', 'home', 'other'] as const;
type DocumentType = typeof documentTypes[number];

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
  app.post("/api/documents", requireManager, upload.single("file"), async (req, res) => {
    try {
      const { title, category, reviewDate } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).send("No file uploaded");
      }

      const documentType = category.toLowerCase() as DocumentType;
      if (!documentTypes.includes(documentType)) {
        return res.status(400).send("Invalid document category");
      }

      const [doc] = await db.insert(documents)
        .values({
          title,
          type: documentType,
          path: file.path,
          reviewDate: reviewDate ? new Date(reviewDate) : null,
          uploadedBy: req.user?.id,
          createdAt: new Date()
        })
        .returning();

      res.json(doc);
    } catch (error) {
      console.error('Document upload error:', error);
      res.status(500).send("Error uploading document");
    }
  });

  app.get("/api/documents", requireManager, async (req, res) => {
    try {
      const docs = await db.select({
        id: documents.id,
        title: documents.title,
        category: documents.type,
        path: documents.path,
        reviewDate: documents.reviewDate,
        createdAt: documents.createdAt,
        uploadedBy: documents.uploadedBy
      })
        .from(documents)
        .orderBy(desc(documents.createdAt));

      res.json(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).send("Error fetching documents");
    }
  });

  app.get("/api/documents/:type", requireAuth, async (req, res) => {
    try {
      const type = req.params.type.toLowerCase() as DocumentType;
      if (!documentTypes.includes(type)) {
        return res.status(400).send("Invalid document type");
      }

      const docs = await db.select()
        .from(documents)
        .where(eq(documents.type, type));
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
  app.post("/api/young-people", requireManager, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).send("User not authenticated");
      }

      const {
        name,
        dateOfBirth,
        dateAdmitted,
        gender,
        localAuthority,
        allergies,
        conditions,
        notes
      } = req.body;

      const [person] = await db.insert(youngPeople)
        .values({
          name,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          dateAdmitted: dateAdmitted ? new Date(dateAdmitted) : null,
          gender,
          localAuthority,
          allergies,
          notes,
          createdBy: req.user.id,
          createdAt: new Date()
        })
        .returning();

      res.json(person);
    } catch (error: any) {
      console.error('Error creating young person:', error);
      res.status(500).send(`Error creating record: ${error.message}`);
    }
  });

  app.get("/api/young-people", requireAuth, async (req, res) => {
    try {
      const people = await db.select().from(youngPeople);
      res.json(people);
    } catch (error: any) {
      console.error('Error fetching young people:', error);
      res.status(500).send(`Error fetching records: ${error.message}`);
    }
  });

  app.get("/api/young-people/:id", requireAuth, async (req, res) => {
    try {
      const [person] = await db
        .select()
        .from(youngPeople)
        .where(eq(youngPeople.id, parseInt(req.params.id)))
        .limit(1);

      if (!person) {
        return res.status(404).send("Young person not found");
      }

      res.json(person);
    } catch (error: any) {
      console.error('Error fetching young person:', error);
      res.status(500).send(`Error fetching record: ${error.message}`);
    }
  });

  app.patch("/api/young-people/:id", requireAuth, async (req, res) => {
    try {
      const [person] = await db
        .update(youngPeople)
        .set(req.body)
        .where(eq(youngPeople.id, parseInt(req.params.id)))
        .returning();

      if (!person) {
        return res.status(404).send("Young person not found");
      }

      res.json(person);
    } catch (error: any) {
      console.error('Error updating young person:', error);
      res.status(500).send(`Error updating record: ${error.message}`);
    }
  });

  // YP Folder Documents API
  app.post("/api/yp-folder/:id/documents", requireAuth, upload.single("file"), async (req, res) => {
    try {
      if (!req.user || !req.file) {
        return res.status(400).send("Missing required data");
      }

      const { title, category } = req.body;
      const youngPersonId = parseInt(req.params.id);

      const [doc] = await db.insert(ypFolderDocuments)
        .values({
          youngPersonId,
          title,
          category,
          path: req.file.path,
          uploadedBy: req.user.id,
          createdAt: new Date()
        })
        .returning();

      res.json(doc);
    } catch (error: any) {
      console.error('Error uploading document:', error);
      res.status(500).send(`Error uploading document: ${error.message}`);
    }
  });

  app.get("/api/yp-folder/:id/documents", requireAuth, async (req, res) => {
    try {
      const docs = await db
        .select()
        .from(ypFolderDocuments)
        .where(eq(ypFolderDocuments.youngPersonId, parseInt(req.params.id)));

      res.json(docs);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      res.status(500).send(`Error fetching documents: ${error.message}`);
    }
  });

  // Shift Logs API
  app.post("/api/shift-logs", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).send("User not authenticated");
      }

      const [log] = await db.insert(shiftLogs)
        .values({
          ...req.body,
          youngPersonId: 1, // TODO: Replace with actual young person ID from frontend
          carerId: req.user.id,
          shiftDate: new Date(req.body.shiftDate),
          createdAt: new Date()
        })
        .returning();

      res.json(log);
    } catch (error: any) {
      console.error('Error creating shift log:', error);
      res.status(500).send(`Error creating shift log: ${error.message}`);
    }
  });

  app.get("/api/shift-logs", requireAuth, async (req, res) => {
    try {
      const logs = await db
        .select({
          id: shiftLogs.id,
          content: shiftLogs.content,
          logType: shiftLogs.logType,
          shiftType: shiftLogs.shiftType,
          concerns: shiftLogs.concerns,
          shiftDate: shiftLogs.shiftDate,
          createdAt: shiftLogs.createdAt,
        })
        .from(shiftLogs)
        .orderBy(desc(shiftLogs.createdAt))
        .limit(10);

      res.json(logs);
    } catch (error: any) {
      console.error('Error fetching shift logs:', error);
      res.status(500).send(`Error fetching shift logs: ${error.message}`);
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

  app.patch("/api/timesheets/:id", requireManager, async (req, res) => {
    try {
      const { status } = req.body;
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).send("Invalid status");
      }

      const [timesheet] = await db
        .update(timesheets)
        .set({ status })
        .where(eq(timesheets.id, parseInt(req.params.id)))
        .returning();

      if (!timesheet) {
        return res.status(404).send("Timesheet not found");
      }

      res.json(timesheet);
    } catch (error) {
      console.error('Error updating timesheet:', error);
      res.status(500).send("Error updating timesheet");
    }
  });

  // HR Activities API
  app.post("/api/hr-activities", requireManager, upload.single("document"), async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).send("User not authenticated");
      }

      const { type, employeeId, description, scheduledDate } = req.body;
      const outcome = req.body.outcome || req.body.title;

      if (!type || !employeeId || !outcome || !scheduledDate) {
        return res.status(400).send("Missing required fields");
      }

      const [employee] = await db
        .select()
        .from(users)
        .where(eq(users.id, parseInt(employeeId)))
        .limit(1);

      if (!employee) {
        return res.status(400).send("Invalid employee ID");
      }

      const [activity] = await db.insert(hrActivities)
        .values([{
          type,
          title: outcome,
          description,
          employeeId: parseInt(employeeId),
          scheduledDate: new Date(scheduledDate),
          documentPath: req.file?.path,
          createdBy: req.user.id,
          status: "pending"
        }])
        .returning();

      res.json(activity);
    } catch (error: any) {
      console.error('HR activity creation error:', error);
      res.status(500).send(`Error creating HR activity: ${error.message}`);
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

  // Help Support Contacts API
  app.post("/api/help-support-contacts", requireManager, async (req, res) => {
    try {
      const { name, role, phone, email, website } = req.body;

      const [contact] = await db.insert(helpSupportContacts)
        .values({
          name,
          role,
          phone,
          email,
          website,
          createdBy: req.user?.id,
        })
        .returning();

      res.json(contact);
    } catch (error) {
      console.error('Error creating help support contact:', error);
      res.status(500).send("Error creating help support contact");
    }
  });

  app.get("/api/help-support-contacts", requireAuth, async (req, res) => {
    try {
      const contacts = await db.select().from(helpSupportContacts);
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching help support contacts:', error);
      res.status(500).send("Error fetching help support contacts");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}