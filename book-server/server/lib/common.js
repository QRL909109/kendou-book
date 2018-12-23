
export function isNumber(num) {
  return typeof num === 'number' && !isNaN(num)
}

export default {
  isNumber
}