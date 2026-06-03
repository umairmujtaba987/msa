<script setup lang="ts">
import { ref, watch, reactive } from 'vue'

const props = defineProps({
  visible: Boolean,
  user: Object as () => any | null
})

const emit = defineEmits(['update:visible', 'saved'])

const isVisible = ref(props.visible)
const loading = ref(false)

const formState = reactive({
  id: null as number | null,
  name: '',
  email: '',
  password: '',
  role: 'user', // Default to basic user
})

watch(() => props.visible, (val) => {
  isVisible.value = val
  if (val) {
    if (props.user) {
      formState.id = props.user.id
      formState.name = props.user.name || ''
      formState.email = props.user.email || ''
      formState.password = '' // Don't populate password
      formState.role = props.user.roles?.[0]?.name || 'user'
    } else {
      formState.id = null
      formState.name = ''
      formState.email = ''
      formState.password = ''
      formState.role = 'user'
    }
  }
})

watch(isVisible, (val) => {
  emit('update:visible', val)
})

const handleFinish = async () => {
  loading.value = true
  try {
    const payload: any = {
      name: formState.name,
      email: formState.email,
      role: formState.role,
    }
    
    // Only send password if provided (required on create, optional on edit)
    if (formState.password) {
      payload.password = formState.password
    }

    if (formState.id) {
      // Update
      await userService().update(formState.id, payload)
    } else {
      // Create
      await userService().create(payload)
    }

    isVisible.value = false
    emit('saved')
  } catch (error: any) {
    console.error('Failed to save user:', error)
    // Optional: add a toast/notification here if there's a global notification system setup
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <a-modal
    v-model:visible="isVisible"
    :title="formState.id ? 'Edit User Role Details' : 'Create New User'"
    @ok="handleFinish"
    :confirmLoading="loading"
    destroyOnClose
    okText="Save User"
    cancelText="Cancel"
  >
    <a-form layout="vertical" :model="formState" @finish="handleFinish" class="mt-4">
      <a-form-item label="Full Name" name="name" :rules="[{ required: true, message: 'Please input full name!' }]">
        <a-input v-model:value="formState.name" placeholder="John Doe" size="large" />
      </a-form-item>

      <a-form-item label="Email Address" name="email" :rules="[{ required: true, type: 'email', message: 'Please input valid email!' }]">
        <a-input v-model:value="formState.email" placeholder="john@example.com" size="large" />
      </a-form-item>

      <a-form-item 
        label="Password" 
        name="password" 
        :rules="[{ required: !formState.id, message: 'Please provide a password for new users!' }]"
        :extra="formState.id ? 'Leave blank to keep password unchanged.' : ''"
      >
        <a-input-password v-model:value="formState.password" placeholder="Min 8 characters" size="large" />
      </a-form-item>
      
      <a-form-item label="Assign Role" name="role" :rules="[{ required: true, message: 'Please assign a role!' }]">
        <a-select v-model:value="formState.role" size="large">
          <a-select-option value="user">Basic User (No Dashboard Access)</a-select-option>
          <a-select-option value="admin_manager">Admin Manager (Read-Only Users)</a-select-option>
          <a-select-option value="superadmin">Super Admin (Full Access)</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>
.mt-4 {
  margin-top: 16px;
}
</style>
