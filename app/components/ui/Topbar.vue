<script setup lang="ts">
import { LogoutOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons-vue'
import { onMounted, onUnmounted, ref } from 'vue'

const auth = useAuthStore()
const sidebarOpen = useState<boolean>('mobile-sidebar-open', () => false)
const isMobile = ref(false)

const updateViewport = () => {
  isMobile.value = window.innerWidth < 992
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const handleLogout = () => {
  auth.logout()
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
  <a-layout-header class="topbar">
    <div class="topbar-left">
      <a-button v-if="isMobile" type="text" class="menu-trigger" @click="toggleSidebar">
        <MenuOutlined />
      </a-button>
      <h2 class="page-title">{{ $route.meta.title || ' ' }}</h2>
    </div>
    
    <div class="topbar-right">
      <a-dropdown placement="bottomRight" :trigger="['click']">
        <div class="user-profile">
          <div class="avatar">
            {{ auth.user?.name?.charAt(0) || 'U' }}
          </div>
          <div class="user-info">
            <span class="user-name" v-if="auth.user?.name">{{ auth.user?.name }}</span>
            <span class="user-role" v-if="auth.roles && auth.roles.length">{{ auth.roles[0] }}</span>
          </div>
        </div>
        
        <template #overlay>
          <a-menu>
            <a-menu-item key="profile" @click="navigateTo('/profile')">
              <template #icon><UserOutlined /></template>
              Profile
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="logout" @click="handleLogout" style="color: var(--danger)">
              <template #icon><LogoutOutlined /></template>
              Logout
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<style scoped>
.topbar {
  display: flex !important;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(241, 240, 240)  !important;
  height: 65px;
  
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(0,0,0,0.04);
  
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827 !important;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.menu-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast);
}

.user-profile:hover {
  background-color: rgba(255, 255, 255, 0.034);
}

.avatar {
  width: 36px;
  height: 36px;
  background: var(--primary);
  color: #000000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-name {
  font-weight: 600;
  color: #000000 !important;
  font-size: 14px;
}

.user-role {
  font-size: 12px;
  color: #333333 !important;
  text-transform: capitalize;
}

@media (max-width: 767px) {
  .topbar {
    height: 56px;
    margin-bottom: 12px;
    padding: 0 10px;
  }

  .page-title {
    font-size: 16px;
  }

  .user-info {
    display: none;
  }
}
</style>
