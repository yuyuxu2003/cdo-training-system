<template>
  <div style="min-height:100vh;background:#f5f5f5;">
    <div style="background:linear-gradient(135deg,#1a73e8,#0d47a1);padding:30px 20px;color:#fff;">
      <div style="display:flex;align-items:center;">
        <div style="width:60px;height:60px;border-radius:30px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;color:#1a73e8;">{{ user.nickname?.[0] || user.phone?.slice(-4) || 'U' }}</div>
        <div style="margin-left:16px;">
          <div style="font-size:18px;font-weight:bold;">{{ user.nickname || user.phone }}</div>
          <div style="font-size:13px;opacity:0.8;margin-top:4px;">学员ID: {{ user.id }}</div>
        </div>
      </div>
    </div>
    <div style="background:#fff;margin:12px;border-radius:12px;overflow:hidden;">
      <div v-for="(item, idx) in menuItems" :key="idx" style="display:flex;align-items:center;padding:16px 20px;border-bottom:1px solid #f5f5f5;cursor:pointer;" @click="item.action ? item.action() : null">
        <span style="font-size:18px;margin-right:12px;">{{ item.icon }}</span>
        <span style="flex:1;font-size:15px;">{{ item.label }}</span>
        <span style="color:#999;">›</span>
      </div>
    </div>
    <div style="padding:20px;">
      <button @click="logout" style="width:100%;padding:14px;background:#fff;color:#e53935;border:1px solid #e53935;border-radius:8px;font-size:16px;cursor:pointer;">退出登录</button>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const user = JSON.parse(localStorage.getItem('user') || '{}')
const menuItems = [
  { icon: '📚', label: '我的课程', action: () => router.push('/course') },
  { icon: '💰', label: '推广返学费', action: () => router.push('/promote') },
  { icon: '📋', label: '我的订单', action: () => alert('订单功能开发中') },
  { icon: '🎓', label: '我的证书', action: () => alert('证书功能开发中') },
  { icon: '💬', label: '联系客服', action: () => alert('客服电话：400-xxx-xxxx') }
]
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>
