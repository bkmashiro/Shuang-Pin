<template>
  <div class="grid grid-cols-3 grid-rows-3 gap-1 border-amber-500 max-w-24 max-h-24"
    :class="hilighted ? 'bg-yellow-200' : ''">
    <div style="grid-column: 1 / 3; grid-row: 1 / 3;" class="text-5xl">
      {{ item.main }}
    </div>
    <div style="grid-column: 2; grid-row: 1;">
      <p class="pl-2 text-xl">{{ item.sub }}</p>
    </div>
    <div style="grid-column: 2; grid-row: 2;">
      <p class="pl-2">{{ item.bottom }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import type { PropType } from 'vue';
import { KeyCap } from './keycap';
import { ref, onMounted, onUnmounted } from 'vue';
import { useHanziStore } from '../../stores/hanzi';
const store = useHanziStore()

const props = defineProps({
  item: {
    type: Object as PropType<KeyCap>,
    required: true
  }
})

const identifiers = {
  main: store.getIdentifier('main', props.item.main),
  sub: store.getIdentifier('sub', props.item.sub || ''),
  bottom: store.getIdentifier('bottom', props.item.bottom || '')
}

onMounted(() => {
  Object.entries(identifiers).forEach(([key, value]) => {
    if (value) {
      store.registerHilightable(value, {
        hilight,
        unHilight,
        toggleHilight
      })
    }
  })
})

onUnmounted(() => {
  Object.entries(identifiers).forEach(([key, value]) => {
    if (value) {
      store.unRegisterHilightable(value)
    }
  })
})

const hilightedSubject = new BehaviorSubject<boolean>(false);

// do not frequently responce to dehilight, this causes flickering
hilightedSubject.pipe(
  debounceTime(1000)
).subscribe((h) => {
  hilighted.value = h;
});

const hilighted = ref(false)

const hilightColor = ref('#fde047')

const hilight = (color?: string) => {
  if (color) {
    hilightColor.value = color;
  }
  hilighted.value = true;
};

const unHilight = () => {
  hilightedSubject.next(false);
};

const toggleHilight = () => {
  hilightedSubject.next(!hilightedSubject.value);
};

defineExpose({
  hilight,
  unhilight: unHilight,
  toggleHilight
})

</script>

<style scoped>
.hilighted {
  background-color: v-bind('hilightColor')
}
</style>