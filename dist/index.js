// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/db.ts
import { Pool } from "pg";
var PostgreSQLConnection = class {
  pool;
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
    });
  }
  async execute(query, params = []) {
    try {
      let paramIndex = 1;
      const pgQuery = query.replace(/\?/g, () => `$${paramIndex++}`);
      console.log("Executing PostgreSQL query:", pgQuery, "with params:", params);
      const result = await this.pool.query(pgQuery, params);
      const mysqlResult = result.rows;
      if (result.rows.length > 0) {
        mysqlResult.insertId = result.rows[0]?.id;
      }
      mysqlResult.affectedRows = result.rowCount || 0;
      return [mysqlResult, []];
    } catch (error) {
      console.error("PostgreSQL query error:", error);
      console.error("Query:", query);
      console.error("Params:", params);
      throw error;
    }
  }
  async close() {
    await this.pool.end();
  }
};
var connection;
async function initializeDatabase() {
  if (!connection) {
    connection = new PostgreSQLConnection();
    console.log("PostgreSQL connection initialized for \u0418\u0440\u0413\u0423\u041F\u0421 system");
  }
  return connection;
}
async function getConnection() {
  if (!connection) {
    await initializeDatabase();
  }
  return connection;
}

// server/storage.ts
var DatabaseStorage = class {
  async getUser(id) {
    try {
      console.log("Getting user with ID:", id);
      const pool = await getConnection();
      console.log("Pool connection established");
      const [rows] = await pool.execute(
        "SELECT * FROM Users WHERE id = ?",
        [id]
      );
      console.log("Query executed, rows:", rows);
      return rows[0] || void 0;
    } catch (error) {
      console.error("Error in getUser:", error);
      throw error;
    }
  }
  async getUserByEmail(email) {
    const pool = await getConnection();
    const [rows] = await pool.execute(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );
    return rows[0] || void 0;
  }
  async createUser(userData) {
    const pool = await getConnection();
    const [result] = await pool.execute(
      "INSERT INTO Users (firstname, lastname, email, phone, registrationdate) VALUES (?, ?, ?, ?, NOW()) RETURNING *",
      [userData.firstName, userData.lastName, userData.email, userData.phone]
    );
    return result[0];
  }
  async updateUser(id, userData) {
    const pool = await getConnection();
    const fields = [];
    const values = [];
    if (userData.firstName) {
      fields.push("firstname = ?");
      values.push(userData.firstName);
    }
    if (userData.lastName) {
      fields.push("lastname = ?");
      values.push(userData.lastName);
    }
    if (userData.email) {
      fields.push("email = ?");
      values.push(userData.email);
    }
    if (userData.phone) {
      fields.push("phone = ?");
      values.push(userData.phone);
    }
    if (fields.length === 0) {
      throw new Error("\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F");
    }
    values.push(id);
    const [result] = await pool.execute(
      `UPDATE Users SET ${fields.join(", ")} WHERE id = ? RETURNING *`,
      values
    );
    return result[0];
  }
  async getUserAchievements(userId) {
    const pool = await getConnection();
    const [rows] = await pool.execute(`
      SELECT ua.*, a.title, a.description, a.category, l.name as level_name, 
             t.name as type_name, ua.points, ua.status
      FROM UserAchievements ua
      JOIN Achievements a ON ua.achievementid = a.id
      LEFT JOIN Levels l ON a.levelid = l.id
      LEFT JOIN TypesOfAchievements t ON a.typeid = t.id
      WHERE ua.userid = ?
      ORDER BY ua.dateearned DESC
    `, [userId]);
    return rows;
  }
  async getAchievement(id) {
    const pool = await getConnection();
    const [rows] = await pool.execute(
      "SELECT * FROM Achievements WHERE id = ?",
      [id]
    );
    return rows[0] || void 0;
  }
  async createUserAchievement(userAchievementData) {
    const pool = await getConnection();
    const [result] = await pool.execute(`
      INSERT INTO UserAchievements (userid, achievementid, dateearned, points, status, description, documentpath)
      VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *
    `, [
      userAchievementData.userId,
      userAchievementData.achievementId,
      userAchievementData.dateEarned,
      userAchievementData.points,
      userAchievementData.status || "Pending",
      userAchievementData.description,
      userAchievementData.documentPath
    ]);
    return result[0];
  }
  async updateUserAchievement(id, userAchievementData) {
    const pool = await getConnection();
    const fields = [];
    const values = [];
    if (userAchievementData.status) {
      fields.push("status = ?");
      values.push(userAchievementData.status);
    }
    if (userAchievementData.points) {
      fields.push("points = ?");
      values.push(userAchievementData.points);
    }
    if (userAchievementData.description) {
      fields.push("description = ?");
      values.push(userAchievementData.description);
    }
    if (fields.length === 0) {
      throw new Error("\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F");
    }
    values.push(id);
    const [result] = await pool.execute(
      `UPDATE UserAchievements SET ${fields.join(", ")} WHERE id = ? RETURNING *`,
      values
    );
    return result[0];
  }
  async deleteUserAchievement(id) {
    const pool = await getConnection();
    const [result] = await pool.execute(
      "DELETE FROM UserAchievements WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
  async getAllAchievements() {
    const pool = await getConnection();
    const [rows] = await pool.execute(`
      SELECT a.*, l.name as level_name, t.name as type_name
      FROM Achievements a
      LEFT JOIN Levels l ON a.levelid = l.id
      LEFT JOIN TypesOfAchievements t ON a.typeid = t.id
      ORDER BY a.title
    `);
    return rows;
  }
  async getLevels() {
    const pool = await getConnection();
    const [rows] = await pool.execute("SELECT * FROM Levels ORDER BY id");
    return rows;
  }
  async getTypesOfAchievements() {
    const pool = await getConnection();
    const [rows] = await pool.execute("SELECT * FROM TypesOfAchievements ORDER BY ID_type");
    return rows;
  }
  async getActivities() {
    const pool = await getConnection();
    const [rows] = await pool.execute("SELECT * FROM Activities ORDER BY name");
    return rows;
  }
  async getCourses() {
    const pool = await getConnection();
    const [rows] = await pool.execute("SELECT * FROM Courses ORDER BY name");
    return rows;
  }
  async getCompetencies() {
    const pool = await getConnection();
    const [rows] = await pool.execute("SELECT * FROM Competencies ORDER BY name");
    return rows;
  }
  async getUserKPI(userId) {
    const pool = await getConnection();
    const [rows] = await pool.execute(
      "SELECT * FROM KPI WHERE userid = ?",
      [userId]
    );
    return rows[0] || void 0;
  }
  async updateUserKPI(userId, kpiData) {
    const pool = await getConnection();
    const [existing] = await pool.execute(
      "SELECT * FROM KPI WHERE FK_user_id = ?",
      [userId]
    );
    if (existing.length > 0) {
      const [result] = await pool.execute(`
        UPDATE KPI SET 
          academicachievements = ?, 
          scientificachievements = ?, 
          sportsachievements = ?, 
          culturalachievements = ?, 
          totalpoints = ?,
          lastupdated = NOW()
        WHERE userid = ? RETURNING *
      `, [
        kpiData.academicAchievements,
        kpiData.scientificAchievements,
        kpiData.sportsAchievements,
        kpiData.culturalAchievements,
        kpiData.totalPoints,
        userId
      ]);
      return result[0];
    } else {
      const [result] = await pool.execute(`
        INSERT INTO KPI (userid, academicachievements, scientificachievements, sportsachievements, culturalachievements, totalpoints, lastupdated)
        VALUES (?, ?, ?, ?, ?, ?, NOW()) RETURNING *
      `, [
        userId,
        kpiData.academicAchievements,
        kpiData.scientificAchievements,
        kpiData.sportsAchievements,
        kpiData.culturalAchievements,
        kpiData.totalPoints
      ]);
      return result[0];
    }
  }
  async getUserCourses(userId) {
    const pool = await getConnection();
    const [rows] = await pool.execute(`
      SELECT c.*, uc.enrollmentdate, uc.completiondate, uc.grade
      FROM Courses c
      INNER JOIN usercourses uc ON c.id = uc.courseid
      WHERE uc.userid = ?
      ORDER BY uc.enrollmentdate DESC
    `, [userId]);
    return rows;
  }
  async getAssessmentData(userId) {
    const pool = await getConnection();
    const [rows] = await pool.execute(`
      SELECT ad.*, at.name as assessment_type, c.name as course_name
      FROM AssessmentData ad
      LEFT JOIN AssessmentTypes at ON ad.assessmenttypeid = at.id
      LEFT JOIN Courses c ON ad.courseid = c.id
      WHERE ad.userid = ?
      ORDER BY ad.assessmentdate DESC
    `, [userId]);
    return rows;
  }
  async getDiagnosticData(userId) {
    const pool = await getConnection();
    const [rows] = await pool.execute(`
      SELECT dd.*, dt.name as tool_name
      FROM DiagnosticData dd
      LEFT JOIN DiagnosticTools dt ON dd.toolid = dt.id
      WHERE dd.userid = ?
      ORDER BY dd.testdate DESC
    `, [userId]);
    return rows;
  }
  async getProjects() {
    const pool = await getConnection();
    const [rows] = await pool.execute("SELECT * FROM projects ORDER BY name");
    return rows;
  }
  async getUserProjects(userId) {
    const pool = await getConnection();
    const [rows] = await pool.execute(`
      SELECT p.*, up.participationdate, up.role, up.status
      FROM Projects p
      INNER JOIN userprojects up ON p.id = up.projectid
      WHERE up.userid = ?
      ORDER BY up.participationdate DESC
    `, [userId]);
    return rows;
  }
  async getParticipationData(userId) {
    const pool = await getConnection();
    const [rows] = await pool.execute(`
      SELECT pd.*, a.name as activity_name
      FROM ParticipationData pd
      LEFT JOIN Activities a ON pd.activityid = a.id
      WHERE pd.userid = ?
      ORDER BY pd.participationdate DESC
    `, [userId]);
    return rows;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" });
    }
  });
  app2.get("/api/users/:id/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0434\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u0439" });
    }
  });
  app2.get("/api/users/:id/kpi", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const kpi = await storage.getUserKPI(userId);
      res.json(kpi || {});
    } catch (error) {
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0440\u0435\u0439\u0442\u0438\u043D\u0433\u0430" });
    }
  });
  app2.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0441\u043F\u0438\u0441\u043A\u0430 \u0434\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u0439" });
    }
  });
  app2.get("/api/levels", async (req, res) => {
    try {
      const levels = await storage.getLevels();
      res.json(levels);
    } catch (error) {
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0443\u0440\u043E\u0432\u043D\u0435\u0439" });
    }
  });
  app2.get("/api/types", async (req, res) => {
    try {
      const types = await storage.getTypesOfAchievements();
      res.json(types);
    } catch (error) {
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0442\u0438\u043F\u043E\u0432 \u0434\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u0439" });
    }
  });
  app2.post("/api/users/:id/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const userAchievement = await storage.createUserAchievement({
        FK_user_id: userId,
        FK_achievement_id: req.body.achievementId,
        Date_received: new Date(req.body.dateReceived),
        Document_confirmation: req.body.document
      });
      res.status(201).json(userAchievement);
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u0434\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F:", error);
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u0434\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F" });
    }
  });
  app2.put("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updatedUser = await storage.updateUser(userId, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u043F\u0440\u043E\u0444\u0438\u043B\u044F" });
    }
  });
  app2.delete("/api/achievements/:id", async (req, res) => {
    try {
      const achievementId = parseInt(req.params.id);
      const deleted = await storage.deleteUserAchievement(achievementId);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "\u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u0435 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E" });
      }
    } catch (error) {
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F \u0434\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F" });
    }
  });
  app2.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0435\u0439" });
    }
  });
  app2.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u043A\u0443\u0440\u0441\u043E\u0432" });
    }
  });
  app2.get("/api/competencies", async (req, res) => {
    try {
      const competencies = await storage.getCompetencies();
      res.json(competencies);
    } catch (error) {
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u043A\u043E\u043C\u043F\u0435\u0442\u0435\u043D\u0446\u0438\u0439" });
    }
  });
  app2.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432" });
    }
  });
  app2.get("/api/users/:id/courses", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const courses = await storage.getUserCourses(userId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u043A\u0443\u0440\u0441\u043E\u0432 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" });
    }
  });
  app2.get("/api/users/:id/assessments", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const assessments = await storage.getAssessmentData(userId);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445 \u043E\u0446\u0435\u043D\u043A\u0438" });
    }
  });
  app2.get("/api/users/:id/diagnostics", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const diagnostics = await storage.getDiagnosticData(userId);
      res.json(diagnostics);
    } catch (error) {
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0434\u0438\u0430\u0433\u043D\u043E\u0441\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u0434\u0430\u043D\u043D\u044B\u0445" });
    }
  });
  app2.get("/api/users/:id/projects", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const projects = await storage.getUserProjects(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" });
    }
  });
  app2.get("/api/users/:id/participation", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const participation = await storage.getParticipationData(userId);
      res.json(participation);
    } catch (error) {
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445 \u0443\u0447\u0430\u0441\u0442\u0438\u044F" });
    }
  });
  app2.put("/api/users/:id/kpi", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updatedKPI = await storage.updateUserKPI(userId, req.body);
      res.json(updatedKPI);
    } catch (error) {
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F KPI" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
