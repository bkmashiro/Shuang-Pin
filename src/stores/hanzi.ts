import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import cnchar from 'cnchar'
import { timer } from 'rxjs'

export class Hanzi {
  character: string
  pinyin: string
  toned: string
  shengmu: string
  yunmu: string
  tone: number

  constructor(character: string) {
    this.character = character
    this.pinyin = (cnchar.spell(character, 'array', 'tone', 'flat') as any[])[0]
    this.toned = (cnchar.spell(character, 'array', 'tone') as any[])[0]

    const [shengmu, yunmu, tone] = splitPinyinDeep(this.pinyin)
    this.shengmu = shengmu
    this.yunmu = yunmu
    this.tone = tone
  }
}

function getPinyin(char: string) {
  char = char.trim().charAt(0)
  const pinyin = (cnchar.spell(char, 'array', 'tone', 'flat') as any[])[0]
  const toned = (cnchar.spell(char, 'array', 'tone') as any[])[0]
  const [shengmu, yunmu, tone] = splitPinyinDeep(pinyin)
  return [shengmu, yunmu, toned, tone]
}

export const useHanziStore = defineStore('hanzi', () => {
  const currentChar = ref('重')
  const userInput = ref('')
  const currentPinyin = computed(() => {

    const [s,y,f,t] = getPinyin(currentChar.value)
    return {
      shengmu: s,
      yunmu: y,
      full: f,
      tone: t,  
    }
  })

  const hilights = ref([])

  const hilightables = new Map<string, any>()

  const registerHilightable = (identifier: string, operations) => {
    hilightables.set(identifier, operations)
  }

  const unRegisterHilightable = (identifier: string) => {
    hilightables.delete(identifier)
  }

  const getIdentifier = (type: 'main' | 'sub' | 'bottom', content: string) => {
    if (!content) {
      return ''
    }
    return `${type}-${content}`
  }

  const hilight = (identifier: string, timeout: number = 1000) => {
    const operations = hilightables.get(identifier)
    if (operations) {
      operations.hilight()

      // 使用 timer 替代 setTimeout，返回一个 Observable
      timer(timeout).subscribe(() => {
        operations.unHilight()
      })
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event

    if (key === 'Backspace') {
      userInput.value = userInput.value.slice(0, -1)
      return
    }

    if (key === 'Enter') {
      userInput.value = ''
      return
    }

    if (key.length > 1) {
      return
    }

    if ('abcdefghijklmnopqrstuvwxyz'.includes(key.toLowerCase())) {
      if (userInput.value.length === 2) {
        userInput.value = ''        
      }
      const identifier = getIdentifier('main', key.toUpperCase())
      hilight(identifier)
      userInput.value += key

      
    }
  }

  return {
    currentChar,
    userInput,
    currentPinyin,
    hilights,
    registerHilightable,
    unRegisterHilightable,
    getIdentifier,
    handleKeyDown,
    
  }
})

function splitPinyin(pinyin): [string, number] {
  const tone = parseInt(pinyin[pinyin.length - 1])
  const initial = pinyin.slice(0, -1)
  return [initial, tone]
}

export function splitPinyinDeep(pinyin: string): [string, string, number] {
  pinyin = pinyin.trim().toLowerCase()
  const pinyinRegex =
    /^([bpmfdtnlgkhjqxrzcsyw]?(zh|ch|sh)?)([aeiouv]?n?g?r?)([1-5])$/i
  const match = pinyin.match(pinyinRegex)
  if (!match) {
    return ['', '', 0]
  }

  const tone = parseInt(pinyin[pinyin.length - 1])
  const initial = pinyin.slice(0, -1)
  const shengmu = getShengmu(initial)
  const yunmu = getYunmu(initial)

  return [shengmu, yunmu, tone]
}

function getShengmu(pinyin) {
  var shengmuRegex = /^[bpmfdtnlgkhjqxrzcsyw]+(zh|ch|sh)?/i
  var shengmu = pinyin.match(shengmuRegex)

  if (shengmu) {
    return shengmu[0]
  } else {
    return ''
  }
}

function getYunmu(pinyin) {
  var yunmuRegex = /[aeiouv]?n?g?r?$/i
  var yunmu = pinyin.match(yunmuRegex)

  if (yunmu) {
    return yunmu[0]
  } else {
    return ''
  }
}
