<script setup lang="ts">
import { reactive, ref } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const auth = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const loading = ref(false)
const errorMsg = ref('')

const submit = async () => {
  loading.value = true
  errorMsg.value = ''

  try {
    await auth.login(form)
    navigateTo('/dashboard')
  } catch (e: any) {
    errorMsg.value = e || 'Invalid login credentials'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="premium-card login-card">
    <div class="login-header">
      <div class="login-logo text-gradient">MSA</div>
      <h2>Welcome Back</h2>
      <p class="subtitle">Please sign in to continue</p>
    </div>

    <a-alert v-if="errorMsg" :message="errorMsg" type="error" show-icon class="mb-4" />

    <a-form layout="vertical" @submit.prevent="submit" class="login-form">
      <a-form-item label="Email Address">
        <a-input 
          v-model:value="form.email" 
          size="large" 
          placeholder="admin@example.com"
        >
          <template #prefix>
            <UserOutlined style="color: rgba(0,0,0,.25)" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item label="Password">
        <a-input-password 
          v-model:value="form.password" 
          size="large" 
          placeholder="Enter password"
        >
          <template #prefix>
            <LockOutlined style="color: rgba(0,0,0,.25)" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item class="mt-2">
        <a-button 
          type="primary" 
          html-type="submit" 
          size="large" 
          block 
          :loading="loading"
        >
          Sign In
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
.login-card {
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 8px;
  letter-spacing: -1px;
}

.login-header h2 {
  font-size: 24px;
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-muted);
  font-size: 14px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-2 {
  margin-top: 8px;
}
</style>