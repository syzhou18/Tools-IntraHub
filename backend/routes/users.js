const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @route   GET /
 * @desc    取得所有使用者資料
 */
router.get('/', async (req, res) => {
    const sql = `SELECT * FROM employees ORDER BY employee_id`;
    try {
        const { rows } = await pool.query(sql);
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

    if (!employee_id || !name || !email) {
        return res.status(400).json({ success: false, message: '員工編號、名稱和電子郵件為必填欄位' });
    }

    const sql = `
        INSERT INTO employees (employee_id, name, job_title, department, phone_number, email)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING employee_id
    `;
    const values = [employee_id, name, job_title, department, phone_number, email];

    try {
        const { rows } = await pool.query(sql, values);

        console.log(' [Log] 資料新增成功:', rows[0].employee_id);
        res.status(201).json({
            success: true,
            message: '資料新增成功',
            id: rows[0].employee_id
        });
    } catch (err) {
        console.error(' [Error] 新增失敗:', err.message);
        res.status(500).json({ success: false, error: '伺服器錯誤，無法新增資料' });
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
        SET name = $1, job_title = $2, department = $3, phone_number = $4, email = $5
        WHERE employee_id = $6
    `;
    const values = [name, job_title, department, phone_number, email, employee_id];

    try {
        const result = await pool.query(sql, values);

        if (result.rowCount === 0) {
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
    const sql = `DELETE FROM employees WHERE employee_id = $1`;

    try {
        const result = await pool.query(sql, [employee_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: '找不到要刪除的資料' });
        }
        res.status(200).json({ success: true, message: '資料刪除成功' });
    } catch (err) {
        console.error(' [Error] 刪除失敗:', err.message);
        res.status(500).json({ success: false, error: '伺服器錯誤，無法刪除資料' });
    }
});

module.exports = router;
