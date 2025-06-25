import { Pool } from 'pg';

// Прямое подключение к PostgreSQL для системы ИрГУПС
class PostgreSQLConnection {
  private pool: Pool;
  
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }

  async execute(query: string, params: any[] = []) {
    try {
      // Преобразуем MySQL плейсхолдеры ? в PostgreSQL $1, $2, и т.д.
      let paramIndex = 1;
      const pgQuery = query.replace(/\?/g, () => `$${paramIndex++}`);
      
      console.log('Executing PostgreSQL query:', pgQuery, 'with params:', params);
      const result = await this.pool.query(pgQuery, params);
      
      // Возвращаем результат в MySQL-подобном формате для совместимости
      const mysqlResult = result.rows;
      if (result.rows.length > 0) {
        mysqlResult.insertId = result.rows[0]?.id;
      }
      mysqlResult.affectedRows = result.rowCount || 0;
      
      return [mysqlResult, []];
    } catch (error) {
      console.error('PostgreSQL query error:', error);
      console.error('Query:', query);
      console.error('Params:', params);
      throw error;
    }
  }

  async close() {
    await this.pool.end();
  }
}

let connection: PostgreSQLConnection;

export async function initializeDatabase() {
  if (!connection) {
    connection = new PostgreSQLConnection();
    console.log('PostgreSQL connection initialized for ИрГУПС system');
  }
  return connection;
}

export async function getConnection() {
  if (!connection) {
    await initializeDatabase();
  }
  return connection;
}