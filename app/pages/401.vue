<script setup lang="ts">
definePageMeta({ layout: 'guest' });

const route = useRoute();

const target = computed(() => {
  const q = route.query.redirect;
  if (typeof q === 'string' && q.length) {
    try {
      return decodeURIComponent(q);
    } catch {
      return q;
    }
  }
  return '/';
});

await navigateTo({
  path: '/login',
  query: {
    redirect: target.value === '/' ? undefined : target.value,
  },
});
</script>

<template>
  <div />
</template>
