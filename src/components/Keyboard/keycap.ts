export class KeyCap {
  main: string
  sub?: string
  bottom?: string
  [key: string]: string | undefined

  constructor(main: string, sub?: string, bottom?: string) {
    this.main = main
    this.sub = sub
    this.bottom = bottom
  }
}