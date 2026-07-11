<template>
  <div style="min-height:100vh;background:#f5f5f5;">
    <!-- Banner 区域 -->
    <div style="position:relative;overflow:hidden;">
      <img src="/banner.jpg" style="width:100%;height:200px;object-fit:cover;display:block;" alt="CDO培训">
      <div style="position:absolute;bottom:0;left:0;right:0;padding:20px;background:linear-gradient(transparent,rgba(0,0,0,0.7));color:#fff;">
        <div style="font-size:12px;background:rgba(255,255,255,0.2);display:inline-block;padding:4px 12px;border-radius:12px;margin-bottom:8px;">🔥 北京正式启动</div>
        <h1 style="font-size:20px;margin-bottom:4px;font-weight:700;">首席数据官 CDO 培训认证</h1>
        <p style="font-size:12px;opacity:0.9;">工信部人才交流中心官方认证 · 精品小班 · 限额30人</p>
      </div>
    </div>

    <!-- 培训背景 -->
    <div id="detail" style="padding:20px;background:#fff;margin:12px;border-radius:12px;">
      <h3 style="font-size:16px;margin-bottom:12px;font-weight:700;display:flex;align-items:center;">
        <span style="background:#1a73e8;color:#fff;width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:12px;margin-right:8px;">1</span>
        培训背景
      </h3>
      <p style="font-size:13px;color:#555;line-height:1.8;">
        在国家数据要素系列政策持续推进下，《数据产权登记工作指引》《数字经济促进法》相关配套文件陆续落地，数据资产合规治理、入账流通、价值变现成为所有政企数字化转型核心工作。
      </p>
      <p style="font-size:13px;color:#555;line-height:1.8;margin-top:8px;">
        当前市场极度缺少同时精通数据战略、合规风控、资产估值、业务落地的复合型 CDO 管理人才。各地政府、国企、上市企业、金融机构均增设 CDO / 数据总监核心岗位，<strong>持证专业人才成为项目申报、内部晋升、招投标评审的核心加分项</strong>。
      </p>
    </div>

    <!-- 四大核心优势 -->
    <div style="padding:20px;background:#fff;margin:12px;border-radius:12px;">
      <h3 style="font-size:16px;margin-bottom:16px;font-weight:700;">🎯 四大核心优势</h3>
      <img src="/course-data.jpg" style="width:100%;border-radius:10px;margin-bottom:16px;" alt="数据治理">
      <div v-for="(adv, i) in advantages" :key="i" style="display:flex;align-items:flex-start;margin-bottom:16px;padding:12px;background:#f8f9fa;border-radius:10px;">
        <div style="font-size:24px;margin-right:12px;flex-shrink:0;">{{ adv.icon }}</div>
        <div>
          <div style="font-size:14px;font-weight:700;color:#333;margin-bottom:4px;">{{ adv.title }}</div>
          <div style="font-size:12px;color:#666;line-height:1.6;">{{ adv.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 招生对象 -->
    <div style="padding:20px;background:#fff;margin:12px;border-radius:12px;">
      <h3 style="font-size:16px;margin-bottom:16px;font-weight:700;">👥 招生对象</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div v-for="(t, i) in targets" :key="i" style="font-size:12px;color:#333;background:#f0f7ff;padding:8px 10px;border-radius:8px;border-left:3px solid #1a73e8;">
          {{ t }}
        </div>
      </div>
    </div>

    <!-- 课程日程 -->
    <div style="padding:20px;background:#fff;margin:12px;border-radius:12px;">
      <h3 style="font-size:16px;margin-bottom:16px;font-weight:700;">📅 课程日程</h3>
      <div v-for="(day, di) in schedule" :key="di" style="margin-bottom:16px;">
        <div style="font-size:14px;font-weight:700;color:#1a73e8;margin-bottom:8px;padding:6px 12px;background:#e8f0fe;border-radius:6px;">{{ day.title }}</div>
        <div v-for="(item, si) in day.items" :key="si" style="display:flex;align-items:flex-start;margin-bottom:8px;padding-left:8px;">
          <span style="color:#1a73e8;font-size:16px;margin-right:8px;flex-shrink:0;">▸</span>
          <span style="font-size:13px;color:#555;line-height:1.5;">{{ item }}</span>
        </div>
      </div>
      <div style="font-size:12px;color:#888;margin-top:8px;padding:10px;background:#f8f9fa;border-radius:8px;">
        ✅ <strong>自愿增值环节：</strong>考试结束后开放前沿数据开发应用产品观摩体验，组织行业专家、全体学员开展闭门专题研讨，交流数据资产落地模式、行业实操经验，搭建全国高端数据产业人脉圈层。
      </div>
    </div>

    <!-- 费用明细 -->
    <div style="padding:20px;background:#fff;margin:12px;border-radius:12px;">
      <h3 style="font-size:16px;margin-bottom:12px;font-weight:700;">💰 培训费用</h3>
      <div style="text-align:center;padding:20px;background:linear-gradient(135deg,#fff5f5,#fff);border-radius:12px;border:2px solid #e53935;margin-bottom:12px;">
        <div style="font-size:12px;color:#999;">培训费</div>
        <div style="font-size:36px;color:#e53935;font-weight:700;">¥6,800<span style="font-size:14px;">/人</span></div>
        <div style="font-size:12px;color:#666;margin-top:4px;">（开具正规发票）</div>
      </div>
      <div style="font-size:13px;color:#555;line-height:1.8;">
        <div>✅ <strong>费用包含：</strong>全程授课、全套配套教材资料、工信部认证统考、培训期间食宿</div>
        <div>❌ <strong>不含：</strong>学员往返北京交通费用，无任何隐形收费</div>
      </div>
    </div>

    <!-- 报名须知 -->
    <div style="padding:20px;background:#fff;margin:12px;border-radius:12px;">
      <h3 style="font-size:16px;margin-bottom:12px;font-weight:700;">📝 报名须知</h3>
      <ol style="font-size:13px;color:#555;line-height:1.8;padding-left:20px;">
        <li>本期名额有限，采用<strong>先报先得、招满即止</strong>机制，有意向学员请提前提交报名资料锁定席位</li>
        <li>开班前统一发送报到时间、详细场地、行程安排、课前预习资料</li>
        <li>必须<strong>全程参与两天完整培训</strong>，方可获得考试资格，考核通过后发放工信部人才交流中心官方岗位能力评价认证证书</li>
      </ol>
    </div>

    <!-- 组织单位 -->
    <div style="padding:20px;background:#fff;margin:12px;border-radius:12px;text-align:center;">
      <img src="/certificate.jpg" style="width:120px;height:120px;border-radius:50%;margin-bottom:12px;" alt="认证证书">
      <h3 style="font-size:14px;margin-bottom:8px;color:#999;">主办单位</h3>
      <div style="font-size:16px;font-weight:700;color:#1a73e8;">北京乙丁数链科技有限公司</div>
      <div style="font-size:12px;color:#999;margin-top:8px;">培训地点：北京 · 精品小班 · 限额30人/期</div>
    </div>

    <!-- 咨询报名 -->
    <div style="padding:20px;background:linear-gradient(135deg,#1a73e8,#0d47a1);margin:12px;border-radius:12px;color:#fff;text-align:center;">
      <h3 style="font-size:16px;margin-bottom:8px;">📞 咨询与报名</h3>
      <p style="font-size:13px;opacity:0.9;margin-bottom:12px;">小班授课，名额有限，先登记报名学员即可锁定名额</p>
      <div style="font-size:24px;font-weight:700;margin-bottom:8px;">13716560515</div>
      <div style="font-size:12px;opacity:0.8;margin-bottom:16px;">龙老师</div>
      <button @click="goLogin" style="background:#fff;color:#1a73e8;border:none;padding:14px 40px;border-radius:24px;font-size:16px;font-weight:700;cursor:pointer;">立即报名 →</button>
    </div>

    <!-- 底部安全区 -->
    <div style="height:80px;"></div>

    <!-- 底部导航 -->
    <div style="position:fixed;bottom:0;left:0;right:0;height:60px;display:flex;align-items:center;justify-content:space-around;border-top:1px solid #eee;z-index:100;">
      <div style="max-width:480px;width:100%;margin:0 auto;height:100%;display:flex;align-items:center;justify-content:space-around;background:#fff;">
        <span style="color:#1a73e8;font-weight:bold;" @click="$router.push('/')">首页</span>
        <span style="color:#666;" @click="goCourse">学习</span>
        <span style="color:#666;" @click="goPromote">推广</span>
        <span style="color:#666;" @click="goProfile">我的</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const advantages = [
  { icon: '📚', title: '多期迭代成熟课程', desc: '历经多期线下培训打磨，课程完全贴合最新国家数据要素政策，以企业真实数据入表、确权、流通案例为核心，学完即可直接落地。' },
  { icon: '🏙️', title: '北京产业高地', desc: '培训落地北京数字经济核心区域，同步对接政策专家、数据交易所、头部数字化企业资源，两天线下深度交流，链接高端圈层。' },
  { icon: '🏅', title: '工信部官方认证', desc: '全程参训且通过统一考试，获取工信部人才交流中心官方认可岗位能力评价证书，纳入工信人才数据库，官网可查。' },
  { icon: '👨‍🏫', title: '30人精品小班', desc: '严格限制每期30人名额，保障课堂互动、一对一答疑、实训指导效果，拒绝大班填鸭式教学。' }
]

const targets = [
  '政务部门数据治理负责人',
  '城投/金融机构数据板块',
  '国企/科研院校分管领导',
  '上市公司决策层',
  '数据安全/资产评估专业',
  '律所/事务所合规骨干',
  '数字化咨询专业人员',
  '相关专业在校生'
]

const schedule = [
  {
    title: '第一天 · 上午',
    items: ['数据资产全过程合规管理与价值释放全路径']
  },
  {
    title: '第一天 · 下午',
    items: ['数据资产入表实务', '海量行业案例解析', 'CDO 工程实战测试']
  },
  {
    title: '第二天 · 上午',
    items: ['企业数据战略搭建', 'CDO 全流程管理技术解析']
  },
  {
    title: '第二天 · 下午',
    items: ['工信部官方岗位能力评价统一考试']
  }
]

const goLogin = () => { router.push('/login') }
const goCourse = () => { const t = localStorage.getItem('token'); if(t) router.push('/course'); else router.push('/login') }
const goPromote = () => { const t = localStorage.getItem('token'); if(t) router.push('/promote'); else router.push('/login') }
const goProfile = () => { const t = localStorage.getItem('token'); if(t) router.push('/profile'); else router.push('/login') }
const scrollToDetail = () => {
  const el = document.getElementById('detail')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>
