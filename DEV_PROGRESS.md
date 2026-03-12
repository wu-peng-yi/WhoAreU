# 今天演谁 - 开发进度记录

> 最后更新：2026-03-12

## 项目概述
一个基于 Taro + 微信云开发的趣味小程序，每天抽取不同人格进行角色扮演体验。

---

## ✅ 已完成的功能

### 1. 数据库
- [x] `personalities.json` 已转换为 JSON Lines 格式（20 条人格数据）
- [x] 可导入云开发数据库 `personalities` 集合

### 2. 云函数 (cloudfunctions/)
| 云函数 | 状态 | 说明 |
|--------|------|------|
| draw | ✅ 完成 | 抽取人格，支持每日一次、重置币功能 |
| checkin | ✅ 完成 | 提交打卡，记录完成情况和评分 |
| history | ✅ 完成 | 获取历史记录列表和单个记录详情 |
| user | ✅ 完成 | 获取用户信息 |
| init | ✅ 完成 | 初始化 20 条人格数据 |

**配置**: `cloudbaserc.json` 已配置所有 5 个云函数

### 3. 小程序页面 (miniprogram/src/pages/)
| 页面 | 状态 | 说明 |
|------|------|------|
| index | ✅ 静态完成 | 首页，显示日期、抽取按钮、重置币数量 |
| card | ✅ 静态完成 | 人格卡片详情，展示任务、说话方式、穿搭、禁忌 |
| history | ✅ 静态完成 | 历史记录列表，显示打卡状态和评分 |
| shop | ✅ 静态完成 | 人格商店，展示人格包和会员入口 |

### 4. 静态数据
所有页面已配置模拟数据，可离线预览效果：
- 首页：5 个模拟人格用于抽取
- 历史页：5 条模拟历史记录
- 商店页：4 个模拟人格包
- 卡片页：1 个模拟人格详情

### 5. 样式
- [x] 全局样式 (app.scss)
- [x] 各页面样式文件 (index.scss, card.scss, history.scss, shop.scss)
- [x] 紫色渐变主题 (#8B5CF6)
- [x] 底部 TabBar 导航

---

## ⏳ 待完成的功能

### 高优先级
1. **云函数部署**
   ```bash
   # 安装云开发 CLI
   npm install -g @cloudbase/cli

   # 登录
   tcb login

   # 部署所有云函数
   cloudbase deploy --force
   ```

2. **数据库初始化**
   - 在云开发控制台导入 `personalities.json`
   - 或调用 `init` 云函数初始化数据
   - 创建集合：`users`, `draws`, `personalities`

3. **云开发配置**
   - 设置数据库集合权限（所有用户可读写）
   - 配置云函数环境

### 中优先级
1. **用户系统**
   - 用户登录授权
   - 用户信息持久化
   - 重置币/积分系统

2. **打卡功能完善**
   - 拍照上传
   - 打卡笔记
   - 星级评分展示

3. **分享功能**
   - 生成分享海报
   - 人格卡片图片导出

### 低优先级
1. **商店系统**
   - 人格包购买
   - 会员开通
   - 支付集成

2. **成就系统**
   - 成就解锁
   - 勋章展示

3. **更多人格**
   - 扩展人格库
   - 人格分类筛选

---

## 📁 项目结构
```
D:\code\WhoAreU/
├── project.config.json          # 微信开发者工具配置
├── cloudbaserc.json             # 云开发配置
├── personalities.json           # 人格数据 (JSON Lines 格式)
├── cloudfunctions/              # 云函数
│   ├── draw/
│   ├── checkin/
│   ├── history/
│   ├── user/
│   └── init/
└── miniprogram/                 # 小程序代码
    ├── src/
    │   ├── pages/               # 页面
    │   ├── services/            # 服务层
    │   ├── types/               # TypeScript 类型
    │   ├── utils/               # 工具函数
    │   ├── app.ts
    │   ├── app.scss
    │   └── app.config.ts
    ├── dist/                    # 编译输出 (微信开发者工具使用此目录)
    └── package.json
```

---

## 🚀 快速开始

### 1. 编译小程序
```bash
cd miniprogram
npm run build:weapp
```

### 2. 微信开发者工具
1. 导入项目：选择 `D:\code\WhoAreU` (根目录)
2. 编译后即可预览

### 3. 部署云函数
```bash
cd D:\code\WhoAreU
cloudbase deploy --force
```

### 4. 初始化数据库
- 方式一：在云开发控制台导入 `cloudfunctions/draw/personalities.json`
- 方式二：调用 `init` 云函数

---

## 🔧 技术栈
- 小程序框架：Taro 3.6.36
- UI 框架：React 18
- 开发语言：TypeScript
- 后端服务：微信云开发
- 运行时：Nodejs16.13

---

## 📝 注意事项
1. 微信开发者工具设置：
   - 关闭「ES6 转 ES5」
   - 关闭「样式增强」(postcss)
   - 项目根目录：`D:\code\WhoAreU`
   - 小程序目录：`miniprogram/dist/`

2. 云开发环境 ID：`cloud1-2gr0itgbe87c6ba9`

3. AppID：`wx1bbbac2f58eda487`

---

## 📞 下一步开发建议
1. 部署云函数到云开发环境
2. 创建数据库集合并设置权限
3. 连接真实云函数调用（目前使用模拟数据）
4. 测试完整流程：抽取 → 查看 → 打卡 → 历史记录
