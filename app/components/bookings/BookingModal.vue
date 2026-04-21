<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'

const props = defineProps<{
  visible: boolean
  booking?: any
}>()

const emit = defineEmits(['update:visible', 'saved'])
const { $api } = useNuxtApp()

const loading = ref(false)
const configLoading = ref(false)
const priceLoading = ref(false)
const configError = ref('')
const autoPriceEnabled = ref(true)
const customPrice = ref(false)

type CourtOption = {
  id: string
  label: string
  allowed_sports: string[]
  default_sport: string | null
}

const bookingConfig = ref<{
  courts: CourtOption[]
  pricing: Record<string, number>
}>({
  courts: [],
  pricing: {},
})

const form = reactive({
  id: null as number | null,
  customer_name: '',
  phone_number: '',
  court: '',
  sport: '',
  booking_date: null as any,
  start_time: null as any,
  end_time: null as any,
  price: 0,
  notes: ''
})

const selectedCourt = computed(() => bookingConfig.value.courts.find((c) => c.id === form.court))
const availableSports = computed(() => selectedCourt.value?.allowed_sports ?? [])
const canSubmit = computed(() => bookingConfig.value.courts.length > 0 && !configLoading.value)

const resetForm = () => {
  form.id = null
  form.customer_name = ''
  form.phone_number = ''
  form.court = bookingConfig.value.courts[0]?.id || ''
  form.sport = selectedCourt.value?.default_sport || bookingConfig.value.courts[0]?.default_sport || ''
  form.booking_date = null
  form.start_time = null
  form.end_time = null
  form.price = 0
  form.notes = ''
  autoPriceEnabled.value = true
  customPrice.value = false
}

const ensureValidSportSelection = () => {
  if (!availableSports.value.length) {
    form.sport = ''
    return
  }
  if (!availableSports.value.includes(form.sport)) {
    form.sport = availableSports.value[0]
  }
}

const fetchBookingConfig = async () => {
  configLoading.value = true
  configError.value = ''
  try {
    const res: any = await $api('/booking-config')
    bookingConfig.value = res?.data || { courts: [], pricing: {} }
    if (!bookingConfig.value.courts.length) {
      configError.value = 'No active courts are configured. Please enable courts in Settings first.'
    }
  } catch (error: any) {
    configError.value = error?.data?.message || 'Failed to load booking settings.'
    bookingConfig.value = { courts: [], pricing: {} }
  } finally {
    configLoading.value = false
  }
}

const recalculatePrice = async (dependencyChanged = false) => {
  if (dependencyChanged) {
    customPrice.value = false
  }

  if (!autoPriceEnabled.value) {
    return
  }

  if (customPrice.value && !dependencyChanged) {
    return
  }

  if (!form.court || !form.sport || !form.start_time) {
    form.price = 0
    return
  }

  priceLoading.value = true
  try {
    const res: any = await $api('/bookings/calculate-price', {
      method: 'POST',
      body: {
        court: form.court,
        sport: form.sport,
        start_time: form.start_time,
        end_time: form.end_time || null,
      },
    })
    form.price = Number(res?.data?.price || 0)
  } catch {
    form.price = 0
  } finally {
    priceLoading.value = false
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    fetchBookingConfig()
    if (props.booking) {
      autoPriceEnabled.value = true
      customPrice.value = false
      form.id = props.booking.id
      form.customer_name = props.booking.customer_name
      form.phone_number = props.booking.phone_number
      form.court = props.booking.court
      form.sport = props.booking.sport
      form.booking_date = props.booking.booking_date
      form.start_time = props.booking.start_time
      form.end_time = props.booking.end_time || null
      form.price = props.booking.price
      form.notes = props.booking.notes || ''
    } else {
      resetForm()
    }
  }
})

watch(() => form.court, () => {
  ensureValidSportSelection()
  recalculatePrice(true)
})

watch(() => [form.sport, form.start_time, form.end_time], () => {
  recalculatePrice(true)
})

watch(autoPriceEnabled, (enabled) => {
  if (enabled) {
    customPrice.value = false
    recalculatePrice(true)
  }
})

const onManualPriceChange = (value: number | null) => {
  form.price = Number(value ?? 0)
  customPrice.value = true
}

const handleCancel = () => {
  emit('update:visible', false)
}

const handleSave = async () => {
  try {
    loading.value = true
    if (!canSubmit.value) {
      message.error('Booking settings are unavailable. Please configure courts in Settings.')
      return
    }
    if (Number.isNaN(Number(form.price)) || Number(form.price) < 0) {
      message.error('Price must be a valid non-negative number.')
      return
    }

    const payload = {
      ...form,
      booking_date: form.booking_date,
      start_time: form.start_time,
      end_time: form.end_time || null,
    }
    
    if (form.id) {
      await $api(`/bookings/${form.id}`, { method: 'PUT', body: payload })
    } else {
      await $api('/bookings', { method: 'POST', body: payload })
    }
    
    emit('saved')
    emit('update:visible', false)
  } catch (error: any) {
    message.error(error?.data?.message || 'Failed to save booking.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <a-modal
    :visible="visible"
    :title="form.id ? 'Edit Booking' : 'New Booking'"
    @cancel="handleCancel"
    @ok="handleSave"
    :confirmLoading="loading"
    :okButtonProps="{ disabled: !canSubmit }"
    destroyOnClose
    okText="Save Booking"
    width="600px"
  >
    <a-alert v-if="configError" :message="configError" type="warning" show-icon style="margin-bottom: 12px" />
    <a-spin :spinning="configLoading" tip="Loading court and pricing settings...">
    <a-form layout="vertical" class="mt-4">
      <div class="flex-row">
        <a-form-item label="Customer Name" required style="flex: 1">
          <a-input v-model:value="form.customer_name" placeholder="John Doe" />
        </a-form-item>
        <a-form-item label="Phone Number" required style="flex: 1">
          <a-input v-model:value="form.phone_number" placeholder="+92 3XX XXXXXXX" />
        </a-form-item>
      </div>

      <div class="flex-row">
        <a-form-item label="Court" required style="flex: 1">
          <a-select v-model:value="form.court" :disabled="!bookingConfig.courts.length">
            <a-select-option v-for="court in bookingConfig.courts" :key="court.id" :value="court.id">
              {{ court.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Sport" required style="flex: 1">
          <a-select v-model:value="form.sport" :disabled="!availableSports.length">
            <a-select-option v-for="sport in availableSports" :key="sport" :value="sport">
              {{ sport }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>

      <div class="flex-row">
        <a-form-item label="Date" required style="flex: 1">
          <!-- Fallback simple inputs since we aren't loading dayjs globally just yet -->
          <a-input type="date" v-model:value="form.booking_date" />
        </a-form-item>
        <a-form-item label="Time Slot" required style="flex: 1">
          <a-input type="time" v-model:value="form.start_time" />
        </a-form-item>
        <a-form-item label="End Time" style="flex: 1">
          <a-input type="time" v-model:value="form.end_time" />
        </a-form-item>
        <a-form-item label="Price (PKR)" required style="flex: 1">
          <a-input-number :value="form.price" style="width: 100%" :min="0" @change="onManualPriceChange" />
          <small style="color: var(--text-muted)">
            {{
              autoPriceEnabled
                ? (priceLoading ? 'Calculating price...' : (customPrice ? 'Custom price active (auto will reset on court/time/sport change)' : 'Auto-filled from settings'))
                : 'Manual pricing mode'
            }}
          </small>
        </a-form-item>
      </div>

      <div class="flex-row">
        <a-form-item label="Pricing Mode" style="flex: 1">
          <a-switch v-model:checked="autoPriceEnabled" />
          <span style="margin-left: 8px;">Use Auto Price</span>
        </a-form-item>
      </div>

      <a-form-item label="Notes (Optional)">
        <a-textarea v-model:value="form.notes" :rows="3" placeholder="Special requirements or notes..." />
      </a-form-item>
    </a-form>
    </a-spin>
  </a-modal>
</template>

<style scoped>
.flex-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.flex-row :deep(.ant-form-item) {
  min-width: 0;
}

@media (max-width: 767px) {
  .flex-row {
    flex-direction: column;
    gap: 8px;
  }
}
.mt-4 {
  margin-top: 16px;
}
</style>
