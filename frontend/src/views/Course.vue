<template>
  <div style="min-height:100vh;background:#f5f5f5;">
    <!-- 头部 -->
    <div style="background:#fff;padding:16px 20px;border-bottom:1px solid #eee;display:flex;align-items:center;">
      <span style="font-size:20px;margin-right:12px;cursor:pointer;" @click="$router.back()">←</span>
      <h2 style="font-size:18px;">📚 课程大纲</h2>
    </div>

    <!-- 未报名提示 -->
    <div v-if="!hasAccess" style="padding:40px 20px;text-align:center;background:#fff;margin:20px;border-radius:12px;">
      <div style="font-size:48px;margin-bottom:16px;">🔒</div>
      <p style="font-size:16px;color:#666;margin-bottom:20px;">您尚未报名，请先完成报名</p>
      <button @click="$router.push('/enroll')" style="background:#1a73e8;color:#fff;border:none;padding:12px 32px;border-radius:24px;font-size:16px;cursor:pointer;font-weight:700;">去报名</button>
    </div>

    <div v-else>
      <!-- 课程进度概览 -->
      <div style="padding:20px;background:linear-gradient(135deg,#1a73e8,#0d47a1);margin:12px;border-radius:12px;color:#fff;">
        <div style="font-size:14px;opacity:0.9;margin-bottom:8px;">课程进度</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;">
          <div style="font-size:28px;font-weight:700;">{{ overallProgress }}%</div>
          <div style="font-size:12px;opacity:0.8;">已完成 {{ completedCount }}/{{ totalVideos }} 课时</div>
        </div>
        <div style="height:6px;background:rgba(255,255,255,0.2);border-radius:3px;margin-top:10px;">
          <div :style="{width: overallProgress + '%', height: '100%', background: '#fff', borderRadius: '3px', transition: 'width 0.3s'}"></div>
        </div>
      </div>

      <!-- 课程章节 -->
      <div v-for="(chapter, idx) in chapters" :key="idx" style="background:#fff;border-radius:12px;padding:16px;margin:12px;">
        <div style="font-size:16px;font-weight:700;margin-bottom:4px;color:#333;">{{ chapter.title }}</div>
        <div style="font-size:12px;color:#999;margin-bottom:12px;">{{ chapter.desc }}</div>
        <div v-for="(video, vidx) in chapter.videos" :key="vidx" style="display:flex;align-items:center;padding:12px 0;border-bottom:1px solid #f0f0f0;cursor:pointer;" @click="playVideo(video)">
          <div style="width:40px;height:40px;background:#e8f0fe;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-right:12px;flex-shrink:0;">
            <span style="color:#1a73e8;font-size:16px;">{{ video.progress === 100 ? '✓' : '▶' }}</span>
          </div>
          <div style="flex:1;">
            <div style="font-size:14px;color:#333;">{{ video.title }}</div>
            <div style="font-size:12px;color:#999;margin-top:2px;">{{ video.duration }}</div>
          </div>
          <div style="text-align:right;flex-shrink:0;">
            <span v-if="video.progress === 100" style="color:#4caf50;font-size:12px;background:#e8f5e9;padding:2px 8px;border-radius:10px;">已学完</span>
            <span v-else-if="video.progress > 0" style="color:#ff9800;font-size:12px;">{{ video.progress }}%</span>
            <span v-else style="color:#999;font-size:12px;">未开始</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 视频播放弹窗 -->
    <div v-if="currentVideo" style="position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:1000;display:flex;flex-direction:column;justify-content:center;align-items:center;">
      <div style="max-width:480px;width:100%;margin:0 auto;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:0 16px;">
        <video :src="currentVideo.url" controls style="width:100%;max-height:60vh;border-radius:8px;"></video>
        <div style="color:#fff;margin-top:16px;font-size:14px;text-align:center;">{{ currentVideo.title }}</div>
        <div style="color:#999;margin-top:4px;font-size:12px;text-align:center;">{{ currentVideo.desc }}</div>
        <button @click="currentVideo=null" style="margin-top:20px;background:#fff;color:#333;border:none;padding:10px 30px;border-radius:20px;cursor:pointer;font-weight:700;">关闭</button>
      </div>
    </div>

    <!-- 底部安全区 -->
    <div style="height:20px;"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const hasAccess = ref(false)
const currentVideo = ref(null)

const chapters = ref([
  {
    title: '第一章：数据战略与治理',
    desc: '掌握数据治理框架与数据战略规划方法',
    videos: [
      { title: '1.1 什么是首席数据官（CDO）', duration: '15:30', progress: 0, id: 'v1', desc: 'CDO的定义、职责定位与职业发展路径', url: '/videos/ch1-1.mp4' },
      { title: '1.2 数据治理框架体系', duration: '22:15', progress: 0, id: 'v2', desc: 'DAMA-DMBOK、DCMM等主流数据治理框架', url: '/videos/ch1-2.mp4' },
      { title: '1.3 数据战略规划方法论', duration: '18:40', progress: 0, id: 'v3', desc: '从业务战略到数据战略的对齐与落地', url: '/videos/ch1-3.mp4' }
    ]
  },
  {
    title: '第二章：数据资产管理',
    desc: '数据资产盘点、估值与入表实务',
    videos: [
      { title: '2.1 数据资产盘点与目录建设', duration: '18:45', progress: 0, id: 'v4', desc: '元数据管理、数据目录、数据血缘分析', url: '/videos/ch2-1.mp4' },
      { title: '2.2 数据资产估值与入表', duration: '25:20', progress: 0, id: 'v5', desc: '数据资产估值模型、会计准则、入表流程', url: '/videos/ch2-2.mp4' },
      { title: '2.3 数据质量管理', duration: '20:10', progress: 0, id: 'v6', desc: '数据质量评估、监控、改进闭环', url: '/videos/ch2-3.mp4' }
    ]
  },
  {
    title: '第三章：数据合规与流通',
    desc: '数据合规风控、确权与流通交易',
    videos: [
      { title: '3.1 数据确权与产权登记', duration: '19:30', progress: 0, id: 'v7', desc: '数据产权界定、登记流程、法律保障', url: '/videos/ch3-1.mp4' },
      { title: '3.2 数据合规风控体系', duration: '21:15', progress: 0, id: 'v8', desc: '数据安全法、个人信息保护法合规实践', url: '/videos/ch3-2.mp4' },
      { title: '3.3 数据流通与交易', duration: '17:50', progress: 0, id: 'v9', desc: '数据交易所、数据产品、流通模式', url: '/videos/ch3-3.mp4' }
    ]
  },
  {
    title: '第四章：CDO实战案例',
    desc: '行业标杆案例拆解与实操演练',
    videos: [
      { title: '4.1 金融企业数据治理案例', duration: '23:00', progress: 0, id: 'v10', desc: '银行数据资产入表、风控数据治理', url: '/videos/ch4-1.mp4' },
      { title: '4.2 制造企业数字化转型', duration: '20:45', progress: 0, id: 'v11', desc: '工业数据、供应链数据、质量数据', url: '/videos/ch4-2.mp4' },
      { title: '4.3 政务数据开放共享', duration: '18:20', progress: 0, id: 'v12', desc: '智慧城市、数据要素市场化', url: '/videos/ch4-3.mp4' }
    ]
  }
])

const totalVideos = computed(() => chapters.value.reduce((sum, ch) => sum + ch.videos.length, 0))
const completedCount = computed(() => chapters.value.reduce((sum, ch) => sum + ch.videos.filter(v => v.progress === 100).length, 0))
const overallProgress = computed(() => {
  const total = totalVideos.value
  if (total === 0) return 0
  const completed = completedCount.value
  return Math.round((completed / total) * 100)
})

onMounted(async () => {
  try {
    const res = await axios.get('/api/course-access', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
    hasAccess.value = res.data.hasAccess
  } catch (e) { hasAccess.value = false }
})

const playVideo = async (video) => {
  try {
    const res = await axios.get('/api/video/' + video.id, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
    currentVideo.value = { ...video, url: res.data.url }
  } catch (e) { alert('暂无权限观看完整视频') }
}
</script>
