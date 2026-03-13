const express = require('express');
const router = express.Router();
const pool = require('../db'); // 從 db.js 引入連線池

/**
 * @route   GET /
 * @desc    取得所有使用者資料
 */
router.get('/', async (req, res) => {
    const sql = `SELECT * FROM company_assets.employees`;
    try {
        const [rows] = await pool.query(sql);
        res.status(200).json(rows);
    } catch (err) {
        console.error(' [Error] Fetching users:', err.message);
        res.status(500).json({ success: false, error: '無法取得使用者資料' });
    }
});

/**
 * @route   POST /
 * @desc    新增使用者資料
 */
router.post('/', async (req, res) => {
    const { employee_id, name, job_title, department, phone_number, email } = req.body;

    // 基本欄位驗證
    if (!employee_id || !name || !email) {
        return res.status(400).json({ success: false, message: '員工編號、名稱和電子郵件為必填欄位' });
    }

    const sql = `
        INSERT INTO employees (employee_id, name, job_title, department, phone_number, email) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [employee_id, name, job_title, department, phone_number, email];

    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute(sql, values);

        console.log(' [Log] 資料新增成功:', result.insertId);
        res.status(201).json({
            success: true,
            message: '資料新增成功',
            id: result.insertId
        });
    } catch (err) {
        console.error(' [Error] 新增失敗:', err.message);
        res.status(500).json({ success: false, error: '伺服器錯誤，無法新增資料' });
    } finally {
        if (connection) connection.release();
    }
});

/**
 * @route   PUT /:employee_id
 * @desc    更新使用者資料
 */
router.put('/:employee_id', async (req, res) => {
    const { employee_id } = req.params;
    const { name, job_title, phone_number, email, department } = req.body;

    const sql = `
        UPDATE employees
        SET name = ?, job_title = ?, department = ?, phone_number = ?, email = ?
        WHERE employee_id = ?
    `;
    const values = [name, job_title, department, phone_number, email, employee_id];

    try {
        const [result] = await pool.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: '找不到該員工編號 (User not found)' });
        }
        res.status(200).json({ success: true, message: '資料更新成功' });
    } catch (err) {
        console.error(' [Error] 更新失敗:', err.message);
        res.status(500).json({ success: false, error: '無法更新資料' });
    }
});

/**
 * @route   DELETE /:employee_id
 * @desc    刪除使用者資料
 */
router.delete('/:employee_id', async (req, res) => {
    const { employee_id } = req.params;
    const sql = `DELETE FROM employees WHERE employee_id = ?`;

    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute(sql, [employee_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: '找不到要刪除的資料' });
        }
        res.status(200).json({ success: true, message: '資料刪除成功' });
    } catch (err) {
        console.error(' [Error] 刪除失敗:', err.message);
        res.status(500).json({ success: false, error: '伺服器錯誤，無法刪除資料' });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;