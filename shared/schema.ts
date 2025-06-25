import { pgTable, text, integer, timestamp, varchar, date, real, serial, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Все таблицы из базы данных ИрГУПС - PostgreSQL версия

// Таблица пользователей
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("firstname", { length: 100 }),
  lastName: varchar("lastname", { length: 100 }),
  email: varchar("email", { length: 150 }),
  roleId: integer("roleid"),
  groupId: integer("groupid"),
  phone: varchar("phone", { length: 20 }),
  registrationDate: timestamp("registrationdate"),
});

// Таблица достижений
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  points: integer("points").notNull(),
  validityPeriod: varchar("validity_period", { length: 50 }),
  controlBody: varchar("control_body", { length: 100 }),
  levelId: integer("levelid").notNull(),
  typeId: integer("typeid").notNull(),
  description: text("description"),
});

// Таблица активностей
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }),
});

// Таблица описаний активностей
export const activityDescriptions = pgTable("activitydescriptions", {
  id: serial("id").primaryKey(),
  activityName: varchar("activityname", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }),
  startDate: date("startdate"),
  endDate: date("enddate"),
  levelId: integer("levelid"),
  typeId: integer("typeid"),
});

// Таблица данных оценки
export const assessmentData = pgTable("assessmentdata", {
  id: serial("id").primaryKey(),
  userId: integer("userid").notNull(),
  courseId: integer("courseid").notNull(),
  score: real("score").notNull(),
  maxScore: real("maxscore"),
  assessmentDate: timestamp("assessmentdate"),
  assessmentTypeId: integer("assessmenttypeid"),
});

// Таблица типов оценки
export const assessmentTypes = pgTable("assessmenttypes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
});

// Таблица компетенций
export const competencies = pgTable("competencies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  code: varchar("code", { length: 20 }),
  courseId: integer("courseid"),
});

// Таблица курсов
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  credits: integer("credits"),
  semester: integer("semester"),
  description: text("description"),
  startDate: timestamp("startdate"),
});

// Таблица действий куратора
export const curatorActions = pgTable("curatoractions", {
  id: serial("id").primaryKey(),
  userId: integer("userid").notNull(),
  curatorId: integer("curatorid").notNull(),
  actionType: varchar("actiontype", { length: 100 }),
  description: text("description"),
  actionDate: timestamp("actiondate"),
});

// Таблица диагностических данных
export const diagnosticData = pgTable("diagnosticdata", {
  id: serial("id").primaryKey(),
  userId: integer("userid").notNull(),
  toolId: integer("toolid"),
  result: text("result"),
  testDate: timestamp("testdate"),
});

// Таблица диагностических инструментов
export const diagnosticTools = pgTable("diagnostictools", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
});

// Таблица образовательного контента
export const educationalContent = pgTable("educationalcontent", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  contentType: varchar("contenttype", { length: 50 }),
  url: varchar("url", { length: 500 }),
  courseId: integer("courseid"),
  createdDate: timestamp("createddate"),
});

// Таблица работодателей
export const employers = pgTable("employers", {
  id: serial("id").primaryKey(),
  companyName: varchar("companyname", { length: 200 }).notNull(),
  contactPerson: varchar("contactperson", { length: 150 }),
  email: varchar("email", { length: 150 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
});

// Таблица данных опыта
export const experienceData = pgTable("experiencedata", {
  id: serial("id").primaryKey(),
  userId: integer("userid").notNull(),
  experienceType: varchar("experiencetype", { length: 100 }),
  description: text("description"),
  startDate: date("startdate"),
  endDate: date("enddate"),
});

// Таблица намерений
export const intentions = pgTable("intentions", {
  id: serial("id").primaryKey(),
  userId: integer("userid").notNull(),
  intentionType: varchar("intentiontype", { length: 100 }),
  description: text("description"),
  priority: integer("priority"),
  createdDate: timestamp("createddate"),
});

// Таблица взаимодействий
export const interactions = pgTable("interactions", {
  id: serial("id").primaryKey(),
  userId: integer("userid").notNull(),
  interactionType: varchar("interactiontype", { length: 100 }),
  description: text("description"),
  interactionDate: timestamp("interactiondate"),
});

// Таблица KPI
export const kpi = pgTable("kpi", {
  id: serial("id").primaryKey(),
  userId: integer("userid").notNull(),
  academicAchievements: integer("academicachievements").default(0),
  scientificAchievements: integer("scientificachievements").default(0),
  sportsAchievements: integer("sportsachievements").default(0),
  culturalAchievements: integer("culturalachievements").default(0),
  totalPoints: integer("totalpoints").default(0),
  lastUpdated: timestamp("lastupdated"),
});

// Таблица уровней
export const levels = pgTable("levels", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  multiplier: real("multiplier").default(1.0),
});

// Таблица модулей
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  courseId: integer("courseid"),
  description: text("description"),
});

// Таблица данных участия
export const participationData = pgTable("participationdata", {
  id: serial("id").primaryKey(),
  userId: integer("userid").notNull(),
  activityId: integer("activityid"),
  participationDate: timestamp("participationdate"),
  role: varchar("role", { length: 100 }),
  status: varchar("status", { length: 50 }),
});

// Таблица запросов партнеров
export const partnerRequests = pgTable("partnerrequests", {
  id: serial("id").primaryKey(),
  employerId: integer("employerid").notNull(),
  requestType: varchar("requesttype", { length: 100 }),
  description: text("description"),
  requestDate: timestamp("requestdate"),
  status: varchar("status", { length: 50 }),
});

// Таблица категорий предпочтений
export const preferenceCategories = pgTable("preferencecategories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
});

// Таблица данных процессов
export const processData = pgTable("processdata", {
  id: serial("id").primaryKey(),
  userId: integer("userid").notNull(),
  processType: varchar("processtype", { length: 100 }),
  status: varchar("status", { length: 50 }),
  startDate: timestamp("startdate"),
  endDate: timestamp("enddate"),
});

// Таблица проектов
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  startDate: date("startdate"),
  endDate: date("enddate"),
  status: varchar("status", { length: 50 }),
});

// Таблица категорий состояний
export const stateCategories = pgTable("statecategories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
});

// Таблица данных состояний
export const stateData = pgTable("statedata", {
  id: serial("id").primaryKey(),
  userId: integer("userid").notNull(),
  categoryId: integer("categoryid"),
  value: real("value"),
  recordDate: timestamp("recorddate"),
});

// Таблица типов достижений
export const typesOfAchievements = pgTable("typesofachievements", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
});

// Таблица достижений пользователей
export const userAchievements = pgTable("userachievements", {
  id: serial("id").primaryKey(),
  userId: integer("userid").notNull(),
  achievementId: integer("achievementid").notNull(),
  dateEarned: timestamp("dateearned"),
  points: integer("points").default(0),
  status: varchar("status", { length: 50 }).default('Pending'),
  description: text("description"),
  documentPath: varchar("documentpath", { length: 500 }),
});

// Таблица пользовательских курсов
export const userCourses = pgTable("usercourses", {
  id: serial("id").primaryKey(),
  userId: integer("userid").notNull(),
  courseId: integer("courseid").notNull(),
  enrollmentDate: timestamp("enrollmentdate"),
  completionDate: timestamp("completiondate"),
  grade: varchar("grade", { length: 10 }),
});

// Таблица пользовательских проектов
export const userProjects = pgTable("userprojects", {
  id: serial("id").primaryKey(),
  userId: integer("userid").notNull(),
  projectId: integer("projectid").notNull(),
  participationDate: timestamp("participationdate"),
  role: varchar("role", { length: 100 }),
  status: varchar("status", { length: 50 }),
});

// Таблица связей пользовательских данных
export const userDataRelations = pgTable("userdatarelations", {
  id: serial("id").primaryKey(),
  userId: integer("userid").notNull(),
  relationType: varchar("relationtype", { length: 100 }),
  relatedId: integer("relatedid"),
  createdDate: timestamp("createddate"),
});

// Таблица ролей пользователей
export const userRoles = pgTable("userroles", {
  id: serial("id").primaryKey(),
  roleName: varchar("rolename", { length: 100 }).notNull(),
  permissions: text("permissions"),
});

// Определение связей между таблицами
export const usersRelations = relations(users, ({ many, one }) => ({
  achievements: many(userAchievements),
  kpi: one(kpi, { fields: [users.id], references: [kpi.userId] }),
  courses: many(userCourses),
  projects: many(userProjects),
}));

export const achievementsRelations = relations(achievements, ({ many, one }) => ({
  userAchievements: many(userAchievements),
  level: one(levels, { fields: [achievements.levelId], references: [levels.id] }),
  type: one(typesOfAchievements, { fields: [achievements.typeId], references: [typesOfAchievements.id] }),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, { fields: [userAchievements.userId], references: [users.id] }),
  achievement: one(achievements, { fields: [userAchievements.achievementId], references: [achievements.id] }),
}));

export const kpiRelations = relations(kpi, ({ one }) => ({
  user: one(users, { fields: [kpi.userId], references: [users.id] }),
}));

// Типы для использования в приложении
export type User = typeof users.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type Level = typeof levels.$inferSelect;
export type TypeOfAchievement = typeof typesOfAchievements.$inferSelect;
export type KPI = typeof kpi.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Competency = typeof competencies.$inferSelect;
export type Project = typeof projects.$inferSelect;

// Схемы для вставки данных
export const insertUserSchema = createInsertSchema(users);
export const insertAchievementSchema = createInsertSchema(achievements);
export const insertUserAchievementSchema = createInsertSchema(userAchievements);
export const insertKPISchema = createInsertSchema(kpi);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type InsertKPI = z.infer<typeof insertKPISchema>;