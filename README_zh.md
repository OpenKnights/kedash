# Kedash

> 一个轻量级、完全类型化的 TypeScript 工具库，提供用于处理数组、对象、字符串、日期和异步操作的核心函数。

[![npm version](https://img.shields.io/npm/v/kedash.svg)](https://www.npmjs.com/package/kedash)
[![npm downloads](https://img.shields.io/npm/dm/kedash.svg)](https://www.npmjs.com/package/kedash)
[![bundle size](https://img.shields.io/bundlephobia/minzip/kedash.svg)](https://bundlephobia.com/package/kedash)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](README.md) | [简体中文](README_zh.md)

## ✨ 特性

- 🎯 **完全类型化** - 使用 TypeScript 编写，具有完整的类型定义
- 🪶 **轻量级** - 零依赖，支持 tree-shaking
- 🚀 **现代化** - ES6+ 语法，支持 ESM
- 🛡️ **可靠** - 经过充分测试的工具函数
- 📦 **模块化** - 按需导入

## 📦 安装

```bash
npm install kedash
```

```bash
pnpm add kedash
```

```bash
yarn add kedash
```

## 🚀 快速开始

```typescript
import { debounce, deepClone, formatDate, group } from 'kedash'

// 数组分组
const users = [
  { name: 'John', role: 'admin' },
  { name: 'Jane', role: 'user' },
  { name: 'Bob', role: 'admin' }
]
const grouped = group(users, (user) => user.role)
// 结果: { admin: [{...}, {...}], user: [{...}] }

// 防抖函数
const search = debounce((query: string) => {
  console.log('Searching:', query)
}, 300)

// 格式化日期
formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
// 结果: "2024-03-15 15:30:45"

// 深度克隆对象
const cloned = deepClone({ nested: { data: [1, 2, 3] } })
```

## 📚 API 文档

### 数组

#### `group<T, Key>(array, getGroupId)`

将数组元素分组。返回值是一个映射，其中键是 getGroupId 函数生成的分组 ID，值是该组中每个元素的数组。

```typescript
const users = [
  { name: 'John', role: 'admin' },
  { name: 'Jane', role: 'user' },
  { name: 'Bob', role: 'admin' }
]
const grouped = group(users, (user) => user.role)
// 结果: { admin: [...], user: [...] }
```

#### `sort<T>(array, type?, getter)`

对数组排序而不修改原数组，返回新排序后的数组。

```typescript
const numbers = [3, 1, 4, 1, 5]
sort(numbers, 'ASC', (x) => x) // [1, 1, 3, 4, 5]
sort(numbers, 'DESC', (x) => x) // [5, 4, 3, 1, 1]
```

#### `bubblingSort<T>(array, type?, getter)`

使用冒泡排序算法对数组排序，不修改原数组。返回新排序后的数组。使用优化版本，如果没有发生交换则提前停止。

```typescript
const numbers = [64, 34, 25, 12, 22, 11, 90]
const sorted = bubblingSort(numbers)
// 结果: [11, 12, 22, 25, 34, 64, 90]

const products = [{ price: 100 }, { price: 50 }, { price: 75 }]
const sorted = bubblingSort(products, 'DESC', (p) => p.price)
// 结果: [{price: 100}, {price: 75}, {price: 50}]
```

#### `iterate<T>(count, func, initValue)`

使用累加器迭代函数 N 次。

```typescript
// 计算 5 的阶乘
const factorial = iterate(5, (acc, i) => acc * i, 1)
// 结果: 120

// 构建字符串
const result = iterate(3, (str, i) => str + i, '')
// 结果: "123"

// 生成平方数数组
const squares = iterate(5, (arr, i) => [...arr, i * i], [] as number[])
// 结果: [1, 4, 9, 16, 25]
```

---

### 异步

#### `sleep(milliseconds)`

异步延迟工具。

```typescript
// 等待 1 秒
await sleep(1000)
console.log('已过去 1 秒')

// 在循环中使用延迟
for (let i = 0; i < 5; i++) {
  console.log(i)
  await sleep(500) // 每次迭代之间等待 500ms
}

// 限制 API 调用频率
async function fetchWithDelay(url: string) {
  const response = await fetch(url)
  await sleep(1000) // 下次调用前等待 1 秒
  return response.json()
}
```

#### `tryit<Args, Return>(func)`

错误优先回调风格的同步/异步函数包装器。

```typescript
// 同步函数
const safeParse = tryit((str: string) => JSON.parse(str))

const [err, result] = safeParse('{"valid": "json"}')
if (err) {
  console.error('解析失败:', err)
} else {
  console.log('解析结果:', result) // { valid: 'json' }
}

// 异步函数
const safeFetch = tryit(async (url: string) => {
  const response = await fetch(url)
  return response.json()
})

const [err, data] = await safeFetch('https://api.example.com/data')
if (err) {
  console.error('请求失败:', err)
  return
}
console.log('数据:', data)

// 避免嵌套 try-catch 块
const safeReadFile = tryit(async (path: string) => {
  return await fs.readFile(path, 'utf-8')
})

const safeWriteFile = tryit(async (path: string, content: string) => {
  return await fs.writeFile(path, content)
})

// 无需 try-catch 的清晰错误处理
const [readErr, content] = await safeReadFile('input.txt')
if (readErr) return console.error('读取失败:', readErr)

const [writeErr] = await safeWriteFile('output.txt', content.toUpperCase())
if (writeErr) return console.error('写入失败:', writeErr)

console.log('成功!')
```

---

### 函数工具

#### `debounce<T>(callback, delay?, immediate?)`

带可选立即执行的防抖函数。

```typescript
const searchAPI = (query: string) => fetch(`/api/search?q=${query}`)
const debouncedSearch = debounce(searchAPI, 300)

// 只有 300ms 内的最后一次调用会执行
debouncedSearch('a')
debouncedSearch('ab')
debouncedSearch('abc') // 只有这个会在 300ms 后执行

// 使用立即执行标志
const saveData = (data: any) => console.log('保存:', data)
const immediateSave = debounce(saveData, 1000, true)

immediateSave('first') // 立即执行
immediateSave('second') // 被忽略（在 1000ms 内）

// 使用取消功能
const debouncedFn = debounce(() => console.log('executed'), 1000)
debouncedFn()
debouncedFn.cancel() // 取消待执行的调用
```

#### `throttle<T>(callback, interval, options?)`

带前缘/后缘选项的节流函数。

```typescript
const handleScroll = () => console.log('滚动中...')
const throttledScroll = throttle(handleScroll, 1000)

window.addEventListener('scroll', throttledScroll)
// handleScroll 每秒最多被调用一次

// 使用后缘执行
const updatePosition = (x: number, y: number) => console.log(x, y)
const throttledUpdate = throttle(updatePosition, 500, { trailing: true })

throttledUpdate(1, 1) // 立即执行
throttledUpdate(2, 2) // 被忽略
throttledUpdate(3, 3) // 500ms 后执行（后缘）

// 不使用前缘执行
const logEvent = () => console.log('事件已记录')
const throttledLog = throttle(logEvent, 1000, {
  leading: false,
  trailing: true
})

throttledLog() // 不会立即执行，会等待 1000ms

// 使用取消功能
const throttledFn = throttle(() => console.log('executed'), 1000)
throttledFn()
throttledFn.cancel() // 取消任何待执行的调用
```

#### `currying(fn)`

将函数转换为柯里化版本。

```typescript
const add = (a: number, b: number, c: number) => a + b + c
const curriedAdd = currying(add)

curriedAdd(1)(2)(3) // 6
curriedAdd(1, 2)(3) // 6
curriedAdd(1)(2, 3) // 6
```

#### `compose(...fns)`

从左到右组合多个函数。

```typescript
const add5 = (x: number) => x + 5
const multiply2 = (x: number) => x * 2
const subtract3 = (x: number) => x - 3

const composed = compose(add5, multiply2, subtract3)
composed(10)
// 结果: ((10 + 5) * 2) - 3 = 27

const toUpperCase = (str: string) => str.toUpperCase()
const addExclamation = (str: string) => str + '!'
const greet = (name: string) => `Hello, ${name}`

const pipeline = compose(greet, toUpperCase, addExclamation)
pipeline('world')
// 结果: "HELLO, WORLD!"
```

---

### 日期

#### `formatDate(date, format?, options?)`

使用可自定义模式和区域设置支持格式化日期。

**参数:**

- `date`: `string | number | Date` - 要格式化的日期
- `format`: `string | null` - 格式化模式（默认: `'yyyy-MM-dd HH:mm:ss'`）
  - 传递 `null` 或空字符串以获取格式化值对象
- `options`: `FormatDateOptions`（可选）
  - `weekNames`: `'zh' | 'en' | WeekNamesRecord` - 星期名称区域设置或自定义星期名称（默认: `'zh'`）

**可用模式:**

- `yyyy` - 完整年份（2024）
- `MM` - 月份（01-12）
- `dd` - 日期（01-31）
- `HH` - 小时（00-23）
- `mm` - 分钟（00-59）
- `ss` - 秒（00-59）
- `WK` - 星期几（取决于区域设置）

```typescript
const date = new Date('2024-03-15 15:30:45')

/* ===== 基本用法 ===== */

// 默认格式（中文星期名称）
formatDate(date)
// "2024-03-15 15:30:45"

// 自定义格式
formatDate(date, 'yyyy/MM/dd')
// "2024/03/15"

formatDate(date, 'yyyy年MM月dd日')
// "2024年03月15日"

formatDate(date, 'HH:mm:ss')
// "15:30:45"

/* ===== 星期名称支持 ===== */

// 中文星期名称（默认）
formatDate(date, 'yyyy-MM-dd 星期WK')
// "2024-03-15 星期五"

// 英文星期名称
formatDate(date, 'yyyy-MM-dd WK', { weekNames: 'en' })
// "2024-03-15 Friday"

// 自定义星期名称
formatDate(date, 'yyyy-MM-dd WK', {
  weekNames: {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat'
  }
})
// "2024-03-15 Fri"

/* ===== 获取格式化值对象 ===== */

// 中文星期名称
const values = formatDate(date, null)
// {
//   year: "2024",
//   month: "03",
//   day: "15",
//   hours: "15",
//   minutes: "30",
//   seconds: "45",
//   week: "五",      // 星期五
//   weekNum: 5       // 星期数字（0=星期日，6=星期六）
// }

// 英文星期名称
const valuesEn = formatDate(date, null, { weekNames: 'en' })
// {
//   ...
//   week: "Friday",
//   weekNum: 5
// }

// 使用解构
const { year, month, day, weekNum } = formatDate(date, null)
const customFormat = `${year}-${month}-${day} (第 ${weekNum} 天)`
// "2024-03-15 (第 5 天)"
```

---

### 对象

#### `deepClone<T>(source, hash?)`

深度克隆对象、数组、Map、Set，并处理循环引用。

```typescript
const original = {
  name: 'John',
  nested: { age: 30 },
  hobbies: ['reading', 'coding'],
  metadata: new Map([['key', 'value']])
}

const cloned = deepClone(original)
cloned.nested.age = 31 // 原对象不变
```

**支持:**

- 原始类型
- 对象和数组
- Map 和 Set
- Symbol 键
- 循环引用

#### `shallowClone<T>(obj)`

创建值的浅拷贝。

```typescript
const obj = { a: 1, b: { c: 2 } }
const shallow = shallowClone(obj)
shallow.a = 99 // 原对象不变
shallow.b.c = 99 // 原对象改变（浅拷贝）
```

#### `transformObjectValues<Input, Output>(data, options?)`

将对象中的字符串值转换为适当的类型。

```typescript
// 基本布尔值和 null 转换
transformObjectValues({ active: 'true', value: 'null' })
// { active: true, value: null }

// 使用数字解析
transformObjectValues({ count: '42', price: '3.14' }, { parseNumbers: true })
// { count: 42, price: 3.14 }

// 深度转换
transformObjectValues(
  { user: { active: 'false', age: '25' } },
  { deep: true, parseNumbers: true }
)
// { user: { active: false, age: 25 } }

// 使用日期解析
transformObjectValues({ createdAt: '2024-01-01' }, { parseDates: true })
// { createdAt: Date(2024-01-01) }

// 使用自定义转换器进行格式化
transformObjectValues(
  { amount: 12302007 },
  {
    transformer: (val) => (typeof val === 'number' ? val.toLocaleString() : val)
  }
)
// { amount: "12,302,007" }

// 使用自定义逻辑的多重转换
transformObjectValues(
  { status: 'ACTIVE', count: 12302007 },
  {
    transformer: (val, key) => {
      if (typeof val === 'string') return val.toLowerCase()
      if (typeof val === 'number') return val.toLocaleString()
      return val
    }
  }
)
// { status: "active", count: "12,302,007" }

// 仅特定键（白名单模式）
transformObjectValues({ active: 'true', name: 'true' }, { keys: ['active'] })
// { active: true, name: "true" }

// 空字符串处理
transformObjectValues(
  { name: '', description: '' },
  { emptyStringToNull: true }
)
// { name: null, description: null }

// 特殊数字
transformObjectValues(
  { invalid: 'NaN', max: 'Infinity', min: '-Infinity' },
  { parseSpecialNumbers: true }
)
// { invalid: NaN, max: Infinity, min: -Infinity }

// 与 tryParse 链式使用处理数据中的 JSON 字符串
const data = { config: '{"theme":"dark"}' }
const parsed = transformObjectValues(data, {
  transformer: (val, key) => {
    if (key === 'config' && typeof val === 'string') {
      return tryParse(val, val)
    }
    return val
  }
})
// { config: { theme: "dark" } }

// 使用泛型的类型安全用法
interface User {
  name: string
  age: number
  active: boolean
}
const raw = { name: 'John', age: '30', active: 'true' }
const user = transformObjectValues<typeof raw, User>(raw, {
  parseNumbers: true
})
// user 类型为 User，具有正确的类型检查
```

**支持的智能转换:**

- "true"/"false" → boolean
- "null" → null
- "undefined" → undefined
- "42" → number（启用 parseNumbers 时）
- "2024-01-01" → Date（启用 parseDates 时）
- "" → null（启用 emptyStringToNull 时）
- "NaN"/"Infinity"/"-Infinity" → 特殊数字（启用 parseSpecialNumbers 时）

#### `createTransformer(rules)`

使用预定义规则创建自定义值转换器。

```typescript
// 基本转换器
const transformer = createTransformer({
  date: (val) => (val.match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(val) : val),
  price: (val) => (typeof val === 'string' ? Number.parseFloat(val) : val)
})

// 数字格式化转换器
const formatTransformer = createTransformer({
  amount: (val) => (typeof val === 'number' ? val.toLocaleString() : val),
  count: (val) => (typeof val === 'number' ? val.toLocaleString() : val)
})

// 通配符转换器（应用于所有键）
const trimTransformer = createTransformer({
  '*': (val) => (typeof val === 'string' ? val.trim() : val)
})

// 与 transformObjectValues 一起使用
transformObjectValues(data, { transformer })
```

---

### 字符串

#### `insertAt(source, position, text)`

在源字符串的指定位置插入字符串。支持负索引（从末尾计数），类似于 Array.slice()。

```typescript
// 在正向位置插入
insertAt('Hello World', 5, ',')
// "Hello, World"

insertAt('abcdef', 3, 'XYZ')
// "abcXYZdef"

insertAt('test', 0, 'pre-')
// "pre-test"

// 在字符串末尾插入
insertAt('Hello', 5, '!')
// "Hello!"

insertAt('test', 100, '!!!')
// "test!!!"（位置限制在字符串长度）

// 在负向位置插入（从末尾计数）
insertAt('Hello', -1, '!')
// "Hell!o"（最后一个字符之前）

insertAt('World', -2, 'l')
// "Wollrd"（从末尾数第 2 个字符之前）

insertAt('test', -10, 'pre-')
// "pre-test"（负向溢出到开始）

// 实际用例
// 添加区号到电话号码
insertAt('5551234', 0, '(555) ')
// "(555) 5551234"

// 在信用卡号中插入分隔符
let card = '1234567890123456'
card = insertAt(card, 4, '-')
card = insertAt(card, 9, '-')
card = insertAt(card, 14, '-')
// "1234-5678-9012-3456"

// 插入文件扩展名
const filename = 'document'
insertAt(filename, filename.length, '.txt')
// "document.txt"
```

#### `transformCase(source, separators?, caseRules?)`

使用自定义分隔符和大小写规则转换字符串大小写。用于在不同命名约定（camelCase、PascalCase、snake_case 等）之间转换的强大工具。

```typescript
// 转换为 PascalCase（默认行为）
transformCase('hello world')
// "HelloWorld"

transformCase('foo bar baz')
// "FooBarBaz"

// 转换为 camelCase
transformCase('hello world', [' ', ''], ['lower', 'upper'])
// "helloWorld"

transformCase('user profile settings', [' ', ''], ['lower', 'upper'])
// "userProfileSettings"

// 转换为 snake_case
transformCase('Hello World', [' ', '_'], ['lower', 'lower'])
// "hello_world"

// 转换为 kebab-case
transformCase('Hello World', [' ', '-'], ['lower', 'lower'])
// "hello-world"

transformCase('My Component Name', [' ', '-'], ['lower', 'lower'])
// "my-component-name"

// 转换为 CONSTANT_CASE
transformCase('hello world', [' ', '_'], ['upper', 'upper'])
// "HELLO_WORLD"

transformCase('api response data', [' ', '_'], ['upper', 'upper'])
// "API_RESPONSE_DATA"

// 从 snake_case 转换为 Title Case
transformCase('hello_world_example', ['_', ' '], ['upper', 'upper'])
// "Hello World Example"

transformCase('user_profile_data', ['_', ' '], ['upper', 'upper'])
// "User Profile Data"

// 从 kebab-case 转换为 camelCase
transformCase('my-component-name', ['-', ''], ['lower', 'upper'])
// "myComponentName"

transformCase('user-login-form', ['-', ''], ['lower', 'upper'])
// "userLoginForm"

// 自定义分隔符转换
transformCase('hello.world.test', ['.', '/'], ['upper', 'upper'])
// "Hello/World/Test"

transformCase('path/to/file', ['/', '.'], ['lower', 'lower'])
// "path.to.file"

// 实际用例
// API 端点到函数名
const endpoint = 'get user profile'
const fnName = transformCase(endpoint, [' ', ''], ['lower', 'upper'])
// "getUserProfile"

// 数据库列到 JavaScript 属性
const dbColumn = 'user_email_address'
const jsProperty = transformCase(dbColumn, ['_', ''], ['lower', 'upper'])
// "userEmailAddress"
```

---

### 类型检查

#### `isType(type, target)`

检查目标值是否为指定的类型名称。结合 getType 与相等性检查，方便进行类型验证。

```typescript
// 基本用法
isType('string', 'hello') // true
isType('number', 42) // true
isType('array', [1, 2, 3]) // true
isType('date', new Date()) // true

// 不匹配时返回 false
isType('string', 42) // false
isType('array', {}) // false
isType('object', []) // false

// 在验证中使用
function processArray(value: unknown) {
  if (!isType('array', value)) {
    throw new Error('期望是数组')
  }
  // value 现在已知是数组
  return value.length
}

// 使用自定义类型
isType<'map'>('map', new Map()) // true
isType<'set'>('set', new Set()) // true
```

#### `getType<T>(target)`

获取变量的确切类型名称（小写字符串）。比 typeof 更可靠，用于区分对象类型。

```typescript
// 基本类型
getType('hello') // 'string'
getType(42) // 'number'
getType(true) // 'boolean'
getType(null) // 'null'
getType(undefined) // 'undefined'

// 对象类型
getType({}) // 'object'
getType([]) // 'array'
getType(new Date()) // 'date'
getType(/regex/) // 'regexp'
getType(new Map()) // 'map'
getType(new Set()) // 'set'
getType(new WeakMap()) // 'weakmap'
getType(new Promise(() => {})) // 'promise'

// 使用自定义类型扩展
const type = getType<'customtype'>(value)
// 类型: CommonType | 'customtype'

// 在类型切换中使用
const value: unknown = [1, 2, 3]
switch (getType(value)) {
  case 'array':
    console.log('这是一个数组')
    break
  case 'object':
    console.log('这是一个对象')
    break
}
```

#### 类型守卫

```typescript
isString(value) // value is string
isNumber(value) // value is number
isInt(value) // value is integer
isFloat(value) // value is float
isBoolean(value) // value is boolean
isArray(value) // value is array
isObject(value) // value is object
isFunction(value) // value is function
isDate(value) // value is Date
isPromise(value) // value is Promise
isSymbol(value) // value is symbol
isPrimitive(value) // primitive type
isEmpty(value) // empty check
isEqual(x, y) // deep equality
```

---

### 数字

#### `toFloat<T>(value, defaultValue?)`

安全地转换为浮点数，带默认值。

```typescript
// 基本用法
toFloat('3.14') // 3.14
toFloat('42') // 42.0
toFloat(123.456) // 123.456

// 无效值（返回默认值 0.0）
toFloat('invalid') // 0.0
toFloat(null) // 0.0
toFloat(undefined) // 0.0
toFloat('') // 0.0

// 使用自定义默认值
toFloat('invalid', -1) // -1
toFloat(null, 100.5) // 100.5
toFloat(undefined, null) // null

// 解析带空格的字符串
toFloat('  3.14  ') // 3.14
toFloat('3.14abc') // 3.14（parseFloat 在第一个非数字字符处停止）

// 在数据处理中使用
const prices = ['10.99', 'invalid', '25.50', null]
const validPrices = prices.map((p) => toFloat(p, 0)).filter((p) => p > 0)
// [10.99, 25.50]
```

#### `toInt<T>(value, defaultValue?)`

安全地转换为整数，带默认值。

```typescript
// 基本用法
toInt('42') // 42
toInt('3.14') // 3（截断小数）
toInt(123.456) // 123

// 无效值（返回默认值 0）
toInt('invalid') // 0
toInt(null) // 0
toInt(undefined) // 0
toInt('') // 0

// 使用自定义默认值
toInt('invalid', -1) // -1
toInt(null, 999) // 999
toInt(undefined, null) // null

// 使用基数解析（默认为 10）
toInt('42') // 42
toInt('0x10') // 0（十六进制使用 Number.parseInt(value, 16)）

// 解析带非数字字符的字符串
toInt('42px') // 42（parseInt 在第一个非数字字符处停止）
toInt('  100  ') // 100

// 在数据验证中使用
const getUserAge = (input: any) => {
  const age = toInt(input, null)
  if (age === null || age < 0 || age > 150) {
    throw new Error('无效的年龄')
  }
  return age
}
```

#### `padNumber(value)`

将数字填充至至少两位数，必要时添加前导零。常用于格式化时间组件（小时、分钟、秒）或日期。

```typescript
// 基本用法
padNumber(5) // '05'
padNumber(12) // '12'
padNumber(0) // '00'

// 超过两位数的数字保持不变
padNumber(100) // '100'
padNumber(999) // '999'

// 在时间格式化中使用
const hours = 9
const minutes = 5
const seconds = 3
const time = `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`
// "09:05:03"

// 在日期格式化中使用
const month = 3
const day = 7
const date = `2024-${padNumber(month)}-${padNumber(day)}`
// "2024-03-07"

// 格式化数字列表
const items = [1, 5, 10, 25]
const formatted = items.map(padNumber)
// ['01', '05', '10', '25']
```

---

### 其他工具

#### `setSerialInterval(execute, delay?, immediate?)`

串行间隔，等待上一次执行完成。

```typescript
const timer = setSerialInterval(async () => {
  await someAsyncTask()
  console.log('任务完成')
}, 1000)

// 取消定时器
timer.cancel()
```

**与 setInterval 的区别:**

- `setInterval`: 每 X 毫秒触发一次（无论上一次执行是否完成）
- `setSerialInterval`: 等待上一次执行完成，然后等待 X 毫秒再执行下一次

#### `random(min, max)`

生成 min 和 max 之间的随机整数（包含边界）。

```typescript
random(1, 10) // 1-10 之间的随机数
random(0, 100) // 0-100 之间的随机数
```

#### `uid(length, specials?)`

生成唯一 ID 字符串。

```typescript
uid(8) // "aB3kL9mQ"
uid(16, '!@#') // "aB3!kL9@mQ#xY2z"
```

#### `toQueryString(params)`

将对象转换为 URL 查询字符串。

- 支持带括号表示法的嵌套对象（例如，filter[name]=value）
- 自动编码键和值以确保 URL 安全
- 跳过 null、undefined 和空字符串值

```typescript
// 简单参数
toQueryString({ name: 'John', age: 25 })
// "name=John&age=25"

// 嵌套对象参数
toQueryString({ filter: { status: 'active', type: 'user' }, page: 1 })
// "filter[status]=active&filter[type]=user&page=1"

// 跳过空值
toQueryString({ name: 'John', email: null, phone: '' })
// "name=John"
```

#### `getQueryParams(keys, options?)`

从 URL 获取查询参数。

```typescript
// 从当前 URL 获取
getQueryParams(['page', 'filter'])
// { page: '2', filter: 'active' }

// 从自定义 URL 获取
getQueryParams(['id'], { url: 'https://example.com?id=123&type=post' })
// { id: '123' }

// 获取所有查询参数
getQueryParams([], { url: 'https://example.com?id=123&type=post', all: true })
// { id: '123', type: 'post' }

// 没有参数的 URL（自动添加 ?）
getQueryParams(['id'], { url: 'https://example.com' })
// { id: undefined }
```

#### `setQueryParams(params, options?)`

在 URL 中设置或更新查询参数。

```typescript
// 修改当前 URL
setQueryParams({ page: 2, filter: 'active' })
// 当前 URL 变为: ?page=2&filter=active

// 返回修改后的自定义 URL
const newUrl = setQueryParams(
  { page: 2, filter: 'active' },
  { url: 'https://example.com/path' }
)
// "https://example.com/path?page=2&filter=active"

// 带现有参数的 URL
const newUrl = setQueryParams(
  { page: 3 },
  { url: 'https://example.com?page=1&filter=all' }
)
// "https://example.com?page=3&filter=all"

// 自定义跳过逻辑
setQueryParams(
  { tags: [], status: null },
  {
    skipNull: false,
    skipIf: (key, value) => Array.isArray(value) && value.length === 0
  }
)
```

#### `tryParse(params, options?)`

尝试解析 JSON 字符串，带回退值。

```typescript
// 基本用法
const data = tryParse<User>('{"name":"John"}', {})

// 带验证
const withValidation = tryParse('{"id":1}', null, {
  validator: (val): val is User => typeof val.id === 'number'
})

// 带错误处理
tryParse(
  'invalid json',
  {},
  {
    onError: (error, input) => console.log('解析失败:', error)
  }
)
```

---

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

## 📄 许可证

[MIT License](LICENSE) © OpenKnights Contributors

## 🔗 链接

- [GitHub 仓库](https://github.com/coderking3/kedash)
- [NPM 包](https://www.npmjs.com/package/kedash)
- [问题反馈](https://github.com/coderking3/kedash/issues)
