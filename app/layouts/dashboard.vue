<template>
  <a-layout class="app-container">
    <UiSidebar />
    <a-layout class="main-layout">
      <UiTopbar />
      <a-layout-content class="dashboard-content">
        <div class="premium-card content-card">
          <slot />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.main-layout {
  min-width: 0;
}

.dashboard-content {
  padding: 16px !important;
}

.content-card {
  min-height: calc(100vh - 110px);
  padding: 24px;
}

@media (max-width: 767px) {
  .dashboard-content {
    padding: 12px !important;
  }

  .content-card {
    padding: 16px;
    min-height: calc(100vh - 90px);
  }
}
</style>