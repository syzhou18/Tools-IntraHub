<template>
  <section class="container">
    <h1 class="title">📢 公司公告</h1>

    <!-- 公告列表 -->
    <div class="list">
      <div
        v-for="item in paginatedNews"
        :key="item.title"
        @click="openModal(item)"
        class="list-item"
      >
        <div class="date">{{ item.date }}</div>
        <div class="title-text">{{ item.title }}</div>
      </div>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">
        上一頁
      </button>

      <span>第 {{ currentPage }} / {{ totalPages }} 頁</span>

      <button @click="nextPage" :disabled="currentPage === totalPages">
        下一頁
      </button>
    </div>

    <!-- Modal -->
    <div v-if="selected" class="modal-overlay" @click.self="selected = null">
      <div class="modal">
        <button class="close-btn" @click="selected = null">✕</button>

        <h2 class="modal-title">{{ selected.title }}</h2>

        <div class="modal-meta">
          {{ selected.date }} ｜ {{ selected.category }}
        </div>

        <div class="modal-content">
          {{ selected.content }}
        </div>
      </div>
    </div>

    <div v-if="error" class="error">❌ 無法讀取公告</div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'


const API_URL = 'http://192.168.2.88/announcements/1.json'

const newsData = ref([])
const error = ref(false)
const selected = ref(null)

const loadNews = async () => {
  try {
    const res = await fetch(API_URL)
    newsData.value = await res.json()
  } catch (e) {
    error.value = true
  }
}

const openModal = (item) => {
  selected.value = item
}

const filteredNews = computed(() => {
  return [...newsData.value].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )
})

const currentPage = ref(1)
const pageSize = 10

// 分頁後資料
const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredNews.value.slice(start, start + pageSize)
})

// 總頁數
const totalPages = computed(() => {
  return Math.ceil(filteredNews.value.length / pageSize)
})

// 換頁
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

onMounted(loadNews)
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 列表 */
.list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.list-item {
  display: flex;
  gap: 20px;
  padding: 14px 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: all 0.2s ease;
}

.list-item:hover {
  background: #f9fafb;
  transform: translateX(4px);
}

/* 日期 */
.date {
  width: 110px;
  color: #666;
  font-size: 14px;
}

/* 標題 */
.title-text {
  flex: 1;
  color: #222;
  font-weight: 500;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s;
}

.modal {
  background: white;
  width: 600px;
  max-width: 90%;
  border-radius: 16px;
  padding: 24px;
  position: relative;
  animation: scaleIn 0.2s;
}

.close-btn {
  position: absolute;
  right: 15px;
  top: 10px;
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
}

/* Modal內容 */
.modal-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.modal-meta {
  font-size: 13px;
  color: #888;
  margin-bottom: 16px;
}

.modal-content {
  color: #333;
  line-height: 1.6;
  white-space: pre-line;
}

/* 錯誤 */
.error {
  color: red;
  margin-top: 20px;
}

/* 動畫 */
@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.pagination button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 6px;
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>