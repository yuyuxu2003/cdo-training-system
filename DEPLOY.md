# CDO 培训报名系统 —— Render 零元部署教程

> 预计总时间：**20 分钟** | 所需费用：**¥0** | 所需技能：**会点击鼠标**

---

## 前置条件

1. 一个邮箱（注册 GitHub 用）
2. 能上网的电脑

> 不需要：服务器、域名、备案、信用卡

---

## 第一步：注册 GitHub（3分钟）

1. 打开 [github.com](https://github.com)
2. 点右上角 **"Sign up"**
3. 输入邮箱 → 设密码 → 设用户名
4. 验证你是真人
5. 去邮箱点验证链接

---

## 第二步：上传代码到 GitHub（5分钟）

1. 登录 GitHub，点右上角 **"+"** → **"New repository"**
2. 名称填：`cdo-training-system`
3. 选择 **Public**
4. 点 **"Create repository"**
5. 创建后，看到页面中间一行：
   > **"...or upload an existing file."**
   点 **"uploading an existing file"**
6. 把本地 `cdo-render-project` 文件夹里的所有文件**拖拽**进网页框里：
   - `backend/` 文件夹
   - `frontend/` 文件夹
   - `render.yaml`
7. 拉到页面最下面，点 **"Commit changes"**

---

## 第三步：注册 Render 并部署（8分钟，核心！）

1. 打开 [dashboard.render.com](https://dashboard.render.com)
2. 点 **"Get Started for Free"** → **"Continue with GitHub"**
3. 授权 Render 访问你的 GitHub
4. 进入 Render Dashboard，点 **"New"** → **"Blueprint"**
5. 选择你的仓库：`cdo-training-system`
6. 点 **"Connect"** → 点 **"Apply"**
7. Render 自动读取 `render.yaml`，创建：
   - 一个 PostgreSQL 数据库（免费 1GB）
   - 一个 Web Service（运行 Node.js）
8. 等 2-3 分钟，看到绿色 **"Live"** 状态就是部署成功！

---

## 第四步：访问你的网站（2分钟）

1. 部署完成后，Render 会显示一个 URL：
   ```
   https://cdo-training.onrender.com
   ```
2. 点这个链接，打开浏览器，看到首页！
3. 测试登录：
   - 手机号：`13800138000`
   - 验证码：`1234`
   - 登录成功，跳转到报名表单

---

## 第五步：防止休眠（免费保持在线）

1. 打开 [uptimerobot.com](https://uptimerobot.com)
2. 注册免费账号
3. 点 **"Add New Monitor"**
4. 配置：
   - Monitor Type: **HTTP(s)**
   - Friendly Name: **CDO 报名系统**
   - URL: 你的 Render 地址 + `/api/health`
     - 例如：`https://cdo-training.onrender.com/api/health`
   - Monitoring Interval: **5 minutes**（免费版最短）
5. 点 **"Create Monitor"**

> 现在每隔 5 分钟自动访问你的网站，Render 永远不会休眠。

---

## 第六步：更新代码（以后每次改代码）

1. 修改本地代码
2. 重新上传到 GitHub（同第二步）
3. Render 检测代码更新后，**自动重新部署**（约 2 分钟）

---

## 常见问题

| 问题 | 解决方法 |
|------|---------|
| 页面 404 | 检查 render.yaml 的 buildCommand 是否正确把 dist 复制到 backend/public |
| 数据库连不上 | 检查 Render Dashboard 里 PostgreSQL 状态是否为 Available |
| 验证码发不了 | 测试环境固定 `1234`，不需要真实短信 |
| 访问慢（第一次） | 从休眠唤醒，5-10 秒，配 UptimeRobot 后几乎没这个问题 |
| 支付怎么接？ | MVP 测试期：个人微信收款码 + 手动确认；正式期：申请微信支付商户号 |

---

## 技术栈总结

| 层级 | 技术 | 费用 |
|------|------|------|
| 前端 | Vue 3 + Vite + Vant | ¥0 |
| 后端 | Node.js + Express | ¥0 |
| 数据库 | PostgreSQL（Render 免费） | ¥0 |
| 托管 | Render Web Service | ¥0 |
| 域名 | 免费 .onrender.com | ¥0 |
| 唤醒 | UptimeRobot | ¥0 |

**总成本：¥0**

---

> 有问题随时发给我！
