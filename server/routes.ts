import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { documents, tasks, youngPeople } from "@db/schema";
import { eq } from "drizzle-orm";
import pkg from 'multer';
const { diskStorage } = pkg;
const upload = pkg({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Middleware to check if user is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send("Unauthorized");
  };

  // Middleware to check if user is a manager
  const requireManager = (req: any, res: any, next: any) => {
    if (req.isAuthenticated() && req.user.role === "manager") {
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
          uploadedBy: req.user.id
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

  const httpServer = createServer(app);
  return httpServer;
}