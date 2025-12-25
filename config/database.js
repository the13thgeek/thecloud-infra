const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.GEEKHUB_DB_ENDPOINT,
      user: process.env.GEEKHUB_DB_USER,
      password: process.env.GEEKHUB_DB_PASS,
      database: process.env.GEEKHUB_DB_NAME,
      port: process.env.GEEKHUB_DB_PORT,
      waitForConnections: true,
      connectionLimit: 3,
      keepAliveInitialDelay: 0,
      enableKeepAlive: true,
      idleTimeout: 60000,
      maxIdle: 3,
      queueLimit: 0,
      connectTimeout: 10000
    });
  }

  async execute(query, params = []) {
    let conn;
    try {
      conn = await this.pool.getConnection();
      
      // Test connection health
      try {
        await conn.ping();
      } catch (pingError) {
        console.warn('Stale connection detected, reconnecting...');
        conn.release();
        conn = await this.pool.getConnection();
      }

      const [result] = await conn.execute(query, params);
      return result;
    } catch (error) {
      console.error('Database query error:', {
        message: error.message,
        query,
        params
      });
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  async executeOne(query, params = []) {
    const results = await this.execute(query, params);
    return results[0] || null;
  }

  async transaction(callback) {
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();
      const result = await callback(conn);
      await conn.commit();
      return result;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
}

module.exports = new Database();