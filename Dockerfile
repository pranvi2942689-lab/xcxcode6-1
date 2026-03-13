# 使用轻量级的 Node.js 18 环境
FROM node:18-alpine

# 设置容器内的工作目录
WORKDIR /app

# 先复制 package.json，利用 Docker 缓存机制加速依赖安装
COPY package*.json ./

# 安装生产环境依赖
RUN npm install --production

# 复制所有源代码到容器内
COPY . .

# 暴露 3000 端口（必须与我们服务器 docker-compose 里的端口一致）
EXPOSE 3000

# 启动命令（假设你的 package.json 里面配了 "start": "node server.js"）
# 如果你是直接用 node 启动，也可以改成 CMD ["node", "你的主文件名.js"]
CMD ["npm", "start"]