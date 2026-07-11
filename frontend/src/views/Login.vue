<template>
  <div style="min-height:100vh;padding:40px 24px;background:#fff;">
    <h2 style="font-size:24px;margin-bottom:32px;text-align:center;">{{ isLogin ? '登录' : '注册' }}</h2>
    <div style="margin-bottom:20px;">
      <label style="font-size:14px;color:#666;display:block;margin-bottom:6px;">手机号</label>
      <input v-model="phone" type="tel" placeholder="请输入手机号" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:16px;" maxlength="11">
    </div>
    <div style="margin-bottom:20px;display:flex;gap:10px;">
      <div style="flex:1;">
        <label style="font-size:14px;color:#666;display:block;margin-bottom:6px;">验证码</label>
        <input v-model="code" type="text" placeholder="4位验证码" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:16px;" maxlength="4">
      </div>
      <button @click="sendCode" :disabled="countdown>0" style="align-self:flex-end;padding:12px 16px;border:1px solid #1a73e8;background:#fff;color:#1a73e8;border-radius:8px;font-size:14px;cursor:pointer;white-space:nowrap;">
        {{ countdown > 0 ? countdown+'s' : '获取验证码' }}
      </button>
    </div>
    <button @click="submit" style="width:100%;padding:14px;background:#1a73e8;color:#fff;border:none;border-radius:8px;font-size:16px;font-weight:bold;cursor:pointer;margin-bottom:16px;">
      {{ isLogin ? '登录' : '注册并登录' }}
    </button>
    <p style="text-align:center;font-size:14px;color:#1a73e8;cursor:pointer;" @click="isLogin=!isLogin">
      {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
    </p>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
const router = useRouter()
const phone = ref('')
const code = ref('')
const isLogin = ref(true)
const countdown = ref(0)
const sendCode = async () => {
  if (!/^1\d{10}$/.test(phone.value)) { alert('请输入正确手机号'); return }
  try {
    const res = await axios.post('/api/send-sms', { phone: phone.value })
    alert(res.data.msg || '验证码已发送')
    countdown.value = 60
    const timer = setInterval(() => { countdown.value--; if (countdown.value <= 0) clearInterval(timer) }, 1000)
  } catch (e) { console.error(e); alert('发送失败: ' + (e.response?.data?.msg || e.message)) }
}
const submit = async () => {
  if (!/^1\d{10}$/.test(phone.value)) { alert('请输入正确手机号'); return }
  if (!/^\d{4}$/.test(code.value)) { alert('请输入4位验证码'); return }
  const inviterId = localStorage.getItem('inviterId')
  try {
    const res = await axios.post('/api/login', { phone: phone.value, code: code.value, inviter_id: inviterId })
    console.log('login response:', res.data)
    if (res.data.ok) {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      alert('登录成功！')
      router.push('/enroll')
    } else { alert(res.data.msg || '登录失败') }
  } catch (e) { console.error('login error:', e); alert('登录失败: ' + (e.response?.data?.msg || e.message)) }
}
</script>
