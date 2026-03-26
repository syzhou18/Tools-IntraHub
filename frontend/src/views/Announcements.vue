<template>
  <section class="page">
    <div class="page-header">
      <div>
        <h1>📢 公司公告</h1>
      </div>
      <button class="btn btn-primary" @click="openCreateModal">新增公告</button>
    </div>

    <div class="toolbar card">
      <div class="toolbar-grid">
        <label>
          <span>關鍵字</span>
          <input v-model.trim="filters.keyword" type="text" placeholder="搜尋標題 / 內容 / 類別" />
        </label>
        <label>
          <span>狀態</span>
          <select v-model="filters.status">
            <option value="">全部</option>
            <option v-for="option in statusOptions" :key="option" :value="option">{{ option }}</option>
          </select>
        </label>
        <label>
          <span>類別</span>
          <input v-model.trim="filters.category" type="text" placeholder="例如：HR / IT" />
        </label>
      </div>
    </div>

    <div v-if="message.text" :class="['banner', message.type]">{{ message.text }}</div>
    <div v-if="error" class="banner error">{{ error }}</div>

    <div class="content-grid">
      <div class="card table-card">
        <div class="card-header">
          <h2>公告列表</h2>
          <span>{{ filteredAnnouncements.length }} 筆</span>
        </div>

        <div v-if="loading" class="empty-state">資料讀取中...</div>
        <div v-else-if="filteredAnnouncements.length === 0" class="empty-state">目前沒有符合條件的公告。</div>
        <div v-else class="table-wrapper">
          <table class="announcement-table">
            <thead>
              <tr>
                <th>標題</th>
                <th>狀態</th>
                <th>類別 / 對象</th>
                <th>時程</th>
                <th>建立者</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in paginatedAnnouncements" :key="item.id">
                <td>
                  <button class="link-button" @click="openDetail(item)">
                    <span class="pin" v-if="item.is_pinned">📌</span>
                    {{ item.title }}
                  </button>
                  <div class="subtext">優先度 {{ item.priority }}</div>
                </td>
                <td>
                  <span class="status-pill" :class="item.status">{{ item.status }}</span>
                </td>
                <td>
                  <div>{{ item.category || '未分類' }}</div>
                  <div class="subtext">{{ item.target_role || '全體員工' }}</div>
                </td>
                <td>
                  <div>{{ formatDateTime(item.start_at) || '立即生效' }}</div>
                  <div class="subtext">至 {{ formatDateTime(item.end_at) || '無截止' }}</div>
                </td>
                <td>
                  <div>{{ item.created_by || '未填寫' }}</div>
                  <div class="subtext">更新：{{ formatDateTime(item.updated_at) }}</div>
                </td>
                <td>
                  <div class="action-group">
                    <button class="btn" @click="openEditModal(item)">編輯</button>
                    <button class="btn btn-danger" @click="removeAnnouncement(item)">刪除</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <button class="btn" @click="prevPage" :disabled="currentPage === 1">上一頁</button>
          <span>第 {{ currentPage }} / {{ totalPages }} 頁</span>
          <button class="btn" @click="nextPage" :disabled="currentPage === totalPages">下一頁</button>
        </div>
      </div>

      <div class="card highlight-card">
        <div class="card-header">
          <h2>最新公告預覽</h2>
        </div>
        <div v-if="latestAnnouncement" class="highlight-body">
          <div class="highlight-top">
            <span class="status-pill" :class="latestAnnouncement.status">{{ latestAnnouncement.status }}</span>
            <span v-if="latestAnnouncement.is_pinned">📌 置頂</span>
          </div>
          <h3>{{ latestAnnouncement.title }}</h3>
          <p class="muted">{{ latestAnnouncement.category || '未分類' }} ｜ {{ latestAnnouncement.target_role || '全體員工' }}</p>
          <p class="highlight-content">{{ latestAnnouncement.content }}</p>
          <a v-if="latestAnnouncement.attachment_url" :href="latestAnnouncement.attachment_url" target="_blank" rel="noreferrer">查看附件</a>
        </div>
        <div v-else class="empty-state">尚未建立公告。</div>
      </div>
    </div>

    <div v-if="showFormModal" class="modal-overlay" @click.self="closeFormModal">
      <div class="modal large-modal">
        <div class="modal-header">
          <h2>{{ editingId ? '編輯公告' : '新增公告' }}</h2>
          <button class="icon-button" @click="closeFormModal">✕</button>
        </div>

        <form class="form-grid" @submit.prevent="submitForm">
          <label class="span-2">
            <span>標題 *</span>
            <input v-model.trim="form.title" type="text" required maxlength="255" />
          </label>
          <label>
            <span>類別</span>
            <input v-model.trim="form.category" type="text" maxlength="50" />
          </label>
          <label>
            <span>狀態</span>
            <select v-model="form.status">
              <option v-for="option in statusOptions" :key="option" :value="option">{{ option }}</option>
            </select>
          </label>
          <label>
            <span>優先度</span>
            <input v-model.number="form.priority" type="number" min="0" />
          </label>
          <label class="checkbox-field">
            <span>置頂公告</span>
            <input v-model="form.is_pinned" type="checkbox" />
          </label>
          <label>
            <span>開始時間</span>
            <input v-model="form.start_at" type="datetime-local" />
          </label>
          <label>
            <span>結束時間</span>
            <input v-model="form.end_at" type="datetime-local" />
          </label>
          <label>
            <span>對象角色</span>
            <input v-model.trim="form.target_role" type="text" maxlength="50" />
          </label>
          <label>
            <span>附件連結</span>
            <input v-model.trim="form.attachment_url" type="url" placeholder="https://" />
          </label>
          <label>
            <span>建立者</span>
            <input v-model.trim="form.created_by" type="text" maxlength="100" />
          </label>
          <label>
            <span>更新者</span>
            <input v-model.trim="form.updated_by" type="text" maxlength="100" />
          </label>
          <label class="span-2">
            <span>內容 *</span>
            <textarea v-model.trim="form.content" rows="8" required></textarea>
          </label>

          <div class="modal-actions span-2">
            <button class="btn" type="button" @click="closeFormModal">取消</button>
            <button class="btn btn-primary" type="submit" :disabled="submitting">
              {{ submitting ? '儲存中...' : '儲存公告' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="selectedAnnouncement" class="modal-overlay" @click.self="selectedAnnouncement = null">
      <div class="modal">
        <div class="modal-header">
          <div>
            <h2>{{ selectedAnnouncement.title }}</h2>
            <p class="muted">{{ selectedAnnouncement.category || '未分類' }} ｜ {{ selectedAnnouncement.status }}</p>
          </div>
          <button class="icon-button" @click="selectedAnnouncement = null">✕</button>
        </div>
        <div class="detail-meta">
          <span>📌 {{ selectedAnnouncement.is_pinned ? '置頂' : '一般' }}</span>
          <span>🎯 {{ selectedAnnouncement.target_role || '全體員工' }}</span>
          <span>🕒 {{ formatDateTime(selectedAnnouncement.start_at) || '立即生效' }}</span>
        </div>
        <article class="detail-content">{{ selectedAnnouncement.content }}</article>
        <a v-if="selectedAnnouncement.attachment_url" :href="selectedAnnouncement.attachment_url" target="_blank" rel="noreferrer">查看附件</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import api from '../api/axios'

const statusOptions = ['draft', 'published', 'archived']
const pageSize = 6

const announcements = ref([])
const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const currentPage = ref(1)
const selectedAnnouncement = ref(null)
const showFormModal = ref(false)
const editingId = ref(null)
const message = reactive({ text: '', type: 'success' })
const filters = reactive({ keyword: '', status: '', category: '' })

const emptyForm = () => ({
  title: '',
  content: '',
  category: '',
  status: 'draft',
  priority: 0,
  is_pinned: false,
  start_at: '',
  end_at: '',
  attachment_url: '',
  target_role: '',
  created_by: 'Admin',
  updated_by: 'Admin',
})

const form = reactive(emptyForm())

const resetForm = () => {
  Object.assign(form, emptyForm())
  editingId.value = null
}

const normalizeDateInput = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60000)
  return localDate.toISOString().slice(0, 16)
}

const toIsoOrNull = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  return date.toISOString()
}

const serializeForm = () => ({
  ...form,
  start_at: toIsoOrNull(form.start_at),
  end_at: toIsoOrNull(form.end_at),
})

const validateForm = () => {
  if (form.start_at && !toIsoOrNull(form.start_at)) {
    return '開始時間格式不正確'
  }

  if (form.end_at && !toIsoOrNull(form.end_at)) {
    return '結束時間格式不正確'
  }

  if (form.start_at && form.end_at) {
    const startAt = new Date(form.start_at)
    const endAt = new Date(form.end_at)

    if (!Number.isNaN(startAt.getTime()) && !Number.isNaN(endAt.getTime()) && startAt > endAt) {
      return '開始時間不可晚於結束時間'
    }
  }

  return ''
}

const showBanner = (text, type = 'success') => {
  message.text = text
  message.type = type
  setTimeout(() => {
    if (message.text === text) {
      message.text = ''
    }
  }, 3000)
}

const fetchAnnouncements = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data } = await api.get('/announcements')
    announcements.value = data
  } catch (err) {
    error.value = err.response?.data?.error || '無法讀取公告資料，請稍後再試。'
  } finally {
    loading.value = false
  }
}

const filteredAnnouncements = computed(() => {
  const keyword = filters.keyword.toLowerCase()
  const category = filters.category.toLowerCase()

  return announcements.value.filter((item) => {
    const matchesKeyword = !keyword || [item.title, item.content, item.category]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(keyword))

    const matchesStatus = !filters.status || item.status === filters.status
    const matchesCategory = !category || (item.category || '').toLowerCase().includes(category)

    return matchesKeyword && matchesStatus && matchesCategory
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredAnnouncements.value.length / pageSize)))

const paginatedAnnouncements = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredAnnouncements.value.slice(start, start + pageSize)
})

const latestAnnouncement = computed(() => filteredAnnouncements.value[0] || null)

watch(filteredAnnouncements, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
}, { deep: true })

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1
}

const openDetail = (item) => {
  selectedAnnouncement.value = item
}

const openCreateModal = () => {
  resetForm()
  showFormModal.value = true
}

const openEditModal = (item) => {
  editingId.value = item.id
  Object.assign(form, {
    title: item.title || '',
    content: item.content || '',
    category: item.category || '',
    status: item.status || 'draft',
    priority: item.priority || 0,
    is_pinned: Boolean(item.is_pinned),
    start_at: normalizeDateInput(item.start_at),
    end_at: normalizeDateInput(item.end_at),
    attachment_url: item.attachment_url || '',
    target_role: item.target_role || '',
    created_by: item.created_by || 'Admin',
    updated_by: item.updated_by || 'Admin',
  })
  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
  resetForm()
}

const submitForm = async () => {
  const validationError = validateForm()
  if (validationError) {
    error.value = validationError
    showBanner(validationError, 'error')
    return
  }

  submitting.value = true
  error.value = ''

  try {
    const payload = serializeForm()
    if (editingId.value) {
      await api.put(`/announcements/${editingId.value}`, payload)
      showBanner('公告更新成功')
    } else {
      await api.post('/announcements', payload)
      showBanner('公告新增成功')
    }

    closeFormModal()
    await fetchAnnouncements()
  } catch (err) {
    error.value = err.response?.data?.message || err.response?.data?.error || '公告儲存失敗'
    showBanner(error.value, 'error')
  } finally {
    submitting.value = false
  }
}

const removeAnnouncement = async (item) => {
  const confirmed = window.confirm(`確定要刪除公告「${item.title}」嗎？`)
  if (!confirmed) return

  try {
    await api.delete(`/announcements/${item.id}`)
    showBanner('公告刪除成功')
    if (selectedAnnouncement.value?.id === item.id) {
      selectedAnnouncement.value = null
    }
    await fetchAnnouncements()
  } catch (err) {
    error.value = err.response?.data?.error || '公告刪除失敗'
    showBanner(error.value, 'error')
  }
}

const formatDateTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

onMounted(fetchAnnouncements)
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header,
.card-header,
.modal-header,
.detail-meta,
.highlight-top,
.action-group,
.pagination {
  display: flex;
  align-items: center;
}

.page-header,
.card-header,
.modal-header,
.pagination {
  justify-content: space-between;
}

.page-header h1,
.card-header h2,
.modal-header h2,
.highlight-card h3 {
  margin: 0;
}

.page-header p,
.muted,
.subtext {
  color: #6c757d;
}

.card,
.modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

.card {
  padding: 20px;
}

.toolbar-grid,
.content-grid,
.form-grid {
  display: grid;
  gap: 16px;
}

.toolbar-grid {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.content-grid {
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  align-items: start;
}

.table-card {
  min-width: 0;
}

.table-wrapper {
  overflow-x: auto;
}

.announcement-table {
  width: 100%;
  border-collapse: collapse;
}

.announcement-table th,
.announcement-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: top;
}

.announcement-table th {
  text-align: left;
  color: #495057;
  font-size: 14px;
}

label,
.checkbox-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 600;
  color: #343a40;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid #ced4da;
  border-radius: 10px;
  padding: 10px 12px;
  font: inherit;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
}

.checkbox-field input {
  width: auto;
  align-self: flex-start;
}

.btn {
  border: 1px solid #d0d7de;
  border-radius: 10px;
  background: #fff;
  color: #1f2937;
  padding: 9px 16px;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #0d6efd;
  border-color: #0d6efd;
  color: #fff;
}

.btn-danger {
  background: #dc3545;
  border-color: #dc3545;
  color: #fff;
}

.link-button,
.icon-button {
  border: none;
  background: transparent;
  cursor: pointer;
}

.link-button {
  padding: 0;
  color: #0d6efd;
  font-weight: 700;
  text-align: left;
}

.icon-button {
  font-size: 20px;
}

.pin {
  margin-right: 4px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.status-pill.draft {
  background: #fff3cd;
  color: #856404;
}

.status-pill.published {
  background: #d1e7dd;
  color: #0f5132;
}

.status-pill.archived {
  background: #e2e3e5;
  color: #41464b;
}

.banner {
  border-radius: 12px;
  padding: 12px 14px;
  font-weight: 600;
}

.banner.success {
  background: #d1e7dd;
  color: #0f5132;
}

.banner.error {
  background: #f8d7da;
  color: #842029;
}

.highlight-body,
.detail-content,
.empty-state {
  line-height: 1.7;
}

.highlight-content,
.detail-content {
  white-space: pre-wrap;
}

.empty-state {
  padding: 32px 12px;
  text-align: center;
  color: #6c757d;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  z-index: 50;
}

.modal {
  width: min(720px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
}

.large-modal {
  width: min(960px, 100%);
}

.form-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.span-2 {
  grid-column: 1 / -1;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.detail-meta {
  gap: 12px;
  flex-wrap: wrap;
  margin: 16px 0;
  color: #6c757d;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .span-2 {
    grid-column: auto;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
