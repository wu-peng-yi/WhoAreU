# 项目部署指南

## 前置要求

1. Node.js >= 16
2. 微信开发者工具（最新版）
3. 微信小程序账号（已开通云开发）

## 一、环境配置

### 1. 安装依赖

```bash
# 安装小程序端依赖
cd miniprogram
npm install

# 安装云函数依赖
cd ../cloudfunctions
npm install
```

### 2. 开通云开发

1. 打开微信开发者工具
2. 导入项目（选择 `miniprogram` 目录）
3. 点击工具栏「云开发」按钮
4. 开通云开发环境（免费版即可）
5. 记录下环境 ID

### 3. 配置环境 ID

修改 `cloudfunctions/draw/index.js`、`cloudfunctions/checkin/index.js`、`cloudfunctions/history/index.js` 中的环境配置：

```javascript
cloud.init({
  env: '你的环境 ID'  // 或使用 cloud.DYNAMIC_CURRENT_ENV
})
```

## 二、数据库初始化

### 1. 创建集合

在微信云开发控制台创建以下数据库集合：

- `users` - 用户信息
- `personalities` - 人格数据
- `draws` - 抽取记录

### 2. 导入人格数据

1. 进入云开发控制台 -> 数据库
2. 选择 `personalities` 集合
3. 点击「导入」
4. 使用 `cloudfunctions/draw/personalities.json` 文件导入初始数据

### 3. 设置数据库权限

为了允许小程序端访问，需要设置集合权限：

```
users: 所有用户可读写自己的数据
personalities: 所有用户可读
draws: 所有用户可读写自己的数据
```

或在云函数中通过服务端 SDK 操作（推荐）。

## 三、运行项目

### 开发模式

```bash
cd miniprogram
npm run dev:weapp
```

然后在微信开发者工具中查看编译结果。

### 生产构建

```bash
cd miniprogram
npm run build:weapp
```

## 四、云函数部署

在微信开发者工具中：

1. 右键点击 `cloudfunctions/draw` 目录
2. 选择「上传并部署：云端安装依赖」
3. 对 `checkin` 和 `history` 重复此操作

## 五、常见问题

### Q: 云函数调用失败？

A: 检查以下几点：
1. 云函数是否已部署
2. 环境 ID 是否正确
3. 云函数名称是否匹配
4. 查看云函数日志

### Q: 数据库操作失败？

A: 检查集合权限设置，确保云函数有权限访问。

### Q: 编译报错？

A: 确保已安装所有依赖，尝试删除 `node_modules` 后重新安装。

## 六、下一步

项目框架已完成，接下来需要：

1. [ ] 配置有效的 AppID
2. [ ] 初始化云开发数据库
3. [ ] 部署云函数
4. [ ] 完善 UI 设计
5. [ ] 开发分享海报功能
6. [ ] 开发人格商店功能
