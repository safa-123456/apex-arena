import dotenv from "dotenv";

dotenv.config();

interface DB {
  execute(sql: string, params?: any[]): Promise<[any, any]>;
}

class MySQLDB implements DB {
  private pool: any = null;
  
  private async getPool() {
    if (this.pool) return this.pool;
    const mysql = await import("mysql2/promise");
    this.pool = mysql.createPool({
      host: (process.env.DB_HOST || 'localhost').trim(),
      user: (process.env.DB_USER || 'root').trim(),
      password: (process.env.DB_PASSWORD || '').trim(),
      database: (process.env.DB_NAME || 'apex_arena').trim(),
      port: parseInt((process.env.DB_PORT || '3306').trim()),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    return this.pool;
  }

  async execute(sql: string, params?: any[]): Promise<[any, any]> {
    const pool = await this.getPool();
    return await pool.execute(sql, params);
  }
}

class SQLiteDB implements DB {
  private db: any = null;
  private initPromise: Promise<void> | null = null;

  async init() {
    if (this.initPromise) return this.initPromise;
    
    this.initPromise = (async () => {
      const sqlite3 = await import("sqlite3");
      const { open } = await import("sqlite");
      
      this.db = await open({
        filename: './database.sqlite',
        driver: sqlite3.default.Database
      });

      // Create tables if they don't exist
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          uid TEXT PRIMARY KEY,
          email TEXT,
          displayName TEXT,
          photoURL TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS bookings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_uid TEXT,
          sport_id TEXT,
          sport_name TEXT,
          trainer_id TEXT,
          trainer_name TEXT,
          date TEXT,
          time TEXT,
          price REAL,
          status TEXT DEFAULT 'confirmed',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_uid) REFERENCES users(uid)
        );
        CREATE TABLE IF NOT EXISTS applications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_uid TEXT,
          full_name TEXT,
          email TEXT,
          phone TEXT,
          sport_interest TEXT,
          experience TEXT,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_uid) REFERENCES users(uid)
        );
      `);
    })();
    
    return this.initPromise;
  }

  async execute(sql: string, params?: any[]): Promise<[any, any]> {
    await this.init();
    
    if (sql.includes("ON DUPLICATE KEY UPDATE")) {
      const sqliteSql = sql.replace("INSERT INTO users (uid, email, displayName, photoURL) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE email = ?, displayName = ?, photoURL = ?", 
                                   "INSERT OR REPLACE INTO users (uid, email, displayName, photoURL) VALUES (?, ?, ?, ?)");
      const result = await this.db!.run(sqliteSql, params?.slice(0, 4));
      return [result, null];
    }

    if (sql.startsWith("SELECT")) {
      const rows = await this.db!.all(sql, params);
      return [rows, null];
    } else {
      const result = await this.db!.run(sql, params);
      return [{ insertId: result.lastID, affectedRows: result.changes }, null];
    }
  }
}

let dbInstance: DB;

// Decide which DB to use
const dbProvider = (process.env.DB_PROVIDER || "mysql").trim().toLowerCase();

if (dbProvider === "sqlite") {
  console.log("Using SQLite Database (Fallback for Preview)");
  dbInstance = new SQLiteDB();
} else {
  const dbHost = (process.env.DB_HOST || "localhost").trim();
  console.log(`Using MySQL Database at ${dbHost}`);
  dbInstance = new MySQLDB();
}

export default dbInstance;
