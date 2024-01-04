import { KeyCap } from '../keycap'

export function generateLayout(...lines: string[]): KeyCap[][] {
  return lines.map((line) => line.split('').map((char) => ({ main: char })))
}

export function Capitalize(caps: KeyCap[][], ...keys: (keyof KeyCap)[]) {
  caps.forEach((line) =>
    line.forEach((cap) => {
      keys.forEach((key) => {
        if (cap[key]) {
          cap[key] = cap[key]!.toUpperCase()
        }
      })
    })
  )

  return caps
}

// find the main key in the layout, and replace it with the value in the map
export function useMapping(
  map: Map<string, string>,
  src: keyof KeyCap,
  dest: keyof KeyCap,
  layout: KeyCap[][]
) {
  return layout.map((line) =>
    line.map((cap) => {
      if (cap[src] && map.has(cap[src] as string)) {
        cap[dest] = map.get(cap[src] as string)
      }
      return cap
    })
  )
}

type MapObject<K> = {
  [key: string]: K
}

export function useShuangpin(
  sounding: MapObject<string[] | string>,
  rhyming: MapObject<string[] | string>,
  layout: KeyCap[][]
) {
  const normalize = (arr: string[] | string) => {
    if (Array.isArray(arr)) {
      return arr.join(' ')
    } else {
      return arr
    }
  }
  const soundingMap = new Map(
    Object.entries(sounding).map(([key, value]) => [key, normalize(value)])
  )
  const rhymingMap = new Map(
    Object.entries(rhyming).map(([key, value]) => [key, normalize(value)])
  )

  useMapping(soundingMap, 'main', 'bottom', layout)
  useMapping(rhymingMap, 'main', 'sub', layout)
  // console.log(layout)
  return layout
}
