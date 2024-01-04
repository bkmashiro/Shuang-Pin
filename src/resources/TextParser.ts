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
  '（',
  '）'
]

function isHanzi(char: string): boolean {
  return char >= '\u4e00' && char <= '\u9fa5'
}

export class SampleTextProvider implements CharacterProvider {
  private textBank: string = ''
  private cachedChars: Map<string, Hanzi> = new Map()
  private MAX_RETRY = 10

  constructor(textSrc: string) {
    this.textBank = textSrc
    this.init()
  }

  init() {
    
  }

  getCharacter(): Hanzi {
    for (let retry = 0; retry < this.MAX_RETRY; retry++) {
      // try pick a random character
      const pos = Math.floor(Math.random() * this.len)
      const char = this.textBank.charAt(pos)
      if (isHanzi(char) && !stopWord.includes(char)) {
        if (this.cachedChars.has(char)) {
          return this.cachedChars.get(char)!
        }

        const hanzi = new Hanzi(char)
        if (hanzi.error) {
          continue
        }

        this.cachedChars.set(char, hanzi)
        
        return hanzi
      }
    }
    return Hanzi.ERROR
  }

  
  public get len() : number {
    return this.textBank.length
  }
  
}
