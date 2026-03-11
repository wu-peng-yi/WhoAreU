# WhoAreU - 今天演谁

一款帮助用户每天体验不同人格的趣味小程序。

## 技术栈

- **前端框架**: Taro 4.x + React + TypeScript
- **样式**: Sass
- **后端**: 微信云开发
  - 云函数 (Node.js 16.13)
  - 云数据库
  - 云存储

## 项目结构

```
WhoAreU/
├── miniprogram/                 # 小程序主目录
│   ├── src/
│   │   ├── pages/              # 页面
│   │   │   ├── index/          # 首页
│   │   │   ├── card/           # 人格卡片页
│   │   │   ├── history/        # 历史记录页
│   │   │   └── shop/           # 商店页
│   │   ├── components/         # 组件
│   │   ├── services/           # API 服务
│   │   ├── types/              # TypeScript 类型
│   │   ├── utils/              # 工具函数
│   │   ├── styles/             # 全局样式
│   │   ├── assets/             # 静态资源
│   │   ├── app.ts              # 应用入口
│   │   ├── app.config.ts       # 应用配置
│   │   └── app.scss            # 全局样式
│   ├── config/                 # 构建配置
│   ├── package.json
│   ├── tsconfig.json
│   └── project.config.json
├── cloudfunctions/              # 云函数
│   ├── draw/                   # 抽取人格
│   ├── checkin/                # 打卡
│   └── history/                # 历史记录
├── docs/                       # 文档
│   └── prd.md
└── package.json
```

## 快速开始

### 1. 安装依赖

```bash
cd miniprogram
npm install
```

### 2. 启动开发服务器

```bash
# 微信小程序
npm run dev:weapp
```

### 3. 构建生产版本

```bash
npm run build:weapp
```

## 云函数部署

```bash
# 安装云函数依赖
cd cloudfunctions
npm install

# 在微信开发者工具中右键云函数目录选择上传并部署
```

## 数据库集合

需要在微信云开发控制台创建以下集合：

- `users` - 用户信息
- `personalities` - 人格数据
- `draws` - 抽取记录

## 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 遵循 ESLint Taro 配置
- 组件使用 Function Component + Hooks

### Git 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构代码
chore: 构建/工具链相关
```

## 相关文档

- [产品需求文档](docs/prd.md)
- [Taro 文档](https://taro-docs.jd.com/)
- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

## 开发计划

- [x] 项目框架搭建
- [x] 核心页面开发
- [x] 云函数基础实现
- [ ] 数据库初始化
- [ ] 分享海报功能
- [ ] 人格商店功能
- [ ] 成就系统

## License

MIT
