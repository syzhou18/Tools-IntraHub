<template>
  <section class="internal-systems">
    <h2>內部系統入口</h2>
    <p>此頁面整合各部門常用的內部系統連結。</p>

    <ul class="system-links">
      <li>
        <a class="system-link" href="#" aria-label="人資系統連結">
          人資系統
        </a>
      </li>
      <li>
        <a class="system-link" href="#" aria-label="LibreNMS 連結">
          LibreNMS
        </a>
      </li>
      <li>
        <a class="system-link" href="#" aria-label="會議室預約連結">
          會議室預約
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.internal-systems {
  text-align: left;
}

.system-links {
  list-style: none;
  padding: 0;
  margin: 20px 0 0;
  display: grid;
  gap: 12px;
  max-width: 360px;
}

.system-link {
  display: block;
  padding: 12px 14px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  background-color: #fff;
  color: #343a40;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.system-link:hover {
  background-color: #f1f3f5;
  border-color: #adb5bd;
}
</style>
