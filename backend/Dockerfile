# 1. 指定基底映像檔 (使用輕量級的 Node.js Alpine 版本)
FROM node:20-alpine

# 2. 設定容器內的工作目錄
WORKDIR /app

# 3. 複製 package.json 和 package-lock.json (利用 Docker 快取機制加速建置)
COPY package*.json ./

# 4. 安裝依賴套件
RUN npm install

# 5. 複製其餘程式碼
COPY . .

# 6. 開放容器的 3000 Port
EXPOSE 3000

# 7. 定義容器啟動時執行的指令
CMD ["node", "index.js"]