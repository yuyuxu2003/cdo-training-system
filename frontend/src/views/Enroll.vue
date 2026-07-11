<template>
  <div style="min-height:100vh;padding:20px;padding-bottom:100px;background:#f5f5f5;">
    <h2 style="font-size:20px;margin-bottom:20px;">填写报名信息</h2>
    <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:12px;">
      <div v-for="field in fields" :key="field.key" style="margin-bottom:16px;">
        <label style="font-size:14px;color:#333;display:block;margin-bottom:6px;font-weight:500;">
          {{ field.label }}{{ field.required ? ' *' : '' }}
        </label>
        <input v-if="field.type === 'text'" v-model="form[field.key]" :placeholder="field.placeholder" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:15px;">
        <select v-if="field.type === 'select'" v-model="form[field.key]" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:15px;background:#fff;">
          <option value="">请选择</option>
          <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
    </div>
    <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:12px;">
      <h3 style="font-size:16px;margin-bottom:12px;">课程套餐</h3>
      <div style="border:2px solid #1a73e8;border-radius:10px;padding:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:16px;font-weight:bold;">标准版</span>
          <span style="font-size:20px;color:#e53935;font-weight:bold;">¥1,999</span>
        </div>
        <div style="font-size:13px;color:#666;margin-top:8px;">录播课程 + 考试 + 证书 + 推广返学费</div>
      </div>
    </div>
    <div v-if="account.available_rebate > 0" style="background:#fff;border-radius:12px;padding:20px;margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:15px;">使用学费抵扣金</span>
        <span style="color:#e53935;font-weight:bold;">-¥{{ (account.available_rebate/100).toFixed(2) }}</span>
      </div>
      <div style="font-size:12px;color:#999;margin-top:4px;">可用抵扣金 ¥{{ (account.available_rebate/100).toFixed(2) }}</div>
      <div style="margin-top:10px;">
        <label style="font-size:14px;"><input type="checkbox" v-model="useRebate" style="margin-right:6px;">使用抵扣金</label>
      </div>
    </div>
    <div style="position:fixed;bottom:0;left:0;right:0;background:#fff;padding:16px 20px;border-top:1px solid #eee;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-size:12px;color:#666;">实付金额</div>
        <div style="font-size:24px;color:#e53935;font-weight:bold;">¥{{ (finalAmount/100).toFixed(2) }}</div>
      </div>
      <button @click="submit" style="background:#1a73e8;color:#fff;border:none;padding:12px 36px;border-radius:24px;font-size:16px;font-weight:bold;cursor:pointer;">立即支付</button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
const router = useRouter()
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
  { key: 'industry', label: '行业', required: true, type: 'select', placeholder: '请选择', options: ['互联网', '金融', '制造', '政务', '教育', '医疗', '其他'] },
  { key: 'work_years', label: '工作年限', required: true, type: 'select', placeholder: '请选择', options: ['1年以下', '1-3年', '3-5年', '5-10年', '10年以上'] }
]
const finalAmount = computed(() => {
  let price = 199900
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
    if (res.data.ok) { alert('报名成功！请支付订单。'); router.push('/course') }
    else { alert(res.data.msg) }
  } catch (e) { alert('提交失败') }
}
</script>
