<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isReady = ref(false)

onMounted(() => {
  // Allow Nuxt to hydrate and Ant Design to inject CSS before rendering DOM
  setTimeout(() => {
    isReady.value = true
  }, 200) // 200ms guarantees chunk evaluation completes smoothly
})
</script>

<template>
  <div>
    <!-- Global Loading Splash Screen (Protects against Ant Design FOUC) -->
    <div v-if="!isReady" class="global-splash">
      <div class="splash-spinner"></div>
      <p class="splash-text">Loading MSA Arena...</p>
    </div>

    <!-- Main Nuxt App rendered transparently via v-show so Vue hooks process -->
    <div v-show="isReady">
      <a-config-provider
        :theme="{
          token: {
            colorPrimary: '#4f46e5',
            borderRadius: 6,
            fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
          },
        }"
      >
        <div class="app-wrapper">
          <!-- NuxtLoadingIndicator helps with soft-route navigation loading -->
          <NuxtLoadingIndicator color="#4f46e5" :height="3" />
          
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </div>
      </a-config-provider>
    </div>
  </div>
</template>

<style>
/* Splash Screen Root CSS (Does not depend on external files) */
.global-splash {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #F8FAFC;
  z-index: 999999;
}

.splash-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #EEF2FF;
  border-top-color: #4F46E5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.splash-text {
  color: #475569;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 500;
  font-size: 15px;
  letter-spacing: 0.5px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
