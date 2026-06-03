<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const stats = ref({ totalBookings: 0, totalIncome: 0 })
const tableData = ref([])
const loading = ref(false)
const exportLoading = ref(false)

const filters = ref({
  dateRange: [],
  court: null,
  sport: null,
  status: null
})

const columns = [
  { title: 'Date', dataIndex: 'booking_date', key: 'booking_date' },
  { title: 'Customer', dataIndex: 'customer_name', key: 'customer_name' },
  { title: 'Court', dataIndex: 'court', key: 'court' },
  { title: 'Sport', dataIndex: 'sport', key: 'sport' },
  { title: 'Price (PKR)', dataIndex: 'price', key: 'price' },
  { title: 'Status', dataIndex: 'status', key: 'status' }
]

const runReport = async () => {
  loading.value = true
  try {
    const params = buildFilterParams()
    
    // Using the same endpoint but visualizing it uniquely
    const res: any = await bookingService().list(`per_page=50&${params.toString()}`)
    tableData.value = res.data
    
    // Calc summary mapping locally for prototype, typically backend provides aggregations
    stats.value.totalBookings = res.total
    stats.value.totalIncome = res.data.filter((r: any) => r.status === 'Paid').reduce((sum: number, r: any) => sum + Number(r.price), 0)
    
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const buildFilterParams = () => {
  const params = new URLSearchParams()
  if (filters.value.court) params.append('court', filters.value.court)
  if (filters.value.sport) params.append('sport', filters.value.sport)
  if (filters.value.status) params.append('status', filters.value.status)
  if (filters.value.dateRange?.length === 2) {
    const [from, to] = filters.value.dateRange as any[]
    if (from && to) {
      const start = typeof from?.format === 'function' ? from.format('YYYY-MM-DD') : new Date(from).toISOString().split('T')[0]
      const end = typeof to?.format === 'function' ? to.format('YYYY-MM-DD') : new Date(to).toISOString().split('T')[0]
      params.append('date_from', start)
      params.append('date_to', end)
      params.append('start_date', start)
      params.append('end_date', end)
    }
  }
  if (filters.value.court) params.append('court_id', filters.value.court)
  return params
}

const handleExport = (type: 'csv' | 'pdf') => {
  if (!tableData.value.length) return

  if (type === 'pdf') {
    exportPdf()
    return
  }

  const headers = ['Date', 'Customer', 'Court', 'Sport', 'Price', 'Status']
  const rows = tableData.value.map((r: any) => [
    r.booking_date,
    r.customer_name,
    r.court,
    r.sport,
    r.price,
    r.status,
  ])

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'msa-report.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const exportPdf = async () => {
  exportLoading.value = true
  try {
    const params = buildFilterParams()
    const blob = await reportService().exportBookingsPdf(params.toString())
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `booking-report-${new Date().toISOString().slice(0, 10)}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error(error)
  } finally {
    exportLoading.value = false
  }
}

onMounted(runReport)
</script>

<template>
  <div class="reports-page">
    <div class="page-header d-flex justify-between align-center mb-4">
      <div>
        <h2 class="page-title">Reports & Analytics</h2>
        <p class="text-muted">Analyze your bookings and venue revenue.</p>
      </div>
      <div class="export-actions">
        <a-button class="export-btn" @click="handleExport('csv')">Export CSV</a-button>
        <a-button class="export-btn" type="primary" :loading="exportLoading" @click="handleExport('pdf')">Export PDF</a-button>
      </div>
    </div>

    <!-- Advanced Filters -->
    <div class="premium-card p-4 mb-4 filter-panel">
      <div class="filter-controls">
        <div class="filter-item">
          <label>Date Range</label>
          <a-range-picker v-model:value="filters.dateRange" />
        </div>
        <div class="filter-item">
          <label>Court</label>
          <a-select v-model:value="filters.court" placeholder="All Courts" allowClear>
            <a-select-option value="A">Court A</a-select-option>
            <a-select-option value="B">Court B</a-select-option>
          </a-select>
        </div>
        <div class="filter-item">
          <label>Sport</label>
          <a-select v-model:value="filters.sport" placeholder="All Sports" allowClear>
            <a-select-option value="Cricket">Cricket</a-select-option>
            <a-select-option value="Football">Football</a-select-option>
          </a-select>
        </div>
        <div class="filter-item">
          <label>Status</label>
          <a-select v-model:value="filters.status" placeholder="All Statuses" allowClear>
            <a-select-option value="Paid">Paid Only</a-select-option>
            <a-select-option value="Pending">Pending Only</a-select-option>
            <a-select-option value="Confirmed">Confirmed Only</a-select-option>
            <a-select-option value="Cancelled">Cancelled Only</a-select-option>
          </a-select>
        </div>
        <div class="filter-item">
          <label>&nbsp;</label>
          <a-button type="primary" @click="runReport" :loading="loading">Generate</a-button>
        </div>
      </div>
    </div>

    <!-- Analytics Summaries -->
    <div class="summary-grid mb-4">
      <div class="premium-card kpi-summary">
        <h4>Total Bookings (Filtered)</h4>
        <h2>{{ stats.totalBookings }}</h2>
      </div>
      <div class="premium-card kpi-summary">
        <h4>Total Revenue (Paid)</h4>
        <h2 class="text-success">PKR {{ stats.totalIncome.toLocaleString() }}</h2>
      </div>
    </div>

    <!-- Report DataTable -->
    <div class="premium-card p-0 overflow-hidden table-wrap">
      <a-table 
        :dataSource="tableData" 
        :columns="columns"
        :loading="loading"
        :pagination="{ pageSize: 50 }"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 'Paid' ? 'success' : 'default'">{{ record.status }}</a-tag>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style scoped>
.page-title { margin: 0 0 4px 0; font-size: 24px; }
.text-muted { color: var(--text-muted); }
.text-success { color: var(--success); }

.d-flex { display: flex; }
.justify-between { justify-content: space-between; }
.align-center { align-items: center; }
.mb-4 { margin-bottom: 24px; }
.p-4 { padding: 24px; }
.p-0 { padding: 0; }
.overflow-hidden { overflow: hidden; }

.filter-controls {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}
.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 160px;
}
.filter-item label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.kpi-summary {
  padding: 24px;
  text-align: center;
}
.kpi-summary h4 {
  color: var(--text-muted);
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 14px;
}
.kpi-summary h2 {
  font-size: 32px;
  margin: 0;
}

.table-wrap {
  overflow-x: auto;
}

.export-actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 991px) {
  .filter-item {
    flex: 1 1 200px;
  }
}

@media (max-width: 767px) {
  .page-title {
    font-size: 20px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .export-actions {
    flex-direction: column;
    width: 100%;
  }

  .export-btn {
    width: 100%;
  }

  .p-4 {
    padding: 16px;
  }

  .filter-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .filter-item {
    min-width: 100%;
  }

  .summary-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .kpi-summary h2 {
    font-size: 24px;
  }
}
</style>
