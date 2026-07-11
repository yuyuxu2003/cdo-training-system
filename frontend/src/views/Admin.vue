<template>
  <div style="min-height:100vh;background:#f0f2f5;">
    <!-- 顶部 -->
    <div style="background:#1a73e8;color:#fff;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;">
      <h2 style="font-size:18px;">🔧 管理后台</h2>
      <span style="font-size:12px;opacity:0.8;">CDO报名系统</span>
    </div>

    <!-- 统计卡片 -->
    <div style="padding:16px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div style="background:#fff;border-radius:10px;padding:16px;text-align:center;">
        <div style="font-size:28px;font-weight:700;color:#1a73e8;">{{ stats.users }}</div>
        <div style="font-size:12px;color:#999;margin-top:4px;">注册学员</div>
      </div>
      <div style="background:#fff;border-radius:10px;padding:16px;text-align:center;">
        <div style="font-size:28px;font-weight:700;color:#4caf50;">{{ stats.paidOrders }}</div>
        <div style="font-size:12px;color:#999;margin-top:4px;">已付款</div>
      </div>
      <div style="background:#fff;border-radius:10px;padding:16px;text-align:center;">
        <div style="font-size:28px;font-weight:700;color:#ff9800;">{{ stats.pendingOrders }}</div>
        <div style="font-size:12px;color:#999;margin-top:4px;">待付款</div>
      </div>
      <div style="background:#fff;border-radius:10px;padding:16px;text-align:center;">
        <div style="font-size:20px;font-weight:700;color:#e53935;">¥{{ (stats.totalRevenue/100).toFixed(0) }}</div>
        <div style="font-size:12px;color:#999;margin-top:4px;">总收入</div>
      </div>
    </div>

    <!-- 标签页切换 -->
    <div style="padding:0 16px;display:flex;gap:8px;margin-bottom:12px;">
      <button @click="tab='users'" :style="tab==='users' ? activeTabStyle : tabStyle">👥 学员列表</button>
      <button @click="tab='orders'" :style="tab==='orders' ? activeTabStyle : tabStyle">📋 订单管理</button>
    </div>

    <!-- 学员列表 -->
    <div v-if="tab==='users'" style="padding:0 16px 80px;">
      <div v-if="users.length===0" style="text-align:center;padding:40px;color:#999;">暂无学员</div>
      <div v-for="u in users" :key="u.id" style="background:#fff;border-radius:10px;padding:16px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div style="font-size:15px;font-weight:700;">{{ u.real_name || '未填写' }}</div>
          <div :style="{fontSize:'12px',padding:'2px 8px',borderRadius:'10px',color:u.order_status==='paid'?'#4caf50':u.order_status==='pending'?'#ff9800':'#999',background:u.order_status==='paid'?'#e8f5e9':u.order_status==='pending'?'#fff3e0':'#f5f5f5'}">
            {{ u.order_status==='paid'?'已付款':u.order_status==='pending'?'待付款':'未报名' }}
          </div>
        </div>
        <div style="font-size:13px;color:#555;line-height:1.8;">
          <div>📱 {{ u.phone }}</div>
          <div v-if="u.email">📧 {{ u.email }}</div>
          <div v-if="u.company">🏢 {{ u.company }} · {{ u.position }}</div>
          <div v-if="u.industry">🏭 {{ u.industry }} · {{ u.work_years }}</div>
          <div v-if="u.promotion_code">🔗 推广码: {{ u.promotion_code }}</div>
          <div v-if="u.order_no" style="color:#1a73e8;">📝 订单: {{ u.order_no }}</div>
          <div v-if="u.pay_amount" style="color:#e53935;font-weight:700;">💰 金额: ¥{{ (u.pay_amount/100).toFixed(2) }}</div>
          <div style="font-size:11px;color:#aaa;margin-top:4px;">注册: {{ formatDate(u.created_at) }}</div>
        </div>
      </div>
    </div>

    <!-- 订单管理 -->
    <div v-if="tab==='orders'" style="padding:0 16px 80px;">
      <div v-if="orders.length===0" style="text-align:center;padding:40px;color:#999;">暂无订单</div>
      <div v-for="o in orders" :key="o.id" style="background:#fff;border-radius:10px;padding:16px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div style="font-size:14px;font-weight:700;">{{ o.order_no }}</div>
          <div :style="{fontSize:'12px',padding:'2px 8px',borderRadius:'10px',color:o.status==='paid'?'#4caf50':'#ff9800',background:o.status==='paid'?'#e8f5e9':'#fff3e0'}">
            {{ o.status==='paid'?'已付款':'待付款' }}
          </div>
        </div>
        <div style="font-size:13px;color:#555;line-height:1.8;">
          <div>👤 {{ o.real_name || o.phone }}</div>
          <div>📱 {{ o.phone }}</div>
          <div>📦 {{ o.course_name }}</div>
          <div style="color:#e53935;font-weight:700;">💰 ¥{{ (o.pay_amount/100).toFixed(2) }}
            <span v-if="o.rebate_used > 0" style="color:#4caf50;font-size:12px;font-weight:400;"> (抵扣 ¥{{ (o.rebate_used/100).toFixed(2) }})</span>
          </div>
          <div style="font-size:11px;color:#aaa;">时间: {{ formatDate(o.created_at) }}</div>
        </div>
        <div v-if="o.status !== 'paid'" style="margin-top:10px;">
          <button @click="markPaid(o.order_no)" style="background:#4caf50;color:#fff;border:none;padding:8px 20px;border-radius:16px;font-size:13px;cursor:pointer;">✓ 标记已收款</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const tab = ref('users')
const stats = ref({ users: 0, paidOrders: 0, pendingOrders: 0, totalRevenue: 0 })
const users = ref([])
const orders = ref([])

const activeTabStyle = 'background:#1a73e8;color:#fff;border:none;padding:8px 16px;border-radius:16px;font-size:13px;cursor:pointer;'
const tabStyle = 'background:#fff;color:#666;border:1px solid #ddd;padding:8px 16px;border-radius:16px;font-size:13px;cursor:pointer;'

const formatDate = (d) => {
  if (!d) return '-'
  const date = new Date(d)
  return date.toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const loadData = async () => {
  try {
    const [sRes, uRes, oRes] = await Promise.all([
      axios.get('/api/admin/stats'),
      axios.get('/api/admin/users'),
      axios.get('/api/admin/orders')
    ])
    stats.value = sRes.data
    users.value = uRes.data
    orders.value = oRes.data
  } catch (e) {
    console.error('load data error:', e)
  }
}

const markPaid = async (orderNo) => {
  if (!confirm('确认已收到该订单的线下付款？')) return
  try {
    await axios.post('/api/admin/mark-paid', { order_no: orderNo })
    alert('标记成功！推广返学费已自动计算。')
    loadData()
  } catch (e) {
    alert('标记失败: ' + (e.response?.data?.msg || e.message))
  }
}

onMounted(loadData)
</script>
