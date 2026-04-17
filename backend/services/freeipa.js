const https = require('https');

const FREEIPA_BASE_URL = process.env.FREEIPA_BASE_URL;
const FREEIPA_REFERER = process.env.FREEIPA_REFERER || FREEIPA_BASE_URL;
const FREEIPA_REALM = process.env.FREEIPA_REALM || 'EXAMPLE.COM';
const FREEIPA_VERIFY_TLS = process.env.FREEIPA_VERIFY_TLS !== 'false';

const httpsAgent = new https.Agent({
  rejectUnauthorized: FREEIPA_VERIFY_TLS,
});

function getCookieString(headers) {
  const cookies = headers.getSetCookie?.() || [];
  return cookies.map((item) => item.split(';')[0]).join('; ');
}

async function freeIpaLogin(username, password) {
  if (!FREEIPA_BASE_URL) {
    throw new Error('FREEIPA_BASE_URL 尚未設定');
  }

  const loginUrl = `${FREEIPA_BASE_URL}/ipa/session/login_password`;
  const loginBody = new URLSearchParams({ user: username, password });

  const loginResponse = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Referer: FREEIPA_REFERER,
      Accept: 'text/plain',
    },
    body: loginBody,
    agent: httpsAgent,
  });

  if (!loginResponse.ok) {
    throw new Error(`FreeIPA 登入失敗，HTTP ${loginResponse.status}`);
  }

  const cookie = getCookieString(loginResponse.headers);

  if (!cookie) {
    throw new Error('FreeIPA 未回傳有效 Session Cookie');
  }

  const jsonResponse = await fetch(`${FREEIPA_BASE_URL}/ipa/session/json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: FREEIPA_REFERER,
      Accept: 'application/json',
      Cookie: cookie,
    },
    body: JSON.stringify({
      method: 'user_show',
      params: [[username], { all: true, raw: false }],
      id: 0,
    }),
    agent: httpsAgent,
  });

  const data = await jsonResponse.json();

  if (!jsonResponse.ok || data.error) {
    throw new Error(data.error?.message || 'FreeIPA 驗證帳號資訊失敗');
  }

  const result = data?.result?.result || {};
  const displayName = Array.isArray(result.cn) ? result.cn[0] : username;

  return {
    username,
    displayName,
    realm: FREEIPA_REALM,
  };
}

module.exports = {
  freeIpaLogin,
};
