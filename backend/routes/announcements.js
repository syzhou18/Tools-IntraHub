const express = require('express');
const router = express.Router();
const pool = require('../db');

const ALLOWED_STATUSES = new Set(['draft', 'published', 'archived']);

const normalizeAnnouncementPayload = (body = {}) => {
  const normalized = {
    title: typeof body.title === 'string' ? body.title.trim() : '',
    content: typeof body.content === 'string' ? body.content.trim() : '',
    category: typeof body.category === 'string' ? body.category.trim() : null,
    status: typeof body.status === 'string' ? body.status.trim() : 'draft',
    priority: Number.isFinite(Number(body.priority)) ? Number(body.priority) : 0,
    is_pinned: body.is_pinned === true || body.is_pinned === 'true',
    start_at: body.start_at || null,
    end_at: body.end_at || null,
    attachment_url: typeof body.attachment_url === 'string' ? body.attachment_url.trim() : null,
    target_role: typeof body.target_role === 'string' ? body.target_role.trim() : null,
    created_by: typeof body.created_by === 'string' ? body.created_by.trim() : null,
    updated_by: typeof body.updated_by === 'string' ? body.updated_by.trim() : null,
  };

  normalized.category = normalized.category || null;
  normalized.attachment_url = normalized.attachment_url || null;
  normalized.target_role = normalized.target_role || null;
  normalized.created_by = normalized.created_by || null;
  normalized.updated_by = normalized.updated_by || null;

  if (!ALLOWED_STATUSES.has(normalized.status)) {
    normalized.status = 'draft';
  }

  return normalized;
};

const validateAnnouncement = (payload) => {
  if (!payload.title) {
    return 'title 為必填欄位';
  }

  if (!payload.content) {
    return 'content 為必填欄位';
  }

  if (payload.start_at && Number.isNaN(Date.parse(payload.start_at))) {
    return 'start_at 日期格式不正確';
  }

  if (payload.end_at && Number.isNaN(Date.parse(payload.end_at))) {
    return 'end_at 日期格式不正確';
  }

  if (payload.start_at && payload.end_at && new Date(payload.start_at) > new Date(payload.end_at)) {
    return 'start_at 不可晚於 end_at';
  }

  return null;
};

router.get('/', async (req, res) => {
  const sql = `
    SELECT *
    FROM announcements
    ORDER BY is_pinned DESC, priority DESC, created_at DESC, id DESC
  `;

  try {
    const { rows } = await pool.query(sql);
    res.status(200).json(rows);
  } catch (err) {
    console.error(' [Error] Fetching announcements:', err.message);
    res.status(500).json({ success: false, error: '無法取得公告資料' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM announcements WHERE id = $1', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: '找不到公告資料' });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(' [Error] Fetching announcement:', err.message);
    res.status(500).json({ success: false, error: '無法取得公告資料' });
  }
});

router.post('/', async (req, res) => {
  const payload = normalizeAnnouncementPayload(req.body);
  const validationError = validateAnnouncement(payload);

  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  const sql = `
    INSERT INTO announcements (
      title, content, category, status, priority, is_pinned, start_at, end_at,
      attachment_url, target_role, created_by, updated_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
  `;

  const values = [
    payload.title,
    payload.content,
    payload.category,
    payload.status,
    payload.priority,
    payload.is_pinned,
    payload.start_at,
    payload.end_at,
    payload.attachment_url,
    payload.target_role,
    payload.created_by,
    payload.updated_by || payload.created_by,
  ];

  try {
    const { rows } = await pool.query(sql, values);
    res.status(201).json({ success: true, message: '公告新增成功', data: rows[0] });
  } catch (err) {
    console.error(' [Error] Creating announcement:', err.message);
    res.status(500).json({ success: false, error: '無法新增公告資料' });
  }
});

router.put('/:id', async (req, res) => {
  const payload = normalizeAnnouncementPayload(req.body);
  const validationError = validateAnnouncement(payload);

  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  const sql = `
    UPDATE announcements
    SET title = $1,
        content = $2,
        category = $3,
        status = $4,
        priority = $5,
        is_pinned = $6,
        start_at = $7,
        end_at = $8,
        attachment_url = $9,
        target_role = $10,
        created_by = $11,
        updated_by = $12,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $13
    RETURNING *
  `;

  const values = [
    payload.title,
    payload.content,
    payload.category,
    payload.status,
    payload.priority,
    payload.is_pinned,
    payload.start_at,
    payload.end_at,
    payload.attachment_url,
    payload.target_role,
    payload.created_by,
    payload.updated_by,
    req.params.id,
  ];

  try {
    const { rows } = await pool.query(sql, values);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: '找不到要更新的公告資料' });
    }

    res.status(200).json({ success: true, message: '公告更新成功', data: rows[0] });
  } catch (err) {
    console.error(' [Error] Updating announcement:', err.message);
    res.status(500).json({ success: false, error: '無法更新公告資料' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM announcements WHERE id = $1', [req.params.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: '找不到要刪除的公告資料' });
    }

    res.status(200).json({ success: true, message: '公告刪除成功' });
  } catch (err) {
    console.error(' [Error] Deleting announcement:', err.message);
    res.status(500).json({ success: false, error: '無法刪除公告資料' });
  }
});

module.exports = router;
