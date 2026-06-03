<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const activeTab = ref('courts')
const loading = ref(false)
const fetching = ref(false)
const errorMsg = ref('')
const formRef = ref()

const settingsForm = ref({
  court_a_sport: 'Cricket',
  court_a_status: true,
  court_b_sport: 'Football',
  court_b_status: true,
  cricket_price: 1500,
  football_price: 2000,
  arena_name: 'MSA Mansehra Sports Arena',
  contact_email: 'contact@msa.com'
})

const rules = {
  court_a_sport: [{ required: true, message: 'Please select Court A sport', trigger: 'change' }],
  court_b_sport: [{ required: true, message: 'Please select Court B sport', trigger: 'change' }],
  cricket_price: [{ required: true, type: 'number', min: 0, message: 'Cricket price must be 0 or more', trigger: 'change' }],
  football_price: [{ required: true, type: 'number', min: 0, message: 'Football price must be 0 or more', trigger: 'change' }],
  arena_name: [{ required: true, message: 'Arena name is required', trigger: 'blur' }],
  contact_email: [{ required: true, type: 'email', message: 'Valid contact email is required', trigger: 'blur' }],
}

const fetchSettings = async () => {
  fetching.value = true
  errorMsg.value = ''
  try {
    const res: any = await settingsService().get()
    const payload = res?.data ?? {}
    if (Object.keys(payload).length > 0) {
      settingsForm.value = { ...settingsForm.value, ...payload }
    }
  } catch (error) {
    errorMsg.value = 'Failed to load settings. Please try again.'
  } finally {
    fetching.value = false
  }
}

const saveSettings = async () => {
  errorMsg.value = ''
  await formRef.value?.validate()
  loading.value = true
  try {
    const res: any = await settingsService().update(settingsForm.value as Record<string, unknown>)
    settingsForm.value = { ...settingsForm.value, ...(res?.data ?? {}) }
    message.success('Settings updated successfully.')
  } catch (error) {
    errorMsg.value = (error as any)?.data?.message || 'Error updating settings.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchSettings)
</script>

<template>
  <div class="settings-page">
    <div class="page-header mb-4">
      <h2 class="page-title">System Settings</h2>
      <p class="text-muted">Configure MSA properties, courts, and pricing models.</p>
    </div>

    <a-alert v-if="errorMsg" :message="errorMsg" type="error" show-icon class="mb-4" />
    <div v-if="fetching" class="premium-card" style="padding: 40px; text-align: center">
      <a-spin tip="Loading settings..." />
    </div>
    <div v-else class="premium-card">
      <a-tabs v-model:activeKey="activeTab" class="settings-tabs">
        <a-tab-pane key="courts" tab="Manage Courts">
          <div class="tab-content">
            <h3>Facility Management</h3>
            <p class="text-muted mb-4">Enable or disable courts and assign their designated sports dynamically.</p>
            
            <a-form ref="formRef" layout="vertical" :model="settingsForm" :rules="rules">
              <a-row :gutter="24">
                <a-col :span="12">
                  <div class="court-block">
                    <h4>Court A</h4>
                    <a-form-item label="Sport Type" name="court_a_sport">
                      <a-select v-model:value="settingsForm.court_a_sport">
                        <a-select-option value="Cricket">Cricket</a-select-option>
                        <a-select-option value="Football">Football</a-select-option>
                        <a-select-option value="Multi">Multi-purpose</a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item label="Status">
                      <a-switch v-model:checked="settingsForm.court_a_status" /> Active
                    </a-form-item>
                  </div>
                </a-col>

                <a-col :span="12">
                  <div class="court-block">
                    <h4>Court B</h4>
                    <a-form-item label="Sport Type" name="court_b_sport">
                      <a-select v-model:value="settingsForm.court_b_sport">
                         <a-select-option value="Cricket">Cricket</a-select-option>
                        <a-select-option value="Football">Football</a-select-option>
                        <a-select-option value="Multi">Multi-purpose</a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item label="Status">
                      <a-switch v-model:checked="settingsForm.court_b_status" /> Active
                    </a-form-item>
                  </div>
                </a-col>
              </a-row>

              <div style="margin-top: 16px;">
                 <a-button type="primary" :loading="loading" @click="saveSettings">Update Courts</a-button>
              </div>
            </a-form>
          </div>
        </a-tab-pane>

        <a-tab-pane key="pricing" tab="Pricing Defaults">
          <div class="tab-content">
            <h3>Standard Pricing</h3>
            <a-form layout="vertical" style="max-width: 400px" :model="settingsForm" :rules="rules">
              <a-form-item label="Cricket Base Price (per hour)" name="cricket_price">
                <a-input-number v-model:value="settingsForm.cricket_price" style="width: 100%" />
              </a-form-item>
              <a-form-item label="Football Base Price (per hour)" name="football_price">
                <a-input-number v-model:value="settingsForm.football_price" style="width: 100%" />
              </a-form-item>
              <a-button type="primary" :loading="loading" @click="saveSettings">Save Pricing</a-button>
            </a-form>
          </div>
        </a-tab-pane>

        <a-tab-pane key="system" tab="General System">
          <div class="tab-content">
            <h3>General Configurations</h3>
            <a-form layout="vertical" style="max-width: 400px" :model="settingsForm" :rules="rules">
              <a-form-item label="Arena Name" name="arena_name">
                <a-input v-model:value="settingsForm.arena_name" />
              </a-form-item>
              <a-form-item label="Contact Email" name="contact_email">
                <a-input v-model:value="settingsForm.contact_email" />
              </a-form-item>
              <a-button type="primary" :loading="loading" @click="saveSettings">Update System</a-button>
            </a-form>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<style scoped>
.page-title { margin: 0 0 4px 0; font-size: 24px; }
.text-muted { color: var(--text-muted); }
.mb-4 { margin-bottom: 24px; }

.settings-tabs {
  padding: 8px 24px 24px;
}
.tab-content {
  padding: 16px 0;
}
.tab-content h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.court-block {
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--background);
}
.court-block h4 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 16px;
  color: var(--primary);
}

@media (max-width: 991px) {
  .settings-tabs {
    padding: 8px 16px 16px;
  }
}

@media (max-width: 767px) {
  .page-title {
    font-size: 20px;
  }

  :deep(.ant-tabs-nav) {
    margin-bottom: 8px;
  }

  :deep(.ant-col) {
    max-width: 100%;
    flex: 0 0 100%;
  }

  .court-block {
    padding: 14px;
  }

  .tab-content {
    padding: 8px 0;
  }
}
</style>
