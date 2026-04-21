<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Line, Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const loading = ref(false)
const stats = ref({
  bookings: { today: 0, monthly: 0 },
  income: { today: 0, monthly: 0 },
  sports: { cricket: 0, football: 0 },
  trends: [] as any[],
  revenue_trends: [] as any[],
})

// Quick filters
const dateRange = ref([])
const selectedSport = ref(null)
const selectedCourt = ref(null)

const fetchDashboardStats = async () => {
  loading.value = true
  try {
    const { $api } = useNuxtApp()
    
    const params = new URLSearchParams()
    if (selectedSport.value) params.append('sport', selectedSport.value)
    if (selectedCourt.value) params.append('court', selectedCourt.value)
    if (dateRange.value && dateRange.value.length === 2 && dateRange.value[0]) {
      try {
        const start = typeof dateRange.value[0].format === 'function' ? dateRange.value[0].format('YYYY-MM-DD') : new Date(dateRange.value[0]).toISOString().split('T')[0]
        const end = typeof dateRange.value[1].format === 'function' ? dateRange.value[1].format('YYYY-MM-DD') : new Date(dateRange.value[1]).toISOString().split('T')[0]
        params.append('date_from', start)
        params.append('date_to', end)
      } catch (e) {
        console.warn('Date formatting soft fail, ignoring date filter mapping.')
      }
    }

    const res: any = await $api(`/dashboard/stats?${params.toString()}`)
    stats.value = res
  } catch (error) {
    console.error('Failed to load stats', error)
  } finally {
    loading.value = false
  }
}

const lineChartData = computed(() => {
  const labels = stats.value.trends.map(t => t.date)
  const data = stats.value.trends.map(t => t.total)

  return {
    labels: labels.length ? labels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Bookings',
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
        data: data.length ? data : [0, 0, 0, 0, 0, 0, 0],
        tension: 0.4
      }
    ]
  }
})

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, suggestedMax: 10 } }
}

const barChartData = computed(() => {
  const revenueMap = new Map((stats.value.revenue_trends || []).map((row: any) => [Number(row.week), Number(row.total)]))
  return {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Revenue',
        backgroundColor: '#10B981',
        data: [1, 2, 3, 4].map((week) => revenueMap.get(week) || 0),
      }
    ]
  }
})

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
}

onMounted(() => {
  fetchDashboardStats()
})
</script>

<template>
  
  <div class="dashboard">
    <!-- Top Filters Header -->
    <div class="page-header premium-card shadow-sm mb-4">
      <div class="header-content">
        <h2>Dashboard Overview</h2>
        <div class="quick-filters">
          <a-range-picker v-model:value="dateRange" style="width: 250px" @change="fetchDashboardStats" />
          <a-select v-model:value="selectedSport" placeholder="Sport" style="width: 120px" allowClear @change="fetchDashboardStats">
            <a-select-option value="Cricket">Cricket</a-select-option>
            <a-select-option value="Football">Football</a-select-option>
          </a-select>
          <a-select v-model:value="selectedCourt" placeholder="Court" style="width: 120px" allowClear @change="fetchDashboardStats">
            <a-select-option value="A">Court A</a-select-option>
            <a-select-option value="B">Court B</a-select-option>
          </a-select>
        </div>
      </div>
    </div>

    <a-spin :spinning="loading" tip="Loading dashboard analytics...">
      <!-- KPI Cards -->
      <div class="kpi-grid">
        <!-- Total Bookings -->
        <div class="premium-card kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Total Bookings (Today)</span>
            <h3 class="kpi-value text-primary">{{ stats.bookings.today }}</h3>
            <span class="kpi-subtext">{{ stats.bookings.monthly }} this month</span>
          </div>
          <div class="kpi-icon bg-primary-light">🎯</div>
        </div>

        <!-- Total Income -->
        <div class="premium-card kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Total Income (Today)</span>
            <h3 class="kpi-value text-success">PKR {{ stats.income.today?.toLocaleString() || 0 }}</h3>
            <span class="kpi-subtext">PKR {{ stats.income.monthly?.toLocaleString() || 0 }} this month</span>
          </div>
          <div class="kpi-icon bg-success-light">💰</div>
        </div>

         <!-- Cricket vs Football -->
        <div class="premium-card kpi-card flex-row-stats">
          <div class="sport-stat">
            <span class="kpi-label">Cricket</span>
            <h3 class="kpi-value">{{ stats.sports.cricket }}</h3>
          </div>
          <div class="divider"></div>
          <div class="sport-stat">
            <span class="kpi-label">Football</span>
            <h3 class="kpi-value">{{ stats.sports.football }}</h3>
          </div>
        </div>
      </div>

      <!-- Charts Layout -->
      <div class="charts-grid mt-4">
        <div class="premium-card chart-container">
          <h3>Daily Bookings Trend</h3>
          <div class="chart-box">
            <Line :data="lineChartData" :options="lineChartOptions" />
          </div>
        </div>
        
        <div class="premium-card chart-container">
          <h3>Monthly Revenue Analysis</h3>
          <div class="chart-box">
            <Bar :data="barChartData" :options="barChartOptions" />
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<style scoped>
.page-header {
  padding: 16px 24px;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-content h2 {
  margin: 0;
  font-size: 20px;
}
.quick-filters {
  display: flex;
  gap: 12px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
.kpi-card {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.kpi-info {
  display: flex;
  flex-direction: column;
}
.kpi-label {
  font-size: 13px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}
.kpi-value {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 4px 0;
  line-height: 1.2;
}
.kpi-subtext {
  font-size: 13px;
  color: var(--text-secondary);
}
.kpi-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
.bg-primary-light { background-color: var(--primary-light); color: var(--primary); }
.bg-success-light { background-color: #D1FAE5; color: var(--success); }
.text-primary { color: var(--primary); }
.text-success { color: var(--success); }

.flex-row-stats {
  justify-content: center;
  gap: 32px;
}
.sport-stat {
  text-align: center;
}
.divider {
  width: 1px;
  height: 48px;
  background-color: var(--border);
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}
.chart-container {
  padding: 24px;
  display: flex;
  flex-direction: column;
}
.chart-container h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
}
.chart-box {
  width: 100%;
  height: 300px;
  position: relative;
}

.mb-4 { margin-bottom: 24px; }
.mt-4 { margin-top: 24px; }
</style>