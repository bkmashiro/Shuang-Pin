import { Hanzi } from '@/stores/hanzi'
import type CharacterProvider from './provider'

const stopWord = [
  ' ',
  ',',
  '.',
  '。',
  '!',
  '“',
  '”',
  '‘',
  '’',
  '，',
  '；',
  '！',
]

function isHanzi(char: string): boolean {
  return char >= '\u4e00' && char <= '\u9fa5'
}

export class FromTextProvider implements CharacterProvider {
  private textBank: string[] = []
  private cachedChars: Hanzi[] = []

  constructor(textBank: string[]) {
    this.textBank = textBank
  }

  async init(): Promise<void> {
    this.cachedChars = (
      await Promise.all(this.textBank.map(this.parseText))
    ).flat()
  }

  async parseText(text: string): Promise<Hanzi[]> {
    return text.split('').filter((char) => !stopWord.includes(char)).map((char) => new Hanzi(char))
  }

  getCharacter(): Hanzi {
    // return random character
    return this.cachedChars[Math.floor(Math.random() * this.cachedChars.length)]
  }
}
