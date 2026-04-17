const express = require('express');
const { freeIpaLogin } = require('../services/freeipa');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: '請提供帳號與密碼',
    });
  }

  try {
    const profile = await freeIpaLogin(username, password);

    return res.status(200).json({
      success: true,
      message: '登入成功',
      user: profile,
    });
  } catch (error) {
    console.error('[FreeIPA Login Error]', error.message);
    return res.status(401).json({
      success: false,
      message: '帳號或密碼錯誤，或 FreeIPA 無法連線',
    });
  }
});

module.exports = router;
