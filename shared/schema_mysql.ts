import { pgTable, text, integer, timestamp, varchar, date, real, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Все таблицы из базы данных ИрГУПС

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
export const achievements = mysqlTable("Achievements", {
  id: int("ID_achievement").primaryKey().autoincrement(),
  title: varchar("Title", { length: 255 }).notNull(),
  category: varchar("Category", { length: 50 }).notNull(),
  points: int("Points").notNull(),
  validityPeriod: varchar("Validity_period", { length: 50 }),
  controlBody: varchar("Control_body", { length: 100 }),
  levelId: int("Level_id").notNull(),
  typeId: int("Type_id").notNull(),
});

// Таблица активностей
export const activities = mysqlTable("Activities", {
  id: int("ActivityID").primaryKey().autoincrement(),
  activityName: varchar("ActivityName", { length: 100 }).notNull(),
  description: varchar("Description", { length: 255 }),
});

// Таблица описаний активностей
export const activityDescriptions = mysqlTable("ActivityDescriptions", {
  id: int("ActivityID").primaryKey().autoincrement(),
  activityName: varchar("ActivityName", { length: 100 }).notNull(),
  description: varchar("Description", { length: 255 }),
  startDate: date("StartDate"),
  endDate: date("EndDate"),
  levelId: int("LevelID"),
  typeId: int("TypeID"),
});

// Таблица данных оценки
export const assessmentData = mysqlTable("AssessmentData", {
  id: int("AssessmentID").primaryKey().autoincrement(),
  userId: int("UserID").notNull(),
  typeId: int("TypeID").notNull(),
  scoreValue: float("ScoreValue").notNull(),
  feedback: varchar("Feedback", { length: 255 }),
  timestamp: datetime("Timestamp").notNull(),
});

// Таблица типов оценки
export const assessmentTypes = mysqlTable("AssessmentTypes", {
  id: int("TypeID").primaryKey().autoincrement(),
  typeName: varchar("TypeName", { length: 50 }).notNull(),
});

// Таблица компетенций
export const competencies = mysqlTable("Competencies", {
  id: int("CompetencyID").primaryKey().autoincrement(),
  competencyName: varchar("CompetencyName", { length: 100 }).notNull(),
  description: varchar("Description", { length: 255 }),
});

// Таблица курсов
export const courses = mysqlTable("Courses", {
  id: int("CourseID").primaryKey().autoincrement(),
  courseName: varchar("CourseName", { length: 100 }).notNull(),
  duration: int("Duration").notNull(),
  description: varchar("Description", { length: 255 }),
});

// Таблица действий куратора
export const curatorActions = mysqlTable("CuratorActions", {
  id: int("ActionID").primaryKey().autoincrement(),
  curatorId: int("CuratorID").notNull(),
  userId: int("UserID").notNull(),
  actionType: varchar("ActionType", { length: 50 }).notNull(),
  timestamp: datetime("Timestamp").notNull(),
});

// Таблица диагностических данных
export const diagnosticData = mysqlTable("DiagnosticData", {
  id: int("DiagnosticID").primaryKey().autoincrement(),
  userId: int("UserID").notNull(),
  toolId: int("ToolID").notNull(),
  competencyId: int("CompetencyID").notNull(),
  resultValue: float("ResultValue").notNull(),
  timestamp: datetime("Timestamp").notNull(),
});

// Таблица диагностических инструментов
export const diagnosticTools = mysqlTable("DiagnosticTools", {
  id: int("ToolID").primaryKey().autoincrement(),
  toolName: varchar("ToolName", { length: 100 }).notNull(),
  description: varchar("Description", { length: 255 }),
});

// Таблица образовательного контента
export const educationalContent = mysqlTable("EducationalContent", {
  id: int("ContentID").primaryKey().autoincrement(),
  courseId: int("CourseID").notNull(),
  moduleId: int("ModuleID").notNull(),
  title: varchar("Title", { length: 100 }).notNull(),
  description: varchar("Description", { length: 255 }),
  creationDate: datetime("CreationDate").notNull(),
});

// Таблица работодателей
export const employers = mysqlTable("Employers", {
  id: int("EmployerID").primaryKey().autoincrement(),
  companyName: varchar("CompanyName", { length: 100 }).notNull(),
  contactInfo: varchar("ContactInfo", { length: 255 }),
  roleId: int("RoleID").notNull(),
});

// Таблица данных опыта
export const experienceData = mysqlTable("ExperienceData", {
  id: int("ExperienceID").primaryKey().autoincrement(),
  userId: int("UserID").notNull(),
  activityId: int("ActivityID").notNull(),
  goal: varchar("Goal", { length: 255 }),
  task: varchar("Task", { length: 255 }),
  criteria: varchar("Criteria", { length: 255 }),
  outcome: varchar("Outcome", { length: 255 }),
  timestamp: datetime("Timestamp").notNull(),
});

// Таблица намерений
export const intentions = mysqlTable("Intentions", {
  id: int("IntentionID").primaryKey().autoincrement(),
  userId: int("UserID").notNull(),
  categoryId: int("CategoryID").notNull(),
  source: varchar("Source", { length: 50 }).notNull(),
  description: varchar("Description", { length: 255 }).notNull(),
  timestamp: datetime("Timestamp").notNull(),
});

// Таблица взаимодействий
export const interactions = mysqlTable("Interactions", {
  id: int("InteractionID").primaryKey().autoincrement(),
  userId: int("UserID").notNull(),
  contentId: int("ContentID").notNull(),
  actionType: varchar("ActionType", { length: 50 }).notNull(),
  timestamp: datetime("Timestamp").notNull(),
});

// Таблица KPI
export const kpi = mysqlTable("KPI", {
  id: int("ID_kpi").primaryKey().autoincrement(),
  userId: int("FK_user_id").notNull(),
  totalPoints: int("Total_points").notNull(),
  semesterRating: int("Semester_rating").notNull(),
  academicRating: int("Academic_rating").notNull(),
  scientificRating: int("Scientific_rating").notNull(),
  culturalRating: int("Cultural_rating").notNull(),
  sportsRating: int("Sports_rating").notNull(),
  socialRating: int("Social_rating").notNull(),
  validFrom: date("Valid_from").notNull(),
  validTo: date("Valid_to"),
});

// Таблица уровней
export const levels = mysqlTable("Levels", {
  id: int("ID_level").primaryKey().autoincrement(),
  name: varchar("Name", { length: 50 }).notNull(),
});

// Таблица модулей
export const modules = mysqlTable("Modules", {
  id: int("ModuleID").primaryKey().autoincrement(),
  moduleName: varchar("ModuleName", { length: 100 }).notNull(),
  courseId: int("CourseID").notNull(),
});

// Таблица данных участия
export const participationData = mysqlTable("ParticipationData", {
  id: int("ParticipationID").primaryKey().autoincrement(),
  userId: int("UserID").notNull(),
  activityId: int("ActivityID").notNull(),
  role: varchar("Role", { length: 50 }).notNull(),
  contribution: varchar("Contribution", { length: 255 }),
  employerId: int("EmployerID"),
  timestamp: datetime("Timestamp").notNull(),
});

// Таблица запросов партнеров
export const partnerRequests = mysqlTable("PartnerRequests", {
  id: int("RequestID").primaryKey().autoincrement(),
  partnerId: int("PartnerID").notNull(),
  competencies: varchar("Competencies", { length: 255 }).notNull(),
  deadline: datetime("Deadline").notNull(),
  status: varchar("Status", { length: 50 }).notNull(),
  timestamp: datetime("Timestamp").notNull(),
});

// Таблица категорий предпочтений
export const preferenceCategories = mysqlTable("PreferenceCategories", {
  id: int("CategoryID").primaryKey().autoincrement(),
  categoryName: varchar("CategoryName", { length: 50 }).notNull(),
});

// Таблица данных процесса
export const processData = mysqlTable("ProcessData", {
  id: int("ProcessID").primaryKey().autoincrement(),
  userId: int("UserID").notNull(),
  courseId: int("CourseID").notNull(),
  actionType: varchar("ActionType", { length: 50 }).notNull(),
  timestamp: datetime("Timestamp").notNull(),
});

// Таблица проектов
export const projects = mysqlTable("Projects", {
  id: int("ProjectID").primaryKey().autoincrement(),
  title: varchar("Title", { length: 100 }).notNull(),
  description: varchar("Description", { length: 255 }),
  partnerId: int("PartnerID").notNull(),
  startDate: datetime("StartDate").notNull(),
  endDate: datetime("EndDate").notNull(),
  status: varchar("Status", { length: 50 }).notNull(),
});

// Таблица категорий состояний
export const stateCategories = mysqlTable("StateCategories", {
  id: int("CategoryID").primaryKey().autoincrement(),
  categoryName: varchar("CategoryName", { length: 50 }).notNull(),
});

// Таблица данных состояния
export const stateData = mysqlTable("StateData", {
  id: int("StateID").primaryKey().autoincrement(),
  userId: int("UserID").notNull(),
  categoryId: int("CategoryID").notNull(),
  measurementValue: float("MeasurementValue").notNull(),
  timestamp: datetime("Timestamp").notNull(),
});

// Таблица типов достижений
export const typesOfAchievements = mysqlTable("TypesOfAchievements", {
  id: int("ID_type").primaryKey().autoincrement(),
  name: varchar("Name", { length: 50 }).notNull(),
});

// Таблица достижений пользователей
export const userAchievements = mysqlTable("UserAchievements", {
  id: int("ID_user_achievement").primaryKey().autoincrement(),
  userId: int("FK_user_id").notNull(),
  achievementId: int("FK_achievement_id").notNull(),
  dateReceived: date("Date_received").notNull(),
  documentConfirmation: varchar("Document_confirmation", { length: 255 }),
});

// Таблица связей данных пользователей
export const userDataRelations = mysqlTable("UserDataRelations", {
  id: int("RelationID").primaryKey().autoincrement(),
  userId: int("UserID").notNull(),
  diagnosticId: int("DiagnosticID"),
  processId: int("ProcessID"),
  assessmentId: int("AssessmentID"),
  intentionId: int("IntentionID"),
  participationId: int("ParticipationID"),
});

// Таблица ролей пользователей
export const userRoles = mysqlTable("UserRoles", {
  id: int("RoleID").primaryKey().autoincrement(),
  roleName: varchar("RoleName", { length: 50 }).notNull(),
  description: varchar("Description", { length: 255 }),
});

// Добавляем связи между таблицами
export const usersRelations = relations(users, ({ many, one }) => ({
  userAchievements: many(userAchievements),
  kpi: many(kpi),
  role: one(userRoles, {
    fields: [users.roleId],
    references: [userRoles.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ many, one }) => ({
  userAchievements: many(userAchievements),
  level: one(levels, {
    fields: [achievements.levelId],
    references: [levels.id],
  }),
  type: one(typesOfAchievements, {
    fields: [achievements.typeId],
    references: [typesOfAchievements.id],
  }),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export const kpiRelations = relations(kpi, ({ one }) => ({
  user: one(users, {
    fields: [kpi.userId],
    references: [users.id],
  }),
}));

// Экспорт типов для использования в приложении
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
