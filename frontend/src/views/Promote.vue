<template>
  <div style="min-height:100vh;background:#f5f5f5;padding-bottom:80px;">
    <div style="background:linear-gradient(135deg,#1a73e8,#0d47a1);padding:30px 20px;color:#fff;text-align:center;">
      <h2 style="font-size:20px;margin-bottom:16px;">我的推广中心</h2>
      <div style="display:flex;justify-content:space-around;margin-top:20px;">
        <div style="text-align:center;">
          <div style="font-size:28px;font-weight:bold;">{{ account.total_invited || 0 }}</div>
          <div style="font-size:12px;opacity:0.8;">累计邀请</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:28px;font-weight:bold;">¥{{ ((account.total_rebate_earned||0)/100).toFixed(2) }}</div>
          <div style="font-size:12px;opacity:0.8;">累计返学费</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:28px;font-weight:bold;">¥{{ ((account.available_rebate||0)/100).toFixed(2) }}</div>
          <div style="font-size:12px;opacity:0.8;">可用余额</div>
        </div>
      </div>
    </div>
    <div style="background:#fff;margin:12px;border-radius:12px;padding:20px;text-align:center;">
      <div style="font-size:16px;font-weight:bold;margin-bottom:16px;">我的专属推广码</div>
      <img v-if="qrCode" :src="qrCode" style="width:200px;height:200px;margin-bottom:12px;">
      <div style="font-size:13px;color:#666;margin-bottom:8px;">长按二维码保存，分享给好友</div>
      <div style="font-size:12px;color:#999;word-break:break-all;padding:8px;background:#f5f5f5;border-radius:6px;">{{ promoLink }}</div>
      <button @click="copyLink" style="margin-top:10px;background:#1a73e8;color:#fff;border:none;padding:8px 20px;border-radius:16px;font-size:14px;cursor:pointer;">复制链接</button>
    </div>
    <div style="background:#fff;margin:12px;border-radius:12px;padding:20px;">
      <div style="font-size:16px;font-weight:bold;margin-bottom:12px;">推广文案</div>
      <div style="background:#f5f5f5;padding:12px;border-radius:8px;font-size:14px;line-height:1.6;color:#333;">{{ promoText }}</div>
      <button @click="copyText" style="margin-top:10px;background:#fff;color:#1a73e8;border:1px solid #1a73e8;padding:8px 20px;border-radius:16px;font-size:14px;cursor:pointer;">复制文案</button>
    </div>
    <div style="background:#fff;margin:12px;border-radius:12px;padding:20px;">
      <div style="font-size:16px;font-weight:bold;margin-bottom:12px;">推广明细</div>
      <div v-if="records.length === 0" style="text-align:center;color:#999;padding:20px;">暂无推广记录</div>
      <div v-for="r in records" :key="r.id" style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #f0f0f0;">
        <div>
          <div style="font-size:14px;">{{ r.invited_phone || '用户***' }}</div>
          <div style="font-size:12px;color:#999;">{{ r.created_at }}</div>
        </div>
        <div style="text-align:right;">
          <div style="color:#e53935;font-weight:bold;">+¥{{ (r.amount/100).toFixed(2) }}</div>
          <div style="font-size:12px;color:#4caf50;">已到账</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'
import axios from 'axios'
const user = JSON.parse(localStorage.getItem('user') || '{}')
const promoLink = ref(window.location.origin + '/?inviter=' + user.id)
const qrCode = ref('')
const account = ref({})
const records = ref([])
const promoText = ref(`首席数据官CDO培训火热报名中！权威讲师、实战案例、考试通过后颁发电子证书。现在通过我的链接报名，你也能获得推广返学费！\n${promoLink.value}`)
onMounted(async () => {
  qrCode.value = await QRCode.toDataURL(promoLink.value)
  try {
    const res = await axios.get('/api/account', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
    account.value = res.data
    const rec = await axios.get('/api/rebate-records', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
    records.value = rec.data
  } catch (e) {}
})
const copyLink = () => { navigator.clipboard.writeText(promoLink.value); alert('链接已复制') }
const copyText = () => { navigator.clipboard.writeText(promoText.value); alert('文案已复制') }
</script>
