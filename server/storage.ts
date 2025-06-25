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
    try {
      console.log('Getting user with ID:', id);
      const pool = await getConnection();
      console.log('Pool connection established');
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      console.log('Query executed, rows:', rows);
      return rows[0] || undefined;
    } catch (error) {
      console.error('Error in getUser:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    const pool = await getConnection();
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || undefined;
  }

  async createUser(userData: any): Promise<any> {
    const pool = await getConnection();
    const [result] = await pool.execute(
      'INSERT INTO users (firstname, lastname, email, phone, registrationdate) VALUES (?, ?, ?, ?, NOW()) RETURNING *',
      [userData.firstName, userData.lastName, userData.email, userData.phone]
    );
    return result[0];
  }

  async updateUser(id: number, userData: any): Promise<any> {
    const pool = await getConnection();
    const fields = [];
    const values = [];

    if (userData.firstName) {
      fields.push('firstname = ?');
      values.push(userData.firstName);
    }
    if (userData.lastName) {
      fields.push('lastname = ?');
      values.push(userData.lastName);
    }
    if (userData.email) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    if (userData.phone) {
      fields.push('phone = ?');
      values.push(userData.phone);
    }

    if (fields.length === 0) {
      throw new Error('Нет данных для обновления');
    }

    values.push(id);
    const [result] = await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ? RETURNING *`,
      values
    );
    return result[0];
  }

  async getUserAchievements(userId: number): Promise<any[]> {
    const pool = await getConnection();
    const [rows] = await pool.execute(`
      SELECT ua.*, a.title, a.description, a.category, l.name as level_name, 
             t.name as type_name, ua.points, ua.status
      FROM userachievements ua
      JOIN achievements a ON ua.achievementid = a.id
      LEFT JOIN levels l ON a.levelid = l.id
      LEFT JOIN typesofachievements t ON a.typeid = t.id
      WHERE ua.userid = ?
      ORDER BY ua.dateearned DESC
    `, [userId]);
    return rows;
  }

  async getAchievement(id: number): Promise<any> {
    const pool = await getConnection();
    const [rows] = await pool.execute(
      'SELECT * FROM achievements WHERE id = ?',
      [id]
    );
    return rows[0] || undefined;
  }

  async createUserAchievement(userAchievementData: any): Promise<any> {
    const pool = await getConnection();
    const [result] = await pool.execute(`
      INSERT INTO userachievements (userid, achievementid, dateearned, points, status, description, documentpath)
      VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *
    `, [
      userAchievementData.userId,
      userAchievementData.achievementId,
      userAchievementData.dateEarned,
      userAchievementData.points,
      userAchievementData.status || 'Pending',
      userAchievementData.description,
      userAchievementData.documentPath
    ]);
    return result[0];
  }

  async updateUserAchievement(id: number, userAchievementData: any): Promise<any> {
    const pool = await getConnection();
    const fields = [];
    const values = [];

    if (userAchievementData.status) {
      fields.push('status = ?');
      values.push(userAchievementData.status);
    }
    if (userAchievementData.points) {
      fields.push('points = ?');
      values.push(userAchievementData.points);
    }
    if (userAchievementData.description) {
      fields.push('description = ?');
      values.push(userAchievementData.description);
    }

    if (fields.length === 0) {
      throw new Error('Нет данных для обновления');
    }

    values.push(id);
    const [result] = await pool.execute(
      `UPDATE userachievements SET ${fields.join(', ')} WHERE id = ? RETURNING *`,
      values
    );
    return result[0];
  }

  async deleteUserAchievement(id: number): Promise<boolean> {
    const pool = await getConnection();
    const [result] = await pool.execute(
      'DELETE FROM userachievements WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async getAllAchievements(): Promise<any[]> {
    const pool = await getConnection();
    const [rows] = await pool.execute(`
      SELECT a.*, l.name as level_name, t.name as type_name
      FROM achievements a
      LEFT JOIN levels l ON a.levelid = l.id
      LEFT JOIN typesofachievements t ON a.typeid = t.id
      ORDER BY a.title
    `);
    return rows;
  }

  async getLevels(): Promise<any[]> {
    const pool = await getConnection();
    const [rows] = await pool.execute('SELECT * FROM levels ORDER BY id');
    return rows;
  }

  async getTypesOfAchievements(): Promise<any[]> {
    const pool = await getConnection();
    const [rows] = await pool.execute('SELECT * FROM typesofachievements ORDER BY id');
    return rows;
  }

  async getActivities(): Promise<any[]> {
    const pool = await getConnection();
    const [rows] = await pool.execute('SELECT * FROM activities ORDER BY name');
    return rows;
  }

  async getCourses(): Promise<any[]> {
    const pool = await getConnection();
    const [rows] = await pool.execute('SELECT * FROM courses ORDER BY name');
    return rows;
  }

  async getCompetencies(): Promise<any[]> {
    const pool = await getConnection();
    const [rows] = await pool.execute('SELECT * FROM competencies ORDER BY name');
    return rows;
  }

  async getUserKPI(userId: number): Promise<any> {
    const pool = await getConnection();
    const [rows] = await pool.execute(
      'SELECT * FROM kpi WHERE userid = ?',
      [userId]
    );
    return rows[0] || undefined;
  }

  async updateUserKPI(userId: number, kpiData: any): Promise<any> {
    const pool = await getConnection();
    
    // Проверяем, есть ли уже запись KPI для пользователя
    const [existing] = await pool.execute(
      'SELECT * FROM kpi WHERE userid = ?',
      [userId]
    );

    if (existing.length > 0) {
      // Обновляем существующую запись
      const [result] = await pool.execute(`
        UPDATE kpi SET 
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
      // Создаем новую запись
      const [result] = await pool.execute(`
        INSERT INTO kpi (userid, academicachievements, scientificachievements, sportsachievements, culturalachievements, totalpoints, lastupdated)
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

  async getUserCourses(userId: number): Promise<any[]> {
    const pool = await getConnection();
    const [rows] = await pool.execute(`
      SELECT c.*, uc.enrollmentdate, uc.completiondate, uc.grade
      FROM courses c
      INNER JOIN usercourses uc ON c.id = uc.courseid
      WHERE uc.userid = ?
      ORDER BY uc.enrollmentdate DESC
    `, [userId]);
    return rows;
  }

  async getAssessmentData(userId: number): Promise<any[]> {
    const pool = await getConnection();
    const [rows] = await pool.execute(`
      SELECT ad.*, at.name as assessment_type, c.name as course_name
      FROM assessmentdata ad
      LEFT JOIN assessmenttypes at ON ad.assessmenttypeid = at.id
      LEFT JOIN courses c ON ad.courseid = c.id
      WHERE ad.userid = ?
      ORDER BY ad.assessmentdate DESC
    `, [userId]);
    return rows;
  }

  async getDiagnosticData(userId: number): Promise<any[]> {
    const pool = await getConnection();
    const [rows] = await pool.execute(`
      SELECT dd.*, dt.name as tool_name
      FROM diagnosticdata dd
      LEFT JOIN diagnostictools dt ON dd.toolid = dt.id
      WHERE dd.userid = ?
      ORDER BY dd.testdate DESC
    `, [userId]);
    return rows;
  }

  async getProjects(): Promise<any[]> {
    const pool = await getConnection();
    const [rows] = await pool.execute('SELECT * FROM projects ORDER BY name');
    return rows;
  }

  async getUserProjects(userId: number): Promise<any[]> {
    const pool = await getConnection();
    const [rows] = await pool.execute(`
      SELECT p.*, up.participationdate, up.role, up.status
      FROM projects p
      INNER JOIN userprojects up ON p.id = up.projectid
      WHERE up.userid = ?
      ORDER BY up.participationdate DESC
    `, [userId]);
    return rows;
  }

  async getParticipationData(userId: number): Promise<any[]> {
    const pool = await getConnection();
    const [rows] = await pool.execute(`
      SELECT pd.*, a.name as activity_name
      FROM participationdata pd
      LEFT JOIN activities a ON pd.activityid = a.id
      WHERE pd.userid = ?
      ORDER BY pd.participationdate DESC
    `, [userId]);
    return rows;
  }
}

export const storage = new DatabaseStorage();