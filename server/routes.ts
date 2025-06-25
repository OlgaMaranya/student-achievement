import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API маршруты для работы с достижениями студентов
  
  // Получить информацию о пользователе
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      // const user = await storage.getUser(userId);
      // if (!user) {
      //   return res.status(404).json({ error: "Пользователь не найден" });
      // }
      // res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Ошибка получения данных пользователя" });
    }
  });

  // Получить достижения пользователя
  app.get("/api/users/:id/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "Ошибка получения достижений" });
    }
  });

  // Получить KPI пользователя
  app.get("/api/users/:id/kpi", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const kpi = await storage.getUserKPI(userId);
      res.json(kpi || {});
    } catch (error) {
      res.status(500).json({ error: "Ошибка получения рейтинга" });
    }
  });

  // Получить все типы достижений
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "Ошибка получения списка достижений" });
    }
  });

  // Получить уровни достижений
  app.get("/api/levels", async (req, res) => {
    try {
      const levels = await storage.getLevels();
      res.json(levels);
    } catch (error) {
      res.status(500).json({ error: "Ошибка получения уровней" });
    }
  });

  // Получить типы достижений
  app.get("/api/types", async (req, res) => {
    try {
      const types = await storage.getTypesOfAchievements();
      res.json(types);
    } catch (error) {
      res.status(500).json({ error: "Ошибка получения типов достижений" });
    }
  });

  // Создать новое достижение пользователя
  app.post("/api/users/:id/achievements", async (req, res) => {
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
      console.error("Ошибка создания достижения:", error);
      res.status(500).json({ error: "Ошибка создания достижения" });
    }
  });

  // Обновить профиль пользователя
  app.put("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updatedUser = await storage.updateUser(userId, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Ошибка обновления профиля" });
    }
  });

  // Удалить достижение пользователя
  app.delete("/api/achievements/:id", async (req, res) => {
    try {
      const achievementId = parseInt(req.params.id);
      const deleted = await storage.deleteUserAchievement(achievementId);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Достижение не найдено" });
      }
    } catch (error) {
      res.status(500).json({ error: "Ошибка удаления достижения" });
    }
  });

  // Получить активности
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Ошибка получения активностей" });
    }
  });

  // Получить курсы
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "Ошибка получения курсов" });
    }
  });

  // Получить компетенции
  app.get("/api/competencies", async (req, res) => {
    try {
      const competencies = await storage.getCompetencies();
      res.json(competencies);
    } catch (error) {
      res.status(500).json({ error: "Ошибка получения компетенций" });
    }
  });

  // Получить проекты
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Ошибка получения проектов" });
    }
  });

  // Получить курсы пользователя
  app.get("/api/users/:id/courses", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const courses = await storage.getUserCourses(userId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "Ошибка получения курсов пользователя" });
    }
  });

  // Получить данные оценки пользователя
  app.get("/api/users/:id/assessments", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const assessments = await storage.getAssessmentData(userId);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ error: "Ошибка получения данных оценки" });
    }
  });

  // Получить диагностические данные пользователя
  app.get("/api/users/:id/diagnostics", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const diagnostics = await storage.getDiagnosticData(userId);
      res.json(diagnostics);
    } catch (error) {
      res.status(500).json({ error: "Ошибка получения диагностических данных" });
    }
  });

  // Получить проекты пользователя
  app.get("/api/users/:id/projects", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const projects = await storage.getUserProjects(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Ошибка получения проектов пользователя" });
    }
  });

  // Получить данные участия пользователя
  app.get("/api/users/:id/participation", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const participation = await storage.getParticipationData(userId);
      res.json(participation);
    } catch (error) {
      res.status(500).json({ error: "Ошибка получения данных участия" });
    }
  });

  // Обновить KPI пользователя
  app.put("/api/users/:id/kpi", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updatedKPI = await storage.updateUserKPI(userId, req.body);
      res.json(updatedKPI);
    } catch (error) {
      res.status(500).json({ error: "Ошибка обновления KPI" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
