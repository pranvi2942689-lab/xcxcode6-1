# 使用 Node.js 官方基础镜像
FROM node:18-alpine

# 设置容器内的工作目录
WORKDIR /app

# 1. 精准定位：只复制 server 文件夹里的 package.json
COPY server/package*.json ./

# 2. 安装后端专属依赖
RUN npm install --production

# 3. 把 server 文件夹里的所有源代码都塞进容器
COPY server/ .

# 4. 暴露 3000 端口
EXPOSE 3000

# 5. 启动后端服务 (这里直接执行 app.js 最稳妥)
CMD ["node", "app.js"]