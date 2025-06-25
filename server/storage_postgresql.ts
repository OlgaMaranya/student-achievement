import { getConnection } from "./db";
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface IStorage {
  // Пользователи
  getUser(id: number): Promise<any>;
  getUserByEmail(email: string): Promise<any>;
  createUser(user: any): Promise<any>;
  updateUser(id: number, user: any): Promise<any>;
  
  // Достижения пользователей
  getUserAchievements(userId: number): Promise<any[]>;
  getAchievement(id: number): Promise<any>;
  createUserAchievement(userAchievement: any): Promise<any>;
  updateUserAchievement(id: number, userAchievementData: any): Promise<any>;
  deleteUserAchievement(id: number): Promise<boolean>;
  
  // Справочники
  getAllAchievements(): Promise<any[]>;
  getLevels(): Promise<any[]>;
  getTypesOfAchievements(): Promise<any[]>;
  getActivities(): Promise<any[]>;
  getCourses(): Promise<any[]>;
  getCompetencies(): Promise<any[]>;
  
  // Рейтинги и KPI
  getUserKPI(userId: number): Promise<any>;
  updateUserKPI(userId: number, kpiData: any): Promise<any>;
  
  // Образовательный процесс
  getUserCourses(userId: number): Promise<any[]>;
  getAssessmentData(userId: number): Promise<any[]>;
  getDiagnosticData(userId: number): Promise<any[]>;
  
  // Проекты и активности
  getProjects(): Promise<any[]>;
  getUserProjects(userId: number): Promise<any[]>;
  getParticipationData(userId: number): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<any> {
    const pool = await getConnection();
    const result = await pool.query(
      'SELECT * FROM "Users" WHERE "UserID" = $1',
      [id]
    );
    return result.rows[0] || undefined;
  }

  async getUserByEmail(email: string): Promise<any> {
    const pool = await getConnection();
    const result = await pool.query(
      'SELECT * FROM "Users" WHERE "Email" = $1',
      [email]
    );
    return result.rows[0] || undefined;
  }

  async createUser(userData: any): Promise<any> {
    const pool = await getConnection();
    const result = await pool.query(
      'INSERT INTO "Users" ("FirstName", "LastName", "Email", "Phone") VALUES ($1, $2, $3, $4) RETURNING *',
      [userData.FirstName, userData.LastName, userData.Email, userData.Phone]
    );
    return result.rows[0];
  }

  async updateUser(id: number, userData: any): Promise<any> {
    const pool = await getConnection();
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (userData.FirstName) {
      fields.push(`"FirstName" = $${paramCount++}`);
      values.push(userData.FirstName);
    }
    if (userData.LastName) {
      fields.push(`"LastName" = $${paramCount++}`);
      values.push(userData.LastName);
    }
    if (userData.Email) {
      fields.push(`"Email" = $${paramCount++}`);
      values.push(userData.Email);
    }
    if (userData.Phone) {
      fields.push(`"Phone" = $${paramCount++}`);
      values.push(userData.Phone);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE "Users" SET ${fields.join(', ')} WHERE "UserID" = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async getUserAchievements(userId: number): Promise<any[]> {
    const pool = await getConnection();
    const result = await pool.query(
      `SELECT ua.*, a."Title", a."Category", a."Points", l."Name" as "LevelName", t."Name" as "TypeName" 
       FROM "UserAchievements" ua
       JOIN "Achievements" a ON ua."FK_achievement_id" = a."ID_achievement"
       JOIN "Levels" l ON a."Level_id" = l."ID_level"
       JOIN "TypesOfAchievements" t ON a."Type_id" = t."ID_type"
       WHERE ua."FK_user_id" = $1 
       ORDER BY ua."Date_received" DESC`,
      [userId]
    );
    return result.rows;
  }

  async getAchievement(id: number): Promise<any> {
    const pool = await getConnection();
    const result = await pool.query(
      'SELECT * FROM "Achievements" WHERE "ID_achievement" = $1',
      [id]
    );
    return result.rows[0] || undefined;
  }

  async createUserAchievement(userAchievementData: any): Promise<any> {
    const pool = await getConnection();
    const result = await pool.query(
      'INSERT INTO "UserAchievements" ("FK_user_id", "FK_achievement_id", "Date_received", "Document_confirmation") VALUES ($1, $2, $3, $4) RETURNING *',
      [
        userAchievementData.FK_user_id,
        userAchievementData.FK_achievement_id,
        userAchievementData.Date_received,
        userAchievementData.Document_confirmation
      ]
    );
    return result.rows[0];
  }

  async updateUserAchievement(id: number, userAchievementData: any): Promise<any> {
    const pool = await getConnection();
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (userAchievementData.FK_achievement_id) {
      fields.push(`"FK_achievement_id" = $${paramCount++}`);
      values.push(userAchievementData.FK_achievement_id);
    }
    if (userAchievementData.Date_received) {
      fields.push(`"Date_received" = $${paramCount++}`);
      values.push(userAchievementData.Date_received);
    }
    if (userAchievementData.Document_confirmation) {
      fields.push(`"Document_confirmation" = $${paramCount++}`);
      values.push(userAchievementData.Document_confirmation);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE "UserAchievements" SET ${fields.join(', ')} WHERE "ID_user_achievement" = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async deleteUserAchievement(id: number): Promise<boolean> {
    const pool = await getConnection();
    const result = await pool.query(
      'DELETE FROM "UserAchievements" WHERE "ID_user_achievement" = $1',
      [id]
    );
    return (result.rowCount || 0) > 0;
  }

  async getAllAchievements(): Promise<any[]> {
    const pool = await getConnection();
    const result = await pool.query(
      `SELECT a.*, l."Name" as "LevelName", t."Name" as "TypeName" 
       FROM "Achievements" a
       JOIN "Levels" l ON a."Level_id" = l."ID_level"
       JOIN "TypesOfAchievements" t ON a."Type_id" = t."ID_type"
       ORDER BY a."Points" DESC`
    );
    return result.rows;
  }

  async getLevels(): Promise<any[]> {
    const pool = await getConnection();
    const result = await pool.query('SELECT * FROM "Levels" ORDER BY "ID_level"');
    return result.rows;
  }

  async getTypesOfAchievements(): Promise<any[]> {
    const pool = await getConnection();
    const result = await pool.query('SELECT * FROM "TypesOfAchievements" ORDER BY "ID_type"');
    return result.rows;
  }

  async getActivities(): Promise<any[]> {
    const pool = await getConnection();
    const result = await pool.query('SELECT * FROM "Activities" ORDER BY "ActivityName"');
    return result.rows;
  }

  async getCourses(): Promise<any[]> {
    const pool = await getConnection();
    const result = await pool.query('SELECT * FROM "Courses" ORDER BY "CourseName"');
    return result.rows;
  }

  async getCompetencies(): Promise<any[]> {
    const pool = await getConnection();
    const result = await pool.query('SELECT * FROM "Competencies" ORDER BY "CompetencyName"');
    return result.rows;
  }

  async getUserKPI(userId: number): Promise<any> {
    const pool = await getConnection();
    const result = await pool.query(
      'SELECT * FROM "KPI" WHERE "FK_user_id" = $1 ORDER BY "Valid_from" DESC LIMIT 1',
      [userId]
    );
    return result.rows[0] || undefined;
  }

  async updateUserKPI(userId: number, kpiData: any): Promise<any> {
    const pool = await getConnection();
    
    // Создаем новую запись KPI
    const result = await pool.query(
      `INSERT INTO "KPI" ("FK_user_id", "Total_points", "Semester_rating", "Academic_rating", 
                          "Scientific_rating", "Cultural_rating", "Sports_rating", "Social_rating", 
                          "Valid_from", "Valid_to") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        userId,
        kpiData.Total_points || 0,
        kpiData.Semester_rating || 0,
        kpiData.Academic_rating || 0,
        kpiData.Scientific_rating || 0,
        kpiData.Cultural_rating || 0,
        kpiData.Sports_rating || 0,
        kpiData.Social_rating || 0,
        kpiData.Valid_from || new Date().toISOString().split('T')[0],
        kpiData.Valid_to || null
      ]
    );
    return result.rows[0];
  }

  async getUserCourses(userId: number): Promise<any[]> {
    const pool = await getConnection();
    const result = await pool.query(
      `SELECT c.*, pd."ActionType", pd."Timestamp" 
       FROM "ProcessData" pd
       JOIN "Courses" c ON pd."CourseID" = c."CourseID"
       WHERE pd."UserID" = $1
       ORDER BY pd."Timestamp" DESC`,
      [userId]
    );
    return result.rows;
  }

  async getAssessmentData(userId: number): Promise<any[]> {
    const pool = await getConnection();
    const result = await pool.query(
      `SELECT ad.*, at."TypeName" 
       FROM "AssessmentData" ad
       JOIN "AssessmentTypes" at ON ad."TypeID" = at."TypeID"
       WHERE ad."UserID" = $1
       ORDER BY ad."Timestamp" DESC`,
      [userId]
    );
    return result.rows;
  }

  async getDiagnosticData(userId: number): Promise<any[]> {
    const pool = await getConnection();
    const result = await pool.query(
      `SELECT dd.*, dt."ToolName", c."CompetencyName" 
       FROM "DiagnosticData" dd
       JOIN "DiagnosticTools" dt ON dd."ToolID" = dt."ToolID"
       JOIN "Competencies" c ON dd."CompetencyID" = c."CompetencyID"
       WHERE dd."UserID" = $1
       ORDER BY dd."Timestamp" DESC`,
      [userId]
    );
    return result.rows;
  }

  async getProjects(): Promise<any[]> {
    const pool = await getConnection();
    const result = await pool.query('SELECT * FROM "Projects" ORDER BY "StartDate" DESC');
    return result.rows;
  }

  async getUserProjects(userId: number): Promise<any[]> {
    const pool = await getConnection();
    const result = await pool.query(
      `SELECT p.*, pd."Role", pd."Contribution" 
       FROM "ParticipationData" pd
       JOIN "Projects" p ON pd."ActivityID" = p."ProjectID"
       WHERE pd."UserID" = $1
       ORDER BY pd."Timestamp" DESC`,
      [userId]
    );
    return result.rows;
  }

  async getParticipationData(userId: number): Promise<any[]> {
    const pool = await getConnection();
    const result = await pool.query(
      `SELECT pd.*, a."ActivityName" 
       FROM "ParticipationData" pd
       JOIN "Activities" a ON pd."ActivityID" = a."ActivityID"
       WHERE pd."UserID" = $1
       ORDER BY pd."Timestamp" DESC`,
      [userId]
    );
    return result.rows;
  }
}

export const storage = new DatabaseStorage();