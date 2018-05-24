export function pick(src, ...keys) {
  const dest = {}
  const findkeys = Object.keys(src).filter(k => keys.includes(k))
  findkeys.forEach(k => {
    dest[k] = src[k]
  })
  return dest
}
