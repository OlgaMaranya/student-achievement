import { getConnection } from "./db";

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
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM Users WHERE Email = ?',
      [email]
    );
    return rows[0] || undefined;
  }

  async createUser(user: any): Promise<any> {
    const connection = await getConnection();
    const [result] = await connection.execute<ResultSetHeader>(
      'INSERT INTO Users (FirstName, LastName, Email, Phone, RegistrationDate) VALUES (?, ?, ?, ?, NOW())',
      [user.FirstName, user.LastName, user.Email, user.Phone]
    );
    return await this.getUser(result.insertId);
  }

  async updateUser(id: number, userData: any): Promise<any> {
    const connection = await getConnection();
    const fields = [];
    const values = [];
    
    if (userData.FirstName !== undefined) {
      fields.push('FirstName = ?');
      values.push(userData.FirstName);
    }
    if (userData.LastName !== undefined) {
      fields.push('LastName = ?');
      values.push(userData.LastName);
    }
    if (userData.Email !== undefined) {
      fields.push('Email = ?');
      values.push(userData.Email);
    }
    if (userData.Phone !== undefined) {
      fields.push('Phone = ?');
      values.push(userData.Phone);
    }
    
    if (fields.length === 0) return this.getUser(id);
    
    values.push(id);
    await connection.execute(
      `UPDATE Users SET ${fields.join(', ')} WHERE UserID = ?`,
      values
    );
    
    return this.getUser(id);
  }

  async getUserAchievements(userId: number): Promise<any[]> {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT ua.*, a.Title, a.Category, a.Points, l.Name as LevelName, t.Name as TypeName 
       FROM UserAchievements ua
       JOIN Achievements a ON ua.FK_achievement_id = a.ID_achievement
       JOIN Levels l ON a.Level_id = l.ID_level
       JOIN TypesOfAchievements t ON a.Type_id = t.ID_type
       WHERE ua.FK_user_id = ? 
       ORDER BY ua.Date_received DESC`,
      [userId]
    );
    return rows;
  }

  async getAchievement(id: number): Promise<any> {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM Achievements WHERE ID_achievement = ?',
      [id]
    );
    return rows[0] || undefined;
  }

  async createUserAchievement(userAchievement: any): Promise<any> {
    const connection = await getConnection();
    const [result] = await connection.execute<ResultSetHeader>(
      'INSERT INTO UserAchievements (FK_user_id, FK_achievement_id, Date_received, Document_confirmation) VALUES (?, ?, ?, ?)',
      [userAchievement.FK_user_id, userAchievement.FK_achievement_id, userAchievement.Date_received, userAchievement.Document_confirmation]
    );
    
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM UserAchievements WHERE ID_user_achievement = ?',
      [result.insertId]
    );
    return rows[0];
  }

  async updateUserAchievement(id: number, userAchievementData: any): Promise<any> {
    const connection = await getConnection();
    const fields = [];
    const values = [];
    
    if (userAchievementData.FK_achievement_id !== undefined) {
      fields.push('FK_achievement_id = ?');
      values.push(userAchievementData.FK_achievement_id);
    }
    if (userAchievementData.Date_received !== undefined) {
      fields.push('Date_received = ?');
      values.push(userAchievementData.Date_received);
    }
    if (userAchievementData.Document_confirmation !== undefined) {
      fields.push('Document_confirmation = ?');
      values.push(userAchievementData.Document_confirmation);
    }
    
    if (fields.length === 0) {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM UserAchievements WHERE ID_user_achievement = ?',
        [id]
      );
      return rows[0] || undefined;
    }
    
    values.push(id);
    await connection.execute(
      `UPDATE UserAchievements SET ${fields.join(', ')} WHERE ID_user_achievement = ?`,
      values
    );
    
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM UserAchievements WHERE ID_user_achievement = ?',
      [id]
    );
    return rows[0] || undefined;
  }

  async deleteUserAchievement(id: number): Promise<boolean> {
    const connection = await getConnection();
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM UserAchievements WHERE ID_user_achievement = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async getAllAchievements(): Promise<any[]> {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT a.*, l.Name as LevelName, t.Name as TypeName 
       FROM Achievements a
       JOIN Levels l ON a.Level_id = l.ID_level
       JOIN TypesOfAchievements t ON a.Type_id = t.ID_type`
    );
    return rows;
  }

  async getLevels(): Promise<any[]> {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM Levels');
    return rows;
  }

  async getTypesOfAchievements(): Promise<any[]> {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM TypesOfAchievements');
    return rows;
  }

  async getActivities(): Promise<any[]> {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM Activities');
    return rows;
  }

  async getCourses(): Promise<any[]> {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM Courses');
    return rows;
  }

  async getCompetencies(): Promise<any[]> {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM Competencies');
    return rows;
  }

  async getUserKPI(userId: number): Promise<any> {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM KPI WHERE FK_user_id = ? ORDER BY Valid_from DESC LIMIT 1',
      [userId]
    );
    return rows[0] || undefined;
  }

  async updateUserKPI(userId: number, kpiData: any): Promise<any> {
    const connection = await getConnection();
    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO KPI (FK_user_id, Total_points, Semester_rating, Academic_rating, 
                       Scientific_rating, Cultural_rating, Sports_rating, Social_rating, 
                       Valid_from, Valid_to) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, kpiData.totalPoints, kpiData.semesterRating, kpiData.academicRating,
       kpiData.scientificRating, kpiData.culturalRating, kpiData.sportsRating, 
       kpiData.socialRating, kpiData.validFrom, kpiData.validTo]
    );
    return this.getUserKPI(userId);
  }

  async getUserCourses(userId: number): Promise<any[]> {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT c.*, pd.ActionType, pd.Timestamp 
       FROM ProcessData pd
       JOIN Courses c ON pd.CourseID = c.CourseID
       WHERE pd.UserID = ?
       ORDER BY pd.Timestamp DESC`,
      [userId]
    );
    return rows;
  }

  async getAssessmentData(userId: number): Promise<any[]> {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT ad.*, at.TypeName 
       FROM AssessmentData ad
       JOIN AssessmentTypes at ON ad.TypeID = at.TypeID
       WHERE ad.UserID = ?
       ORDER BY ad.Timestamp DESC`,
      [userId]
    );
    return rows;
  }

  async getDiagnosticData(userId: number): Promise<any[]> {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT dd.*, dt.ToolName, c.CompetencyName 
       FROM DiagnosticData dd
       JOIN DiagnosticTools dt ON dd.ToolID = dt.ToolID
       JOIN Competencies c ON dd.CompetencyID = c.CompetencyID
       WHERE dd.UserID = ?
       ORDER BY dd.Timestamp DESC`,
      [userId]
    );
    return rows;
  }

  async getProjects(): Promise<any[]> {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT p.*, e.CompanyName 
       FROM Projects p
       JOIN Employers e ON p.PartnerID = e.EmployerID
       ORDER BY p.StartDate DESC`
    );
    return rows;
  }

  async getUserProjects(userId: number): Promise<any[]> {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT p.*, pd.Role, pd.Contribution, e.CompanyName 
       FROM ParticipationData pd
       JOIN Projects p ON pd.ActivityID = p.ProjectID
       JOIN Employers e ON p.PartnerID = e.EmployerID
       WHERE pd.UserID = ?
       ORDER BY pd.Timestamp DESC`,
      [userId]
    );
    return rows;
  }

  async getParticipationData(userId: number): Promise<any[]> {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT pd.*, a.ActivityName 
       FROM ParticipationData pd
       JOIN Activities a ON pd.ActivityID = a.ActivityID
       WHERE pd.UserID = ?
       ORDER BY pd.Timestamp DESC`,
      [userId]
    );
    return rows;
  }
}

export const storage = new DatabaseStorage();
