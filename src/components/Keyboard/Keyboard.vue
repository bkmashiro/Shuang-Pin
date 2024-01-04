<template>
  <div>
    <slot name="upper" />
    <slot />
    <slot name="lower" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
const props = defineProps({
  space: {
    type: Number,
    default: 5
  },
})

const slots = defineSlots<
  { [cols: string]: any }
>()
</script>

<style scoped></style>