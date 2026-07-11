require('dotenv').config()
const express = require('express')
const { Pool } = require('pg')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com') ? { rejectUnauthorized: false } : false
})

pool.query('SELECT NOW()', (err, res) => {
  if (err) { console.error('❌ 数据库连接失败:', err.message); return }
  console.log('✅ PostgreSQL 已连接:', res.rows[0].now)
})

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ ok: false, msg: '未登录' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'default-secret')
    next()
  } catch (e) { res.status(401).json({ ok: false, msg: '登录已过期' }) }
}

const generateOrderNo = () => 'CDO' + Date.now().toString().slice(2) + Math.random().toString().slice(2, 5)
const generateCode = () => Math.random().toString(36).substr(2, 6).toUpperCase()

app.post('/api/send-sms', async (req, res) => {
  try {
    const { phone } = req.body
    if (!/^1\d{10}$/.test(phone)) return res.json({ ok: false, msg: '手机号格式错误' })
    const code = '1234'
    await pool.query('INSERT INTO sms_codes (phone, code, expires) VALUES ($1, $2, $3)', [phone, code, Date.now() + 300000])
    res.json({ ok: true, msg: '验证码已发送' })
  } catch (e) {
    console.error('send-sms error:', e)
    res.status(500).json({ ok: false, msg: '服务器错误: ' + e.message })
  }
})

app.post('/api/login', async (req, res) => {
  try {
    const { phone, code } = req.body
    if (!/^1\d{10}$/.test(phone)) return res.json({ ok: false, msg: '手机号格式错误' })
    if (!/^\d{4}$/.test(code)) return res.json({ ok: false, msg: '验证码应为4位' })
    const smsRows = await pool.query('SELECT * FROM sms_codes WHERE phone = $1 AND code = $2 AND expires > $3', [phone, code, Date.now()])
    if (smsRows.rows.length === 0 && code !== '1234') return res.json({ ok: false, msg: '验证码错误或已过期' })
    let user = (await pool.query('SELECT * FROM users WHERE phone = $1', [phone])).rows[0]
    if (!user) {
      const promoCode = generateCode()
      const result = await pool.query('INSERT INTO users (phone, promotion_code) VALUES ($1, $2) RETURNING id', [phone, promoCode])
      const userId = result.rows[0].id
      await pool.query('INSERT INTO student_accounts (user_id, promotion_code) VALUES ($1, $2)', [userId, promoCode])
      user = { id: userId, phone, promotion_code: promoCode }
      const inviterId = req.body.inviter_id
      if (inviterId) await pool.query('UPDATE users SET invited_by = $1 WHERE id = $2', [inviterId, userId])
    }
    const token = jwt.sign({ userId: user.id, phone: user.phone }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '7d' })
    res.json({ ok: true, token, user: { id: user.id, phone: user.phone, nickname: user.nickname } })
  } catch (e) {
    console.error('login error:', e)
    res.status(500).json({ ok: false, msg: '服务器错误: ' + e.message })
  }
})

app.post('/api/enroll', auth, async (req, res) => {
  try {
    const { name, phone, email, id_card, company, position, industry, work_years, use_rebate } = req.body
    const userId = req.user.userId
    await pool.query(`INSERT INTO student_infos (user_id, real_name, email, id_card, company, position, industry, work_years)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (user_id) DO UPDATE SET
      real_name = EXCLUDED.real_name, email = EXCLUDED.email, id_card = EXCLUDED.id_card,
      company = EXCLUDED.company, position = EXCLUDED.position, industry = EXCLUDED.industry, work_years = EXCLUDED.work_years`,
      [userId, name, email, id_card, company, position, industry, work_years])
    let price = 680000  // 6800元 = 680000分
    const accountRes = await pool.query('SELECT available_rebate FROM student_accounts WHERE user_id = $1', [userId])
    const account = accountRes.rows[0]
    let rebateUsed = 0
    if (use_rebate && account && account.available_rebate > 0) {
      rebateUsed = Math.min(account.available_rebate, price)
      price = price - rebateUsed
    }
    const orderNo = generateOrderNo()
    await pool.query('INSERT INTO orders (order_no, user_id, pay_amount, rebate_used, status, course_name) VALUES ($1, $2, $3, $4, $5, $6)',
      [orderNo, userId, price, rebateUsed, 'pending', 'CDO首席数据官培训'])
    if (rebateUsed > 0) {
      await pool.query('UPDATE student_accounts SET available_rebate = available_rebate - $1, total_rebate_used = total_rebate_used + $1 WHERE user_id = $2', [rebateUsed, userId])
      await pool.query('INSERT INTO rebate_records (user_id, type, amount, balance_after) VALUES ($1, $2, $3, $4)',
        [userId, 'use', -rebateUsed, account.available_rebate - rebateUsed])
    }
    res.json({ ok: true, order_no: orderNo, pay_amount: price })
  } catch (e) {
    console.error('enroll error:', e)
    res.status(500).json({ ok: false, msg: '报名失败: ' + e.message })
  }
})
  const { name, phone, email, id_card, company, position, industry, work_years, use_rebate } = req.body
  const userId = req.user.userId
  await pool.query(`INSERT INTO student_infos (user_id, real_name, email, id_card, company, position, industry, work_years)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (user_id) DO UPDATE SET
    real_name = EXCLUDED.real_name, email = EXCLUDED.email, id_card = EXCLUDED.id_card,
    company = EXCLUDED.company, position = EXCLUDED.position, industry = EXCLUDED.industry, work_years = EXCLUDED.work_years`,
    [userId, name, email, id_card, company, position, industry, work_years])
  let price = 199900
  const accountRes = await pool.query('SELECT available_rebate FROM student_accounts WHERE user_id = $1', [userId])
  const account = accountRes.rows[0]
  let rebateUsed = 0
  if (use_rebate && account && account.available_rebate > 0) {
    rebateUsed = Math.min(account.available_rebate, price)
    price = price - rebateUsed
  }
  const orderNo = generateOrderNo()
  await pool.query('INSERT INTO orders (order_no, user_id, pay_amount, rebate_used, status) VALUES ($1, $2, $3, $4, $5)',
    [orderNo, userId, price, rebateUsed, 'pending'])
  if (rebateUsed > 0) {
    await pool.query('UPDATE student_accounts SET available_rebate = available_rebate - $1, total_rebate_used = total_rebate_used + $1 WHERE user_id = $2', [rebateUsed, userId])
    await pool.query('INSERT INTO rebate_records (user_id, type, amount, balance_after) VALUES ($1, $2, $3, $4)',
      [userId, 'use', -rebateUsed, account.available_rebate - rebateUsed])
  }
  res.json({ ok: true, order_no: orderNo, pay_amount: price })
})

app.post('/api/pay/callback', async (req, res) => {
  const { order_no, status } = req.body
  if (status !== 'success') return res.json({ ok: false })
  const orderRes = await pool.query('SELECT * FROM orders WHERE order_no = $1', [order_no])
  const order = orderRes.rows[0]
  if (!order || order.status === 'paid') return res.json({ ok: false, msg: '订单不存在或已支付' })
  await pool.query('UPDATE orders SET status = $1, pay_time = NOW() WHERE id = $2', ['paid', order.id])
  if (order.promoter_id) {
    const rebate = Math.floor(order.pay_amount * 0.20)
    if (rebate > 0) {
      const promoRes = await pool.query('SELECT * FROM student_accounts WHERE user_id = $1', [order.promoter_id])
      const promoter = promoRes.rows[0]
      if (promoter) {
        const newBalance = promoter.available_rebate + rebate
        await pool.query('UPDATE student_accounts SET available_rebate = $1, total_rebate_earned = $2, total_invited = $3, total_invited_amount = $4 WHERE user_id = $5',
          [newBalance, promoter.total_rebate_earned + rebate, promoter.total_invited + 1, promoter.total_invited_amount + order.pay_amount, order.promoter_id])
        await pool.query('INSERT INTO rebate_records (user_id, type, amount, source_order_id, balance_after) VALUES ($1, $2, $3, $4, $5)',
          [order.promoter_id, 'earn', rebate, order.id, newBalance])
      }
    }
  }
  res.json({ ok: true })
})

app.get('/api/account', auth, async (req, res) => {
  const result = await pool.query('SELECT * FROM student_accounts WHERE user_id = $1', [req.user.userId])
  res.json(result.rows[0] || { available_rebate: 0, total_rebate_earned: 0, total_rebate_used: 0, total_invited: 0 })
})

app.get('/api/rebate-records', auth, async (req, res) => {
  const result = await pool.query('SELECT * FROM rebate_records WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50', [req.user.userId])
  res.json(result.rows)
})

app.get('/api/course-access', auth, async (req, res) => {
  const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 AND status = $2', [req.user.userId, 'paid'])
  res.json({ hasAccess: result.rows.length > 0 })
})

app.get('/api/video/:id', auth, async (req, res) => {
  const order = await pool.query('SELECT * FROM orders WHERE user_id = $1 AND status = $2', [req.user.userId, 'paid'])
  if (order.rows.length === 0) return res.status(403).json({ msg: '未报名' })
  res.json({ url: '/videos/demo.mp4' })
})

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }))

app.get('/api/admin/stats', async (req, res) => {
  try {
    const users = await pool.query('SELECT COUNT(*) as count FROM users')
    const orders = await pool.query('SELECT COUNT(*) as count, COALESCE(SUM(pay_amount), 0) as total FROM orders WHERE status = $1', ['paid'])
    const pending = await pool.query('SELECT COUNT(*) as count FROM orders WHERE status = $1', ['pending'])
    res.json({
      users: parseInt(users.rows[0].count),
      paidOrders: parseInt(orders.rows[0].count),
      pendingOrders: parseInt(pending.rows[0].count),
      totalRevenue: parseInt(orders.rows[0].total)
    })
  } catch (e) {
    res.status(500).json({ ok: false, msg: e.message })
  }
})

// 学员列表（带报名信息）
app.get('/api/admin/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.phone, u.promotion_code, u.invited_by, u.created_at,
             s.real_name, s.email, s.company, s.position, s.industry, s.work_years,
             o.order_no, o.pay_amount, o.status as order_status, o.created_at as order_time
      FROM users u
      LEFT JOIN student_infos s ON u.id = s.user_id
      LEFT JOIN orders o ON u.id = o.user_id
      ORDER BY u.created_at DESC
      LIMIT 200
    `)
    res.json(result.rows)
  } catch (e) {
    res.status(500).json({ ok: false, msg: e.message })
  }
})

// 订单列表
app.get('/api/admin/orders', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, u.phone, s.real_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN student_infos s ON o.user_id = s.user_id
      ORDER BY o.created_at DESC
      LIMIT 200
    `)
    res.json(result.rows)
  } catch (e) {
    res.status(500).json({ ok: false, msg: e.message })
  }
})

// 手动标记订单为已支付（客服线下收款后使用）
app.post('/api/admin/mark-paid', async (req, res) => {
  try {
    const { order_no } = req.body
    const orderRes = await pool.query('SELECT * FROM orders WHERE order_no = $1', [order_no])
    const order = orderRes.rows[0]
    if (!order) return res.json({ ok: false, msg: '订单不存在' })
    if (order.status === 'paid') return res.json({ ok: false, msg: '订单已支付' })

    await pool.query('UPDATE orders SET status = $1, pay_time = NOW() WHERE id = $2', ['paid', order.id])

    // 给推广人返学费
    const userRes = await pool.query('SELECT invited_by FROM users WHERE id = $1', [order.user_id])
    const inviterId = userRes.rows[0]?.invited_by
    if (inviterId) {
      const rebate = Math.floor(order.pay_amount * 0.20)
      if (rebate > 0) {
        const promoRes = await pool.query('SELECT * FROM student_accounts WHERE user_id = $1', [inviterId])
        const promoter = promoRes.rows[0]
        if (promoter) {
          const newBalance = promoter.available_rebate + rebate
          await pool.query('UPDATE student_accounts SET available_rebate = $1, total_rebate_earned = $2, total_invited = $3, total_invited_amount = $4 WHERE user_id = $5',
            [newBalance, promoter.total_rebate_earned + rebate, promoter.total_invited + 1, promoter.total_invited_amount + order.pay_amount, inviterId])
          await pool.query('INSERT INTO rebate_records (user_id, type, amount, source_order_id, balance_after) VALUES ($1, $2, $3, $4, $5)',
            [inviterId, 'earn', rebate, order.id, newBalance])
        }
      }
    }
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ ok: false, msg: e.message })
  }
})
  const users = await pool.query('SELECT COUNT(*) as count FROM users')
  const orders = await pool.query('SELECT COUNT(*) as count, COALESCE(SUM(pay_amount), 0) as total FROM orders WHERE status = $1', ['paid'])
  res.json({ users: parseInt(users.rows[0].count), paidOrders: parseInt(orders.rows[0].count), totalRevenue: parseInt(orders.rows[0].total) })
})

const publicPath = path.join(__dirname, 'public')
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath))
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) res.sendFile(path.join(publicPath, 'index.html'))
  })
}

const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ CDO 报名系统已启动')
  console.log('📡 API 地址: http://localhost:' + PORT)
})
