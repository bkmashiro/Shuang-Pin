<template>
  <div class="relative flex flex-row items-stretch text-left ml">
    <Cap v-for="item in props.items" :item="item" class="flex-1 inline ml-3 mr-3" />
  </div>
</template>

<script lang="ts" setup>
import Cap from './KeyCap.vue';
import { ref, type PropType, watch } from 'vue';

import type { KeyCap } from './keycap';
const props = defineProps({
  items: {
    type: Array as PropType<KeyCap[]>,
    default: []
  },
  marginLeft: {
    type: Number,
    default: 0
  }
})

const dynamicStyle = ref({ marginLeft: `${props.marginLeft}em` });
watch(() => props.marginLeft, () => {
  dynamicStyle.value.marginLeft = `${props.marginLeft}em`;
});

</script>

<style scoped>

.ml {
  margin-left: v-bind('dynamicStyle.marginLeft')
}
</style>