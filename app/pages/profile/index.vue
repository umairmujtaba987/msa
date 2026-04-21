<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const auth = useAuthStore()
const loading = ref(false)
const errorMsg = ref('')

const form = ref({
  name: '',
  email: '',
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

onMounted(async () => {
  try {
    const { $api } = useNuxtApp()
    // Explicitly call the API to fetch current user data to ensure the form populates
    const res: any = await $api('/profile')
    const user = res?.data
    if (user) {
      form.value.name = user.name || ''
      form.value.email = user.email || ''
    }
  } catch (err) {
    console.error('Could not fetch user profile details:', err)
  }
})

const handleUpdateProfile = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const { $api } = useNuxtApp()
    await $api('/profile', { method: 'PUT', body: form.value })
    
    // Refresh auth user state
    await auth.fetchProfile()
    message.success('Profile updated successfully.')
  } catch (error: any) {
    console.error(error)
    errorMsg.value = error?.data?.message || 'Failed to update profile.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="profile-page">
    <div class="page-header d-flex justify-between align-center mb-4">
      <div>
        <h2 class="page-title">My Profile</h2>
        <p class="text-muted">Manage your personal settings and security.</p>
      </div>
    </div>

    <div class="premium-card p-4 mx-auto" style="max-width: 600px">
      <a-alert v-if="errorMsg" :message="errorMsg" type="error" show-icon class="mb-4" />
      
      <div class="avatar-section text-center mb-4">
        <div class="big-avatar">
          {{ auth.user?.name?.charAt(0) || 'U' }}
        </div>
        <div class="mt-2 text-muted">Administrator</div>
      </div>

      <a-form layout="vertical" @submit.prevent="handleUpdateProfile">
        <h3>Personal Details</h3>
        <a-form-item label="Full Name">
          <a-input v-model:value="form.name" size="large" autocomplete="off" name="name_no_autofill" />
        </a-form-item>
        
        <a-form-item label="Email Address">
          <a-input v-model:value="form.email" size="large" disabled autocomplete="off" name="email_no_autofill" />
          <div class="text-sm text-muted mt-1">Email cannot be changed directly. Contact Super Admin.</div>
        </a-form-item>

        <a-divider />

        <h3>Change Password</h3>
        <p class="text-muted text-sm mb-4">Leave blank if you do not wish to change your password.</p>
        
        <!-- Hidden username trap to prevent Chrome from guessing the wrong fields -->
        <input type="text" style="display:none" autocomplete="username">
        
        <a-form-item label="Current Password">
          <a-input-password v-model:value="form.current_password" size="large" autocomplete="new-password" name="pw_curr_no_autofill" />
        </a-form-item>
        
        <a-form-item label="New Password">
          <a-input-password v-model:value="form.new_password" size="large" autocomplete="new-password" name="pw_new_no_autofill" />
        </a-form-item>

        <div style="margin-top: 32px">
          <a-button type="primary" size="large" html-type="submit" :loading="loading" block>
            Save Changes
          </a-button>
        </div>
      </a-form>
    </div>
  </div>
</template>

<style scoped>
.page-title { margin: 0 0 4px 0; font-size: 24px; }
.text-muted { color: var(--text-muted); }
.text-sm { font-size: 13px; }
.mt-1 { margin-top: 4px; }
.mt-2 { margin-top: 8px; }
.mb-4 { margin-bottom: 24px; }
.p-4 { padding: 32px; }
.mx-auto { margin-left: auto; margin-right: auto; }
.text-center { text-align: center; }

.big-avatar {
  width: 96px;
  height: 96px;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 36px;
  margin: 0 auto;
}

h3 {
  font-size: 16px;
  margin-bottom: 16px;
  color: var(--text-primary);
}
</style>
