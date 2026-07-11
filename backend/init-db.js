require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com') ? { rejectUnauthorized: false } : false
})

const generateCode = () => Math.random().toString(36).substr(2, 6).toUpperCase()

async function init() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    await client.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY, phone VARCHAR(20) UNIQUE NOT NULL, nickname VARCHAR(50),
      promotion_code VARCHAR(10) UNIQUE, invited_by INTEGER, status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`)

    await client.query(`CREATE TABLE IF NOT EXISTS student_infos (
      id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL UNIQUE, real_name VARCHAR(50),
      email VARCHAR(100), id_card VARCHAR(50), company VARCHAR(100), position VARCHAR(50),
      industry VARCHAR(50), work_years VARCHAR(20), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`)

    await client.query(`CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY, order_no VARCHAR(50) UNIQUE NOT NULL, user_id INTEGER NOT NULL,
      course_id VARCHAR(50) DEFAULT 'standard', course_name VARCHAR(100) DEFAULT 'CDO首席数据官标准版',
      original_amount INTEGER DEFAULT 199900, discount_amount INTEGER DEFAULT 0, pay_amount INTEGER NOT NULL,
      status VARCHAR(20) DEFAULT 'pending', pay_channel VARCHAR(20), pay_time TIMESTAMP, promoter_id INTEGER,
      rebate_used INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`)

    await client.query(`CREATE TABLE IF NOT EXISTS student_accounts (
      user_id INTEGER PRIMARY KEY, promotion_code VARCHAR(10) UNIQUE,
      available_rebate INTEGER DEFAULT 0, total_rebate_earned INTEGER DEFAULT 0,
      total_rebate_used INTEGER DEFAULT 0, total_invited INTEGER DEFAULT 0, total_invited_amount INTEGER DEFAULT 0)`)

    await client.query(`CREATE TABLE IF NOT EXISTS rebate_records (
      id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL, type VARCHAR(20) NOT NULL,
      amount INTEGER NOT NULL, source_order_id INTEGER, balance_after INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`)

    await client.query(`CREATE TABLE IF NOT EXISTS sms_codes (
      id SERIAL PRIMARY KEY, phone VARCHAR(20) NOT NULL, code VARCHAR(10) NOT NULL,
      expires BIGINT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`)

    await client.query('CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)')
    await client.query('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)')
    await client.query('CREATE INDEX IF NOT EXISTS idx_rebate_user_id ON rebate_records(user_id)')

    const testPhones = ['13800138000', '13800138001', '13800138002']
    for (const phone of testPhones) {
      const existing = await client.query('SELECT id FROM users WHERE phone = $1', [phone])
      if (existing.rows.length === 0) {
        const code = generateCode()
        const userRes = await client.query('INSERT INTO users (phone, promotion_code) VALUES ($1, $2) RETURNING id', [phone, code])
        await client.query('INSERT INTO student_accounts (user_id, promotion_code) VALUES ($1, $2)', [userRes.rows[0].id, code])
      }
    }

    await client.query('COMMIT')
    console.log('✅ PostgreSQL 数据库初始化完成！')
    console.log('测试账号：13800138000 / 验证码: 1234')
  } catch (e) {
    await client.query('ROLLBACK')
    console.error('❌ 初始化失败:', e.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

init()
