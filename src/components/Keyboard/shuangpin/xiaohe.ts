import { useShuangpin } from '../layouts/base'
import qwerty from '../layouts/qwerty'

export default useShuangpin(
  {
    q: 'iu',
    w: 'ei',
    r: 'uan',
    t: üify(['ue', 've']),
    y: 'un',
    o: ['uo'],
    p: 'ie',
    s: ['ong', 'iong'],
    d: 'ai',
    f: 'en',
    g: 'eng',
    h: 'ang',
    j: 'an',
    k: ['uai', 'ing'],
    l: ['uang', 'iang'],
    z: 'ou',
    x: ['ia', 'ua'],
    c: 'ao',
    v: üify(['ui', 'v']),
    b: 'in',
    n: 'iao',
    m: 'ian',
  },
  {
    u: 'sh',
    i: 'ch',
    v: 'zh',
  },
  qwerty
)

function üify(arr: string[] | string) {
  if (Array.isArray(arr)) {
    return arr.map((str) => str.replace('v', 'ü'))
  } else {
    return arr.replace('v', 'ü')
  }
}
