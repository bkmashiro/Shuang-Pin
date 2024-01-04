<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHanziStore } from '@/stores/hanzi'
import Keyboard from '@/components/Keyboard/Keyboard.vue';
import KeyboardRow from '@/components/Keyboard/KeyboardRow.vue';
import xiaohe from '@/components/Keyboard/shuangpin/xiaohe';
import { Capitalize } from '../components/Keyboard/layouts/base';

const hanziStore = useHanziStore()

onMounted(() => {
  document.onkeydown = (e) => {
    hanziStore.handleKeyDown(e)
  }
})

</script>

<template>
  <div>
    <main class="flex flex-col items-center">
      <h1 class="text-2xl">Plain Shuangpin</h1>

      <div class="grid items-end justify-center grid-cols-2 justify-items-center">
        <div class="inline text-9xl">
          <div class="flex flex-col text-center">
            <p class="text-xl"> {{ hanziStore.currentPinyin.full }} </p>
            <p class="inline">{{ hanziStore.currentChar.character }}</p>
          </div>
        </div>
        <div class="inline text-9xl min-h-32 min-w-64">
          <div class="flex flex-col text-center">
            <p class="text-xl"> {{  }} </p>
            <p class="inline">&nbsp; {{ hanziStore.userInput }}</p>
          </div>
        </div>
      </div>


      <div class="mt-8">
        <div class="keyboard">
          <Keyboard :space=1>
            <template #lower>

            </template>

            <template #upper>

            </template>

            <div v-for="(row, i) in Capitalize(xiaohe, 'main')">
              <KeyboardRow :items="row" class="m-4" :margin-left="i * 2" />
            </div>
          </Keyboard>
        </div>

      </div>
    </main>
  </div>
</template>
