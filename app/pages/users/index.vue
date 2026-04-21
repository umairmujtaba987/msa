<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Modal } from 'ant-design-vue'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const { $api } = useNuxtApp()
const authStore = useAuthStore()

const isSuperadmin = computed(() => authStore.isSuperadmin)

const users = ref([])
const loading = ref(false)
const pagination = ref({ current: 1, pageSize: 10, total: 0 })

const isModalVisible = ref(false)
const selectedUser = ref<any>(null)

const columns = computed(() => {
  const cols = [
    { title: 'User Name', dataIndex: 'name', key: 'name' },
    { title: 'Email Address', dataIndex: 'email', key: 'email' },
    { title: 'Role Access', dataIndex: 'role', key: 'role' },
  ]
  
  if (isSuperadmin.value) {
    cols.push({ title: 'Actions', key: 'actions', align: 'right' as const })
  }
  return cols
})

const fetchUsers = async (page = 1) => {
  loading.value = true
  try {
    const res: any = await $api(`/users?page=${page}`)
    users.value = res.data
    pagination.value.total = res.total
    pagination.value.current = res.current_page
  } catch (error) {
    console.error('Failed to load users', error)
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  fetchUsers(pag.current)
}

const getRoleName = (record: any) => {
  return record.roles?.[0]?.name || 'user'
}

const openCreateModal = () => {
  selectedUser.value = null
  isModalVisible.value = true
}

const openEditModal = (record: any) => {
  selectedUser.value = { ...record }
  isModalVisible.value = true
}

const confirmDelete = (record: any) => {
  Modal.confirm({
    title: 'Are you sure you want to delete this user?',
    content: `You are about to delete user: ${record.name}`,
    okText: 'Yes, Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk: async () => {
      try {
        await $api(`/users/${record.id}`, { method: 'DELETE' })
        fetchUsers(pagination.value.current)
      } catch (e: any) {
        Modal.error({
          title: 'Failed to delete',
          content: e?.data?.message || 'Error occurred.'
        })
      }
    }
  })
}

onMounted(() => fetchUsers())
</script>

<template>
  <div>
    <div class="page-header d-flex justify-between align-center mb-4">
      <div>
        <h2 class="page-title">User Roles & Access</h2>
        <p class="text-muted">Manage system administrators and managers.</p>
      </div>
      <a-button v-if="isSuperadmin" type="primary" size="large" @click="openCreateModal">
        + Add User
      </a-button>
    </div>

    <div class="premium-card p-0 overflow-hidden">
      <a-table 
        :dataSource="users" 
        :columns="columns" 
        :rowKey="record => record.id"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'role'">
            <a-tag :color="getRoleName(record) === 'superadmin' ? 'purple' : (getRoleName(record) === 'admin_manager' ? 'blue' : 'default')">
              {{ getRoleName(record) }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'actions'">
            <a-button type="link" @click="openEditModal(record)">Edit</a-button>
            <a-button type="link" danger @click="confirmDelete(record)" :disabled="record.id === authStore.user?.id">Delete</a-button>
          </template>
          
          <template v-else>
            {{ text }}
          </template>
        </template>
      </a-table>
    </div>

    <UsersUserModal 
      v-model:visible="isModalVisible" 
      :user="selectedUser" 
      @saved="fetchUsers(pagination.current)" 
    />
  </div>
</template>

<style scoped>
.page-title { margin: 0 0 4px 0; font-size: 24px; }
.text-muted { color: var(--text-muted); }
.text-sm { font-size: 13px; }

.d-flex { display: flex; }
.justify-between { justify-content: space-between; }
.align-center { align-items: center; }
.mb-4 { margin-bottom: 24px; }
.p-0 { padding: 0; }
.overflow-hidden { overflow: hidden; }
</style>