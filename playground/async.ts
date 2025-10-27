/* eslint-disable no-console */
import { tryit } from '../src'

const [err, result] = tryit(JSON.parse)('vra') as [Error?, any?]

console.log(`🚀 ~ [err, result]:`, [err, result])
