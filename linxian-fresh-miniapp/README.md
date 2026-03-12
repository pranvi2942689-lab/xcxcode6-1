# 邻鲜到家

社区生鲜配送 / 社区团购 / 到家买菜微信小程序全栈项目，包含：

- `server`：Node.js + Express + JSON 数据存储
- `miniapp`：原生微信小程序用户端
- `admin`：Vue3 + Vite + Element Plus 管理后台
- `deploy`：Nginx、PM2、systemd 部署示例

## 目录结构

```text
linxian-fresh-miniapp/
  server/
  miniapp/
  admin/
  deploy/
  package.json
  README.md
```

## 环境要求

- Node.js 18+
- npm 9+
- 微信开发者工具

## 安装与启动

根目录安装 workspace 依赖：

```bash
npm install
```

初始化后端种子数据：

```bash
npm run seed
```

启动后端：

```bash
npm run dev:server
```

启动后台：

```bash
npm run dev:admin
```

后台构建：

```bash
npm run build:admin
```

## 服务地址

- 后端默认端口：`3000`
- 健康检查：`http://127.0.0.1:3000/api/health`
- 管理后台本地开发：`http://127.0.0.1:5173`

## 小程序导入方式

微信开发者工具导入目录：

```text
linxian-fresh-miniapp/miniapp
```

建议关闭“校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书”后进行本地联调。

## API_BASE_URL 配置位置

正式域名默认值：

- 小程序：`miniapp/config/index.js`
- 后台：`admin/src/utils/request.js` 读取 `VITE_API_BASE_URL`
- 后端：`server/.env` 中 `API_BASE_URL`

微信服务端密钥只允许放在服务端私有环境变量中，不要写入前端代码或公开文档。

## 后端环境变量

复制 `server/.env.example` 为 `server/.env`：

```env
APP_PORT=3000
API_BASE_URL=https://api.chaogexiaochengxu.cn
WECHAT_CLOUD_ENV_ID=wxd6d37edecab159ac
NODE_ENV=production
```

## 默认账号

- 后台：`admin / 123456`
- 小程序演示登录页：默认模拟登录到 `13800000001`

## 联调说明

- 小程序端统一使用 `miniapp/utils/request.js`
- 购物车统一使用 `miniapp/utils/cart.js`
- 后台统一使用 `admin/src/utils/request.js`
- 所有后端修改类接口都会写回 `server/data/*.json`

## 真机调试

1. 将正式域名加入微信小程序合法 request 域名。
2. 保持 `miniapp/config/index.js` 中 `API_BASE_URL` 指向正式域名。
3. 使用微信开发者工具上传体验版后真机预览。

## Nginx 部署

示例见：

- `deploy/nginx.conf.example`

推荐部署方式：

1. 后端服务常驻在 `127.0.0.1:3000`
2. Nginx 反向代理 `api.chaogexiaochengxu.cn`
3. 管理后台构建产物部署到静态目录

## PM2 / systemd

示例见：

- `deploy/pm2.config.cjs`
- `deploy/systemd.service.example`

PM2 启动示例：

```bash
pm2 start deploy/pm2.config.cjs
pm2 save
```

## 常见问题

### 1. 启动后接口 404

先执行：

```bash
npm run seed
```

再确认后端日志中是否已输出健康检查地址。

### 2. 小程序图片不显示

确认后端 `/static` 资源可访问，并检查小程序合法域名配置。

### 3. 后台登录失败

确认已执行种子脚本，且使用默认账号 `admin / 123456`。

### 4. 订单预览提示地址为空

先在小程序“地址管理”新增地址，或在结算页从地址列表选择。

## 数据文件

种子脚本会生成以下核心数据：

- `users.json`
- `admins.json`
- `communities.json`
- `categories.json`
- `goods.json`
- `banners.json`
- `sections.json`
- `coupons.json`
- `userCoupons.json`
- `orders.json`
- `addresses.json`
- `carts.json`
- `contents.json`
- `serviceTickets.json`
- `systemConfig.json`

## 自检建议

- 访问 `GET /api/health`
- 后台登录后查看 Dashboard 是否有统计数据
- 小程序执行：登录 -> 加购 -> 结算 -> 下单 -> 支付 -> 订单详情 -> 售后申请
