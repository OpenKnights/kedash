/* eslint-disable no-useless-escape */
/* eslint-disable no-console */
// pnpm play -f other/try-json
import { tryParse } from '../../src/other'

const strObj = `{\"userInfo\":{\"name\":\"king3\",\"age\":18,\"sex\":\"male\"},\"isAdmix\":\"false\"}`
console.log(`🚀 ~ strObj:`, strObj)

const parseObj = tryParse(strObj)
console.log(`🚀 ~ parseObj:`, parseObj, '\n')
