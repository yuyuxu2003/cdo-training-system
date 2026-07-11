<template>
  <div style="min-height:100vh;">
    <div style="background:linear-gradient(135deg,#1a73e8,#0d47a1);padding:40px 20px;color:#fff;text-align:center;">
      <h1 style="font-size:28px;margin-bottom:10px;">首席数据官 CDO 培训</h1>
      <p style="font-size:14px;opacity:0.9;">数据驱动决策 · 企业数字化转型核心人才</p>
      <div style="margin-top:20px;">
        <button @click="goLogin" style="background:#fff;color:#1a73e8;border:none;padding:12px 32px;border-radius:24px;font-size:16px;font-weight:bold;cursor:pointer;">立即报名</button>
      </div>
    </div>
    <div style="padding:20px;background:#fff;margin:10px;border-radius:12px;">
      <h3 style="margin-bottom:16px;font-size:18px;">课程亮点</h3>
      <div v-for="(item,i) in highlights" :key="i" style="display:flex;align-items:center;margin-bottom:12px;">
        <span style="color:#1a73e8;font-size:20px;margin-right:10px;">✓</span>
        <span style="font-size:14px;color:#333;">{{ item }}</span>
      </div>
    </div>
    <div style="padding:20px;background:#fff;margin:10px;border-radius:12px;">
      <h3 style="margin-bottom:12px;font-size:18px;">课程套餐</h3>
      <div style="border:2px solid #1a73e8;border-radius:10px;padding:16px;margin-bottom:12px;">
        <div style="font-size:18px;font-weight:bold;color:#1a73e8;">标准版</div>
        <div style="font-size:24px;font-weight:bold;color:#e53935;margin-top:8px;">¥1,999</div>
        <div style="font-size:13px;color:#666;margin-top:8px;line-height:1.6;">
          ✓ 全套录播课程<br>
          ✓ 在线考试<br>
          ✓ 电子证书<br>
          ✓ 推广返学费 20%
        </div>
      </div>
    </div>
    <div style="position:fixed;bottom:0;left:0;right:0;height:60px;background:#fff;display:flex;align-items:center;justify-content:space-around;border-top:1px solid #eee;">
      <span style="color:#1a73e8;font-weight:bold;" @click="$router.push('/')">首页</span>
      <span style="color:#666;" @click="goCourse">学习</span>
      <span style="color:#666;" @click="goPromote">推广</span>
      <span style="color:#666;" @click="goProfile">我的</span>
    </div>
    <div style="height:60px;"></div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const highlights = ['权威讲师：大厂CDO亲授', '实战导向：真实企业案例', '证书认证：考试通过后颁发电子证书', '推广返利：邀请好友返学费20%']
const goLogin = () => { router.push('/login') }
const goCourse = () => { const t = localStorage.getItem('token'); if(t) router.push('/course'); else router.push('/login') }
const goPromote = () => { const t = localStorage.getItem('token'); if(t) router.push('/promote'); else router.push('/login') }
const goProfile = () => { const t = localStorage.getItem('token'); if(t) router.push('/profile'); else router.push('/login') }
</script>
