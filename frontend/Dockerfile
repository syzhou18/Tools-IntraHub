# --- 第一階段：建置 (Build Stage) ---
FROM node:20-alpine AS build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# 這一步會產生 dist 資料夾，裡面是編譯好的網頁檔案
RUN npm run build

# --- 第二階段：生產 (Production Stage) ---
FROM nginx:stable-alpine AS production-stage

# 從第一階段複製編譯好的檔案到 Nginx 的預設目錄
COPY --from=build-stage /app/dist /usr/share/nginx/html
# 複製我們剛剛寫的 nginx 設定檔
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 開放 80 Port (網頁預設 Port)
EXPOSE 80

# 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"]