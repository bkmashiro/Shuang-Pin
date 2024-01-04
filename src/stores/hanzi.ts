import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import cnchar from 'cnchar'
import { timer } from 'rxjs'
import type CharacterProvider from '../resources/provider'
import { SampleTextProvider } from '@/resources/TextParser'
import { tengwanggexu } from '@/resources/samples/teng-wang-ge-xu'

export class Hanzi {
  character: string
  pinyin?: string
  toned?: string
  shengmu?: string
  yunmu?: string
  tone?: number
  error = true

  constructor(character: string) {
    this.character = character
    this.init()
  }

  init() {
    if (!this.character) {
      this.pinyin = ''
      this.toned = ''
      return
    }
    try {
      this.pinyin = (cnchar.spell(this.character, 'array', 'tone', 'flat') as any[])[0]
      this.toned = (cnchar.spell(this.character, 'array', 'tone') as any[])[0]
    } catch {
      this.pinyin = ''
      this.toned = ''
      return
    }

    const [shengmu, yunmu, tone] = splitPinyinDeep(this.pinyin!)
    this.shengmu = shengmu
    this.yunmu = yunmu
    this.tone = tone
    this.error = false
  }

  static ERROR = new Hanzi('')
}

function getPinyin(char: string) {
  char = char.trim().charAt(0)
  const pinyin = (cnchar.spell(char, 'array', 'tone', 'flat') as any[])[0]
  const toned = (cnchar.spell(char, 'array', 'tone') as any[])[0]
  const [shengmu, yunmu, tone] = splitPinyinDeep(pinyin)
  return [shengmu, yunmu, toned, tone]
}

export const useHanziStore = defineStore('hanzi', () => {
  const provider: CharacterProvider = new SampleTextProvider(tengwanggexu)

  const currentChar = ref<Hanzi>(provider.getCharacter())

  const next = () => {
    currentChar.value = provider.getCharacter()
  }

  const userInput = ref('')

  const currentPinyin = computed(() => {
    const [s, y, f, t] = getPinyin(currentChar.value.character)
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
      next()
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
    next,
  }
})

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
