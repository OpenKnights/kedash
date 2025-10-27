/* eslint-disable no-console */
import { getQueryParams } from '../../src/other'

const url1 =
  'https://claude.ai/chat/629b996e-087b-4798-95d3-e65ade665071?name=2323'

const urlQuery1 = getQueryParams(['name'], { url: url1 })
console.log(`🚀 ~ urlQuery1:`, urlQuery1)
