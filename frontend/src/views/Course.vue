<template>
  <div style="min-height:100vh;background:#f5f5f5;">
    <div style="background:#fff;padding:16px 20px;border-bottom:1px solid #eee;">
      <h2 style="font-size:18px;">我的课程</h2>
    </div>
    <div v-if="!hasAccess" style="padding:40px 20px;text-align:center;background:#fff;margin:20px;border-radius:12px;">
      <p style="font-size:16px;color:#666;margin-bottom:20px;">您尚未报名，请先完成报名</p>
      <button @click="$router.push('/enroll')" style="background:#1a73e8;color:#fff;border:none;padding:12px 32px;border-radius:24px;font-size:16px;cursor:pointer;">去报名</button>
    </div>
    <div v-else style="padding:20px;">
      <div v-for="(chapter, idx) in chapters" :key="idx" style="background:#fff;border-radius:12px;padding:16px;margin-bottom:12px;">
        <div style="font-size:16px;font-weight:bold;margin-bottom:8px;">{{ chapter.title }}</div>
        <div v-for="(video, vidx) in chapter.videos" :key="vidx" style="display:flex;align-items:center;padding:10px 0;border-bottom:1px solid #f0f0f0;cursor:pointer;" @click="playVideo(video)">
          <span style="color:#1a73e8;margin-right:10px;font-size:18px;">▶</span>
          <div style="flex:1;">
            <div style="font-size:14px;">{{ video.title }}</div>
            <div style="font-size:12px;color:#999;">{{ video.duration }}</div>
          </div>
          <span v-if="video.progress === 100" style="color:#4caf50;font-size:12px;">已学完</span>
          <span v-else-if="video.progress > 0" style="color:#ff9800;font-size:12px;">{{ video.progress }}%</span>
          <span v-else style="color:#999;font-size:12px;">未开始</span>
        </div>
      </div>
    </div>
    <div v-if="currentVideo" style="position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:1000;display:flex;flex-direction:column;justify-content:center;align-items:center;">
      <video :src="currentVideo.url" controls style="width:100%;max-height:70vh;"></video>
      <div style="color:#fff;margin-top:16px;font-size:14px;">{{ currentVideo.title }}</div>
      <button @click="currentVideo=null" style="margin-top:20px;background:#fff;color:#333;border:none;padding:10px 30px;border-radius:20px;cursor:pointer;">关闭</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
const hasAccess = ref(false)
const currentVideo = ref(null)
const chapters = ref([
  { title: '第一章：数据战略与治理', videos: [
    { title: '1.1 什么是首席数据官', duration: '15:30', progress: 0, id: 'v1' },
    { title: '1.2 数据治理框架', duration: '22:15', progress: 0, id: 'v2' }
  ]},
  { title: '第二章：数据资产管理', videos: [
    { title: '2.1 数据资产盘点', duration: '18:45', progress: 0, id: 'v3' },
    { title: '2.2 数据质量管理', duration: '25:20', progress: 0, id: 'v4' }
  ]}
])
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
