<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  DashboardOutlined,
  CalendarOutlined,
  LineChartOutlined,
  TeamOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'

const route = useRoute()

const collapsed = ref(false)
const isMobile = ref(false)
const mobileSidebarOpen = useState<boolean>('mobile-sidebar-open', () => false)

const menuItems = ref([
  { key: 'dashboard', icon: DashboardOutlined, label: 'Dashboard', route: '/dashboard' },
  { key: 'bookings', icon: CalendarOutlined, label: 'Bookings', route: '/bookings' },
  { key: 'reports', icon: LineChartOutlined, label: 'Reports', route: '/reports' },
  { key: 'users', icon: TeamOutlined, label: 'Users / Roles', route: '/users' },
  { key: 'settings', icon: SettingOutlined, label: 'Settings', route: '/settings' },
])

const updateViewport = () => {
  isMobile.value = window.innerWidth < 992
  if (!isMobile.value) {
    mobileSidebarOpen.value = false
  }
}

const selectedMenu = computed(() => {
  const currentPath = route.path

  const active = menuItems.value.find(item =>
    currentPath.startsWith(item.route)
  )

  return active ? [active.key] : []
})

const onNavigate = async (path: string) => {
  await navigateTo(path)
  mobileSidebarOpen.value = false
}

onMounted(() => {
  updateViewport()
  window.addEventListener('resize', updateViewport)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewport)
})
</script>

<template>
  <a-layout-sider
    v-if="!isMobile"
    v-model:collapsed="collapsed"
    collapsible
    :width="260"
    :collapsedWidth="80"
    theme="light"
    class="premium-sider"
  >
    <div class="logo-container">
      <div class="logo-icon"></div>
      <div class="logo-text-block" v-if="!collapsed">
        <span class="logo-text">MSA</span>
        <span class="logo-subtext">Mansehra Sports Arena</span>
      </div>
    </div>

    <a-menu
      class="premium-menu"
      mode="inline"
      :selectedKeys="selectedMenu"
      style="border-right: 0"
    >
      <template v-for="item in menuItems" :key="item.key">
        <a-menu-item @click="onNavigate(item.route)">
          <template #icon>
            <component :is="item.icon" />
          </template>
          {{ item.label }}
        </a-menu-item>
      </template>
    </a-menu>
  </a-layout-sider>

  <a-drawer
    v-else
    :open="mobileSidebarOpen"
    placement="left"
    width="260"
    :closable="false"
    :bodyStyle="{ padding: '0' }"
    @close="mobileSidebarOpen = false"
  >
    <div class="logo-container">
      <div class="logo-icon"></div>
      <div class="logo-text-block">
        <span class="logo-text">MSA</span>
        <span class="logo-subtext">Mansehra Sports Arena</span>
      </div>
    </div>

    <a-menu
      class="premium-menu"
      mode="inline"
      :selectedKeys="selectedMenu"
      style="border-right: 0; padding-top: 12px;"
    >
      <template v-for="item in menuItems" :key="item.key">
        <a-menu-item @click="onNavigate(item.route)">
          <template #icon>
            <component :is="item.icon" />
          </template>
          {{ item.label }}
        </a-menu-item>
      </template>
    </a-menu>
  </a-drawer>
</template>

<style scoped>
.premium-sider {
  border: 1px solid var(--border);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.02);
  z-index: 10;
  background: rgb(241, 240, 240);
  border-right: 1px solid rgba(0,0,0,0.04);
}

.logo-container {
  height: 65px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
  border-bottom: 1px solid rgba(0,0,0,0.04);
  margin-bottom: 24px;
}

.logo-icon {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, var(--primary) 0%, rgba(var(--primary-rgb, 79, 70, 229), 0.7) 100%);
  border-radius: 12px;
  flex-shrink: 0;
  box-shadow: 0 8px 16px rgba(var(--primary-rgb, 79, 70, 229), 0.25);
  position: relative;
  overflow: hidden;
}

.logo-icon::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, #4f46e5, transparent);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { left: -100%; }
  20% { left: 200%; }
  100% { left: 200%; }
}

.logo-text-block {
  display: flex;
  flex-direction: column;
}

.logo-text {
  font-size: 20px;
  font-weight: 800;
  line-height: 1.1;
  background: linear-gradient(to right, #4f46e5, var(--primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
  letter-spacing: -0.5px;
}

.logo-subtext {
  font-size: 11px;
  color: #000000;
  font-weight: 600;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

/* Menu Styling */
:deep(.ant-menu) {
  padding: 0 16px;
  background: transparent !important;
}

:deep(.ant-menu-item) {
  height: 48px !important;
  line-height: 48px !important;
  border-radius: 12px !important;
  margin-bottom: 8px !important;
  font-weight: 500;
  color: #000000;
  transition: all 0.25s ease;
}

:deep(.ant-menu-item:hover) {
  color: var(--primary) !important;
  background: #7d72f2 !important;
  transform: translateX(4px);
}

:deep(.ant-menu-item-selected) {
  background: linear-gradient(135deg, #cccad8 0%, #7d72f2 100%) !important;
  color: var(--primary) !important;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(var(--primary-rgb, 79, 70, 229), 0.1);
}

:deep(.ant-menu-item-selected::after) {
  display: none !important;
}

:deep(.ant-menu-item .anticon) {
  font-size: 18px !important;
  margin-right: 12px !important;
  transition: all 0.25s ease;
}

:deep(.ant-menu-item:hover .anticon) {
  transform: scale(1.1);
}

:deep(.ant-menu-item-selected .anticon) {
  transform: scale(1.1);
  color: var(--primary);
}
</style>