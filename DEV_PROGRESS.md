# 今天演谁 - 开发进度记录

> 最后更新：2026-03-13

## 项目概述
一个基于 Taro + 微信云开发的趣味小程序，每天抽取不同人格进行角色扮演体验。

---

## ✅ 已完成的功能

### 1. 数据库
- [x] 人格数据结构设计（20 条完整人格数据）
- [x] 数据库集合设计：`personalities`、`users`、`draws`
- [x] 云函数初始化脚本（init 云函数）

### 2. 云函数 (cloudfunctions/)
| 云函数 | 状态 | 说明 |
|--------|------|------|
| draw | ✅ 完成 | 抽取人格，支持每日一次、重置币、30 天不重复 |
| checkin | ✅ 完成 | 提交打卡，记录完成情况和评分 |
| history | ✅ 完成 | 获取历史记录列表和单个记录详情 |
| user | ✅ 完成 | 获取用户信息，自动创建新用户 |
| init | ✅ 完成 | 初始化 20 条人格数据 |

### 3. 小程序页面 (miniprogram/src/pages/)
| 页面 | 状态 | 说明 |
|------|------|------|
| index | ✅ 云开发对接完成 | 首页，抽取人格、重置币、用户信息 |
| card | ✅ 云开发对接完成 | 人格卡片详情，打卡功能 |
| history | ✅ 云开发对接完成 | 历史记录列表，从云数据库加载 |
| shop | ✅ 静态页面完成 | 人格商店，展示人格包和会员入口 |

### 4. 工具类
- [x] `src/utils/cloud.ts` - 云开发工具类
  - `draw()` - 抽取人格
  - `getUserInfo()` - 获取用户信息
  - `getHistory()` - 获取历史记录
  - `getRecord()` - 获取单个记录详情
  - `checkin()` - 提交打卡
  - `initPersonalities()` - 初始化人格数据

### 5. 样式
- [x] 全局样式 (app.scss)
- [x] 各页面样式文件 (index.scss, card.scss, history.scss, shop.scss)
- [x] 紫色渐变主题 (#8B5CF6)
- [x] 底部 TabBar 导航

### 6. 配置
- [x] 云开发初始化（app.ts 中调用）
- [x] AppID: `wx2b8f1fb7fbf4c0ca` (开发用) / `wx1bbbac2f58eda487`
- [x] 云环境：动态当前环境 (`cloud.DYNAMIC_CURRENT_ENV`)

---

## 📝 本次更新内容 (2026-03-13)

### 修复的问题
1. **WXSS 编译错误** - 修复 `card.wxss` 中 `.speech-compare` 被错误编译成中文的问题
2. **云开发未初始化** - 在 `app.ts` 中添加 `CloudUtil.init()` 初始化
3. **Button 未定义** - 在 `shop.tsx` 中添加 `Button` 组件导入
4. **中文类名问题** - 修复 `card.tsx` 中的 `speech 对比` 为 `speech-compare`

### 新增功能
1. **云开发对接完成**
   - 所有页面从模拟数据切换到云开发 API
   - 首页：抽取人格、重置币逻辑对接
   - 历史页：从云数据库加载真实记录
   - 卡片页：加载人格详情、提交打卡
   - CloudUtil 工具类封装

2. **文档更新**
   - 新增 `docs/CLOUD_INIT.md` - 云开发数据库初始化指南
   - 包含完整的初始化步骤、数据库结构、常见问题

---

## ⏳ 待完成的功能

### 高优先级
1. **云函数部署**
   ```bash
   # 在微信开发者工具中操作
   # 右键每个云函数文件夹 → 上传并部署：云端安装依赖
   - cloudfunctions/init
   - cloudfunctions/draw
   - cloudfunctions/checkin
   - cloudfunctions/history
   - cloudfunctions/user
   ```

2. **数据库初始化**
   - 在云开发控制台创建 3 个集合
   - 执行 `init` 云函数初始化人格数据

3. **完整测试**
   - 抽取人格流程
   - 打卡功能
   - 历史记录查看

### 中优先级
1. **分享功能**
   - 生成分享海报
   - 人格卡片图片导出

2. **打卡功能完善**
   - 拍照上传
   - 打卡笔记输入

### 低优先级
1. **商店系统**
   - 人格包购买逻辑
   - 会员开通
   - 支付集成

2. **成就系统**
   - 连续打卡成就
   - 人格收集成就

---

## 📁 项目结构
```
/Users/wupengyi/workSpace/code/WhoAreU/
├── project.config.json          # 微信开发者工具配置
├── miniprogram/                 # 小程序代码
│   ├── src/
│   │   ├── pages/               # 页面组件
│   │   │   ├── index/           # 首页
│   │   │   ├── card/            # 人格卡片
│   │   │   ├── history/         # 历史记录
│   │   │   └── shop/            # 商店
│   │   ├── utils/
│   │   │   └── cloud.ts         # 云开发工具类
│   │   ├── app.ts               # 应用入口（含云初始化）
│   │   ├── app.scss
│   │   └── app.config.ts
│   ├── dist/                    # 编译输出
│   └── package.json
├── cloudfunctions/              # 云函数
│   ├── init/                    # 初始化人格数据
│   ├── draw/                    # 抽取人格
│   ├── checkin/                 # 打卡提交
│   ├── history/                 # 历史记录
│   ├── user/                    # 用户信息
│   └── package.json
└── docs/
    ├── prd.md                   # 产品需求文档
    ├── DEPLOYMENT.md            # 部署文档
    └── CLOUD_INIT.md            # 云开发初始化指南
```

---

## 🚀 快速开始

### 1. 编译小程序
```bash
cd miniprogram
npm run build:weapp
```

### 2. 微信开发者工具
1. 导入项目：选择项目根目录
2. 编译后即可预览

### 3. 部署云函数
在微信开发者工具中：
1. 展开 `cloudfunctions` 目录
2. 右键每个云函数文件夹 → 「上传并部署：云端安装依赖」

### 4. 初始化数据库
1. 在云开发控制台创建集合：`personalities`、`users`、`draws`
2. 执行 `init` 云函数自动写入 20 条人格数据

---

## 🔧 技术栈
- 小程序框架：Taro 3.6.36
- UI 框架：React 18
- 开发语言：TypeScript
- 后端服务：微信云开发
- 云函数运行时：Nodejs16.13

---

## 📞 下一步开发建议
1. ✅ ~~云开发对接完成~~
2. ⏳ 在微信开发者工具中上传并部署云函数
3. ⏳ 创建数据库集合并执行初始化
4. ⏳ 测试完整流程：抽取 → 查看 → 打卡 → 历史记录
5. ⏳ 实现分享海报生成功能
