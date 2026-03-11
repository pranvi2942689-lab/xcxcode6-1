# 潮阁火锅点餐小程序

潮阁火锅点餐小程序是一个可直接用于微信小程序到店点餐场景的完整全栈项目，包含原生微信小程序用户端、Node.js + Express 后端、本地 JSON 数据存储、Docker 部署文件和 Nginx HTTPS 反向代理示例。

项目默认正式接口域名固定为：

`https://api.chaogexiaochengxu.cn`

后端部署目标目录固定示例为：

`/opt/miniapp-server`

## 项目结构

```text
chaoge-hotpot-miniapp
├─ miniapp
│  ├─ app.js
│  ├─ app.json
│  ├─ app.wxss
│  ├─ assets
│  ├─ components
│  ├─ config
│  ├─ pages
│  ├─ services
│  ├─ utils
│  ├─ project.config.json
│  └─ sitemap.json
├─ server
│  ├─ app.js
│  ├─ server.js
│  ├─ controllers
│  ├─ data
│  ├─ middleware
│  ├─ routes
│  ├─ scripts
│  ├─ services
│  ├─ utils
│  ├─ Dockerfile
│  └─ package.json
├─ certs
├─ docker-compose.yml
├─ nginx.example.conf
├─ package.json
└─ README.md
```

## 微信开发者工具导入方式

1. 打开微信开发者工具。
2. 选择“导入项目”。
3. 项目目录选择本仓库下的 `miniapp` 目录。
4. AppID 可先使用你自己的小程序 AppID，或在开发阶段使用测试号。
5. 导入后在“小程序后台 -> 开发管理 -> 开发设置 -> 服务器域名”中配置合法 request 域名：

`https://api.chaogexiaochengxu.cn`

## 小程序正式域名唯一修改位置

如果未来要更换正式接口域名，只修改这一处：

`miniapp/config/index.js`

项目中没有本地回环地址、局域网备用地址或开发环境分支域名配置。

## 后端部署到腾讯云服务器

以下步骤按 Ubuntu 服务器、Docker Compose、Nginx HTTPS 反向代理的正式部署方式编写。

### 1. 准备服务器环境

在腾讯云 Ubuntu 服务器上安装 Docker 和 Docker Compose 插件。

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker
```

### 2. 上传项目到服务器

将整个 `chaoge-hotpot-miniapp` 目录上传到服务器，并放到：

`/opt/miniapp-server`

示例：

```bash
sudo mkdir -p /opt/miniapp-server
sudo chown -R $USER:$USER /opt/miniapp-server
cd /opt/miniapp-server
```

### 3. 准备 HTTPS 证书

把 SSL 证书文件放到：

`/opt/miniapp-server/certs/fullchain.pem`

`/opt/miniapp-server/certs/privkey.pem`

`nginx.example.conf` 已经默认引用这两个文件路径。

### 4. 检查域名解析

确保 `api.chaogexiaochengxu.cn` 的 DNS A 记录已经指向腾讯云服务器公网 IP。

### 5. 启动服务

进入部署目录后执行：

```bash
cd /opt/miniapp-server
docker compose up -d --build
```

查看容器状态：

```bash
docker compose ps
```

查看日志：

```bash
docker compose logs -f backend
docker compose logs -f nginx
```

### 6. 验证服务可用

浏览器或命令行访问：

`https://api.chaogexiaochengxu.cn/api/health`

期望返回结构：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "status": "ok",
    "timestamp": "2026-03-10T00:00:00.000Z",
    "serviceName": "chaoge-hotpot-miniapp-server"
  }
}
```

## Docker 与 Compose 说明

根目录 `docker-compose.yml` 已包含两个服务：

- `backend`：构建自 `./server`，只 `expose 3000`，不直接暴露公网。
- `nginx`：使用 `nginx:alpine`，对外监听 `80/443`，并反向代理到 `http://backend:3000`。

启动：

```bash
docker compose up -d --build
```

停止：

```bash
docker compose down
```

重启：

```bash
docker compose restart
```

## Nginx 配置方式

根目录 `nginx.example.conf` 已提供以下能力：

- `80` 强制跳转到 `443`
- `server_name api.chaogexiaochengxu.cn`
- SSL 证书示例路径
- 反向代理到 `http://backend:3000`
- 常用 `proxy_set_header`

默认挂载位置已经写入 `docker-compose.yml`：

```yaml
volumes:
  - ./nginx.example.conf:/etc/nginx/conf.d/default.conf:ro
  - ./certs:/etc/nginx/certs:ro
```

## 数据存储说明

订单会真实写入：

`server/data/orders.json`

容器启动时已通过 volume 挂载保持持久化：

```yaml
volumes:
  - ./server/data:/app/data
```

如果需要重置样例数据，可在项目根目录执行：

```bash
npm run gen:data
```

或直接在 `server` 目录执行：

```bash
npm run gen:data
```

## 后端接口

- `GET /api/health`
- `GET /api/store`
- `GET /api/categories`
- `GET /api/dishes`
- `GET /api/dishes/:id`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`

统一返回结构：

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

## 常见问题

### 1. 小程序请求失败

- 检查 `https://api.chaogexiaochengxu.cn/api/health` 是否可访问。
- 检查服务器 `docker compose ps` 是否正常。
- 检查 `backend` 和 `nginx` 日志是否报错。

### 2. 合法域名未配置

- 进入微信公众平台，确认小程序后台已添加合法 request 域名：
  `https://api.chaogexiaochengxu.cn`
- 注意必须是 HTTPS 域名。

### 3. HTTPS 证书错误

- 确认 `certs/fullchain.pem` 和 `certs/privkey.pem` 文件存在。
- 确认证书与域名 `api.chaogexiaochengxu.cn` 匹配。
- 确认证书没有过期。

### 4. Nginx 反代错误

- 检查 `nginx.example.conf` 是否正确挂载到 `/etc/nginx/conf.d/default.conf`
- 检查 `proxy_pass http://backend:3000;` 是否保留。
- 检查 `docker compose logs -f nginx` 输出。

### 5. Docker 容器未启动

- 执行 `docker compose ps`
- 如果状态异常，执行 `docker compose logs -f backend` 或 `docker compose logs -f nginx`
- 检查服务器 `80`、`443` 端口是否开放

### 6. 订单无法写入 JSON

- 检查 `server/data/orders.json` 是否存在
- 检查 `./server/data:/app/data` volume 挂载是否生效
- 检查当前部署用户对 `/opt/miniapp-server/server/data` 是否有写权限

## 运行命令

安装后端依赖：

```bash
npm run install:server
```

启动 Docker 正式部署：

```bash
docker compose up -d --build
```

本项目重点是正式部署到腾讯云服务器后直接给微信小程序使用，不依赖本地回环地址联调方案。
