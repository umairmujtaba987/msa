<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const { $api } = useNuxtApp()

const loading = ref(false)
const configLoading = ref(false)
const bookings = ref([])
const pagination = ref({ current: 1, pageSize: 10, total: 0 })
const courtOptions = ref<any[]>([])
const sportOptions = ref<string[]>([])

// Filters
const filters = ref({
  search: '',
  sport: null,
  court: null,
  status: null,
})

// Modal
const isModalVisible = ref(false)
const selectedBooking = ref<any>(null)

const fetchBookingConfig = async () => {
  configLoading.value = true
  try {
    const res: any = await $api('/booking-config')
    const config = res?.data || { courts: [], pricing: {} }
    courtOptions.value = config.courts || []
    sportOptions.value = Object.keys(config.pricing || {})
  } catch (error) {
    console.error('Failed to load booking config', error)
    courtOptions.value = []
    sportOptions.value = []
  } finally {
    configLoading.value = false
  }
}

const columns = [
  { title: 'Customer', dataIndex: 'customer', key: 'customer' },
  { title: 'Court/Sport', dataIndex: 'type', key: 'type' },
  { title: 'Date & Time', dataIndex: 'datetime', key: 'datetime' },
  { title: 'Price', dataIndex: 'price', key: 'price' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Notes', dataIndex: 'notes', key: 'notes', ellipsis: true, width: 200 },
  { title: 'Actions', key: 'actions', align: 'right' },
]

const fetchBookings = async (page = 1) => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.sport) params.append('sport', filters.value.sport)
    if (filters.value.court) params.append('court', filters.value.court)
    if (filters.value.status) params.append('status', filters.value.status)

    const res: any = await $api(`/bookings?${params.toString()}`)
    bookings.value = res.data
    pagination.value.total = res.total
    pagination.value.current = res.current_page
  } catch (error) {
    console.error('Failure to load bookings', error)
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  fetchBookings(pag.current)
}

const handleSearch = () => {
  fetchBookings(1)
}

const openCreateModal = () => {
  selectedBooking.value = null
  isModalVisible.value = true
}

const openEditModal = (record: any) => {
  selectedBooking.value = { ...record }
  isModalVisible.value = true
}

const updateStatus = async (id: number, action: string) => {
  try {
    await $api(`/bookings/${id}/${action}`, { method: 'PATCH' })
    fetchBookings(pagination.value.current)
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  await fetchBookingConfig()
  await fetchBookings()
})
</script>

<template>
  <div class="bookings-page">
    <div class="page-header d-flex justify-between align-center mb-4">
      <div>
        <h2 class="page-title">Booking Management</h2>
        <p class="text-muted">Manage all court reservations spanning Cricket and Football.</p>
      </div>
      <a-button type="primary" size="large" class="new-booking-btn" @click="openCreateModal">
        + New Booking
      </a-button>
    </div>

    <div class="premium-card p-4 mb-4">
      <div class="filters-row">
        <a-input-search
          class="search-field"
          v-model:value="filters.search"
          placeholder="Search phone or name..."
          @search="handleSearch"
        />
        <div class="filter-group">
          <a-select v-model:value="filters.sport" placeholder="Sport" allowClear style="width: 120px" :loading="configLoading" @change="handleSearch">
            <a-select-option v-for="sport in sportOptions" :key="sport" :value="sport">{{ sport }}</a-select-option>
          </a-select>
          <a-select v-model:value="filters.court" placeholder="Court" allowClear style="width: 120px" :loading="configLoading" @change="handleSearch">
            <a-select-option v-for="court in courtOptions" :key="court.id" :value="court.id">{{ court.label }}</a-select-option>
          </a-select>
          <a-select v-model:value="filters.status" placeholder="Status" allowClear style="width: 140px" @change="handleSearch">
            <a-select-option value="Pending">Pending</a-select-option>
            <a-select-option value="Confirmed">Confirmed</a-select-option>
            <a-select-option value="Paid">Paid</a-select-option>
            <a-select-option value="Cancelled">Cancelled</a-select-option>
          </a-select>
        </div>
      </div>
    </div>

    <div class="premium-card p-0 overflow-hidden table-wrap">
      <a-table
        :dataSource="bookings"
        :columns="columns"
        :rowKey="record => record.id"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'customer'">
            <div class="fw-600">{{ record.customer_name }}</div>
            <div class="text-sm text-muted">{{ record.phone_number }}</div>
          </template>

          <template v-else-if="column.key === 'type'">
            <a-tag :color="record.sport === 'Cricket' ? 'blue' : 'green'">{{ record.sport }}</a-tag>
            <span class="text-sm">Court {{ record.court }}</span>
          </template>

          <template v-else-if="column.key === 'datetime'">
            <div>{{ record.booking_date }}</div>
            <div class="text-sm text-muted">{{ record.start_time }}</div>
          </template>

          <template v-else-if="column.key === 'price'">
            <span class="fw-500">PKR {{ record.price }}</span>
          </template>

          <template v-else-if="column.key === 'status'">
            <a-tag :color="
              record.status === 'Paid' ? 'success' : 
              record.status === 'Confirmed' ? 'processing' : 
              record.status === 'Cancelled' ? 'error' : 'default'
            ">
              {{ record.status }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'notes'">
            <span class="text-sm text-muted" :title="record.notes" style="display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              {{ record.notes || '-' }}
            </span>
          </template>

          <template v-else-if="column.key === 'actions'">
            <a-dropdown placement="bottomRight">
              <a-button type="text">...</a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="paid" @click="updateStatus(record.id, 'paid')" v-if="record.status !== 'Paid'">
                    Mark as Paid
                  </a-menu-item>
                  <a-menu-item key="confirm" @click="updateStatus(record.id, 'confirm')" v-if="record.status === 'Pending'">
                    Confirm Booking
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="edit" @click="openEditModal(record)">
                    Edit Details
                  </a-menu-item>
                  <a-menu-item key="cancel" style="color: var(--danger)" @click="updateStatus(record.id, 'cancel')">
                    Cancel Booking
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </template>
      </a-table>
    </div>

    <!-- Integration the standalone form component -->
    <BookingsBookingModal 
      v-model:visible="isModalVisible" 
      :booking="selectedBooking" 
      @saved="handleSearch" 
    />
  </div>
</template>

<style scoped>
.page-title { margin: 0 0 4px 0; font-size: 24px; }
.text-muted { color: var(--text-muted); }
.text-sm { font-size: 12px; }
.fw-500 { font-weight: 500; }
.fw-600 { font-weight: 600; color: var(--text-primary); }

.d-flex { display: flex; }
.justify-between { justify-content: space-between; }
.align-center { align-items: center; }
.mb-4 { margin-bottom: 24px; }
.p-4 { padding: 24px; }
.p-0 { padding: 0; }
.overflow-hidden { overflow: hidden; }

.filters-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.filter-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.search-field {
  width: 280px;
}

.table-wrap {
  overflow-x: auto;
}

@media (max-width: 991px) {
  .search-field {
    width: 100%;
  }

  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    width: 100%;
  }

  .filter-group :deep(.ant-select) {
    flex: 1 1 140px;
    min-width: 140px;
  }
}

@media (max-width: 767px) {
  .page-title {
    font-size: 20px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .new-booking-btn {
    width: 100%;
  }

  .p-4 {
    padding: 16px;
  }
}
</style>
