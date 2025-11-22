/* eslint-disable no-useless-escape */
/* eslint-disable no-console */
import type { TransformOptions } from '../src/types'

// pnpm play -f object
import { createTransformer, transformObjectValues } from '../src/object'
import { tryParse } from '../src/other'

// const strObj = `{\"wallet\":{\"balance\":\"2768420.63\"}}`
const strObj = `{\"userInfo\":{\"name\":\"king3\",\"age\":\"18\",\"sex\":\"male\"},\"isAdmix\":\"false\",\"wallet\":{\"balance\":\"2768420.63¥\"}}`
console.log(`🚀 ~ strObj:`, strObj)

const parseObj = tryParse(strObj)
console.log(`🚀 ~ parseObj:`, parseObj, '\n')

interface objInput {
  userInfo: { name: string; age: string; sex: string }
  isAdmix: string
  wallet: { balance: string }
}
interface objOutput {
  userInfo: { name: string; age: number; sex: string }
  isAdmix: boolean
  wallet: { balance: '2,768,420.63¥' }
}

const transformArgs: [objInput, TransformOptions] = [
  parseObj,
  {
    deep: true,
    parseNumbers: true,
    transformer: createTransformer({
      balance: (val: string) => {
        const balance = Number(val.slice(0, -1))
        return `${balance.toLocaleString()}¥`
      }
    })
  }
]

const transformObj = transformObjectValues<objInput, objOutput>(
  ...transformArgs
)

const {
  wallet: { balance },
  isAdmix
} = transformObj

console.log(`🚀 ~ transformObj:`, transformObj)
console.log(`🚀 ~ balance:`, balance)
console.log(`🚀 ~ balance === '2,768,420.63¥':`, balance === '2,768,420.63¥')
console.log(`🚀 ~ isAdmix:`, isAdmix)
