require('dotenv').config();
const express = require('express');
const cors = require('cors');

// --- 引入各模組 Router ---
const userRoutes = require('./routes/users');

const app = express();
const port = process.env.PORT || 3000;

// --- 全域中介軟體 (Middleware) ---
app.use(cors());
app.use(express.json()); // 解析 JSON 格式請求
app.use(express.urlencoded({ extended: true })); // 解析 URL-encoded 請求

// --- API 路由掛載區 ---

// 測試與監控
//app.use('/api/test', testRouter);

// 核心功能模組
app.use('/api/users', userRoutes);         // 使用者管理


// --- 靜態路由與首頁 ---
app.get('/', (req, res) => {
    res.status(200).send('🚀 IT Asset Management Backend Server is running!');
});

// --- 錯誤處理 (Error Handling) ---

// 處理 404 - 找不到路由
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `路徑不存在: ${req.originalUrl}`
    });
});

// 處理 500 - 全域伺服器錯誤
app.use((err, req, res, next) => {
    console.error(' [Fatal Error]', err.stack);
    res.status(500).json({
        success: false,
        message: '伺服器發生未預期的內部錯誤'
    });
});

// --- 啟動伺服器 ---
app.listen(port, () => {
    console.log('==========================================');
    console.log(` ✅  伺服器已成功啟動!`);
    console.log(` 🌐  運行網址: http://localhost:${port}`);
    console.log(` 📅  啟動時間: ${new Date().toLocaleString()}`);
    console.log('==========================================');
});