<template>
  <div style="min-height:100vh;padding:20px;padding-bottom:140px;background:#f5f5f5;">
    <div style="display:flex;align-items:center;margin-bottom:16px;">
      <span style="font-size:20px;margin-right:8px;cursor:pointer;" @click="$router.back()">←</span>
      <h2 style="font-size:18px;">填写报名信息</h2>
    </div>

    <!-- 课程信息卡片 -->
    <div style="background:linear-gradient(135deg,#1a73e8,#0d47a1);border-radius:12px;padding:16px;color:#fff;margin-bottom:16px;">
      <div style="font-size:14px;font-weight:700;margin-bottom:4px;">首席数据官 CDO 培训认证</div>
      <div style="font-size:12px;opacity:0.9;">北京 · 2天线下课程 · 工信部官方认证</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
        <div>
          <span style="font-size:12px;opacity:0.8;">原价</span>
          <span style="font-size:12px;text-decoration:line-through;opacity:0.7;margin-left:4px;">¥8,800</span>
        </div>
        <div style="font-size:24px;font-weight:700;">¥6,800</div>
      </div>
    </div>

    <!-- 报名表单 -->
    <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:12px;">
      <div v-for="field in fields" :key="field.key" style="margin-bottom:16px;">
        <label style="font-size:14px;color:#333;display:block;margin-bottom:6px;font-weight:500;">
          {{ field.label }}{{ field.required ? ' *' : '' }}
        </label>
        <input v-if="field.type === 'text'" v-model="form[field.key]" :placeholder="field.placeholder" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:15px;outline:none;" :disabled="field.key === 'phone'">
        <select v-if="field.type === 'select'" v-model="form[field.key]" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:15px;background:#fff;outline:none;">
          <option value="">请选择</option>
          <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
    </div>

    <!-- 课程套餐 -->
    <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:12px;">
      <h3 style="font-size:16px;margin-bottom:12px;font-weight:700;">📦 课程套餐</h3>
      <div style="border:2px solid #1a73e8;border-radius:10px;padding:16px;background:#f8f9ff;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-size:16px;font-weight:bold;">标准版</span>
          <span style="font-size:20px;color:#e53935;font-weight:bold;">¥6,800</span>
        </div>
        <div style="font-size:12px;color:#666;line-height:1.6;">
          ✓ 2天线下全程授课<br>
          ✓ 全套配套教材资料<br>
          ✓ 工信部认证统考<br>
          ✓ 培训期间食宿<br>
          ✓ 推广返学费 20%
        </div>
      </div>
      <div style="font-size:12px;color:#999;margin-top:8px;">❌ 不含往返北京交通费用</div>
    </div>

    <!-- 学费抵扣 -->
    <div v-if="account.available_rebate > 0" style="background:#fff;border-radius:12px;padding:20px;margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:15px;">💰 使用学费抵扣金</span>
        <span style="color:#e53935;font-weight:bold;">-¥{{ (account.available_rebate/100).toFixed(2) }}</span>
      </div>
      <div style="font-size:12px;color:#999;margin-top:4px;">可用抵扣金 ¥{{ (account.available_rebate/100).toFixed(2) }}</div>
      <div style="margin-top:10px;">
        <label style="font-size:14px;"><input type="checkbox" v-model="useRebate" style="margin-right:6px;">使用抵扣金</label>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div style="position:fixed;bottom:0;left:0;right:0;border-top:1px solid #eee;z-index:100;">
      <div style="max-width:480px;margin:0 auto;background:#fff;padding:16px 20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div>
            <div style="font-size:12px;color:#666;">实付金额</div>
            <div style="font-size:24px;color:#e53935;font-weight:bold;">¥{{ (finalAmount/100).toFixed(2) }}</div>
            <div v-if="useRebate && account.available_rebate > 0" style="font-size:11px;color:#999;">已抵扣 ¥{{ (Math.min(account.available_rebate,680000)/100).toFixed(2) }}</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;">
          <button @click="submit" style="flex:1;background:#1a73e8;color:#fff;border:none;padding:12px;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;">提交报名</button>
          <a href="tel:13716560515" style="flex:1;background:#4caf50;color:#fff;border:none;padding:12px;border-radius:8px;font-size:15px;font-weight:700;text-decoration:none;text-align:center;display:block;">📞 联系客服</a>
        </div>
        <div style="font-size:11px;color:#999;text-align:center;margin-top:8px;">提交后请致电 13716560515（龙老师）完成缴费</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const form = ref({ name: '', phone: '', email: '', id_card: '', company: '', position: '', industry: '', work_years: '' })
const useRebate = ref(false)
const account = ref({ available_rebate: 0 })

const fields = [
  { key: 'name', label: '真实姓名', required: true, type: 'text', placeholder: '用于证书发放' },
  { key: 'phone', label: '手机号码', required: true, type: 'text', placeholder: '已验证的手机号' },
  { key: 'email', label: '电子邮箱', required: true, type: 'text', placeholder: '接收课程通知' },
  { key: 'id_card', label: '身份证号', required: true, type: 'text', placeholder: '实名认证' },
  { key: 'company', label: '所属公司', required: true, type: 'text', placeholder: '工作单位' },
  { key: 'position', label: '职位', required: true, type: 'text', placeholder: '当前岗位' },
  { key: 'industry', label: '行业', required: true, type: 'select', placeholder: '请选择', options: ['互联网', '金融', '制造', '政务', '教育', '医疗', '能源', '房地产', '零售', '其他'] },
  { key: 'work_years', label: '工作年限', required: true, type: 'select', placeholder: '请选择', options: ['1年以下', '1-3年', '3-5年', '5-10年', '10年以上'] }
]

const finalAmount = computed(() => {
  let price = 680000
  if (useRebate.value && account.value.available_rebate > 0) {
    price = Math.max(0, price - account.value.available_rebate)
  }
  return price
})

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  form.value.phone = user.phone || ''
  try {
    const res = await axios.get('/api/account', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
    account.value = res.data
  } catch (e) {}
})

const submit = async () => {
  for (const f of fields) {
    if (f.required && !form.value[f.key]) { alert(f.label + '不能为空'); return }
  }
  try {
    const res = await axios.post('/api/enroll', { ...form.value, use_rebate: useRebate.value },
      { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
    if (res.data.ok) {
      alert('报名成功！请致电 13716560515（龙老师）完成缴费，缴费后客服会为您开通课程权限。')
    } else { alert(res.data.msg) }
  } catch (e) { alert('提交失败') }
}
</script>
