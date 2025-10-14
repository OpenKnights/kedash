# Kedash

> 轻量级、完全类型化的 TypeScript 工具库,提供数组、对象、字符串、日期和异步操作的基础函数。

[![npm version](https://img.shields.io/npm/v/kedash.svg)](https://www.npmjs.com/package/kedash)
[![npm downloads](https://img.shields.io/npm/dm/kedash.svg)](https://www.npmjs.com/package/kedash)
[![bundle size](https://img.shields.io/bundlephobia/minzip/kedash.svg)](https://bundlephobia.com/package/kedash)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](README.md) | [简体中文](README_zh.md)

## ✨ 特性

- 🎯 **完全类型化** - 使用 TypeScript 编写,具有完整的类型定义
- 🪶 **轻量级** - 零依赖,支持 tree-shaking
- 🚀 **现代化** - ES6+ 语法,支持 ESM
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
// { admin: [{...}, {...}], user: [{...}] }

// 防抖函数
const search = debounce((query: string) => {
  console.log('搜索:', query)
}, 300)

// 格式化日期
formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
// "2025-10-14 15:30:45"

// 深拷贝对象
const cloned = deepClone({ nested: { data: [1, 2, 3] } })
```

## 📚 API 文档

### 数组操作

#### `group<T, Key>(array, getGroupId)`

根据键函数对数组项进行分组。

```typescript
const items = [
  { category: 'fruit', name: 'apple' },
  { category: 'fruit', name: 'banana' },
  { category: 'vegetable', name: 'carrot' }
]
const result = group(items, (item) => item.category)
// { fruit: [...], vegetable: [...] }
```

#### `sort<T>(array, type?, getter)`

对数组进行排序而不修改原数组。

```typescript
const numbers = [3, 1, 4, 1, 5]
sort(numbers, 'ASC', (x) => x) // [1, 1, 3, 4, 5]
sort(numbers, 'DESC', (x) => x) // [5, 4, 3, 1, 1]
```

#### `bubblingSort<T>(array, type?, getter)`

冒泡排序实现。

```typescript
const arr = [64, 34, 25, 12, 22]
bubblingSort(arr, 'ASC') // [12, 22, 25, 34, 64]
```

#### `iterate<T>(count, func, initValue)`

使用累加器迭代函数 N 次。

```typescript
iterate(5, (acc, i) => acc + i, 0) // 15 (1+2+3+4+5)
```

---

### 异步操作

#### `sleep(milliseconds)`

异步延迟工具。

```typescript
await sleep(1000) // 等待 1 秒
console.log('完成!')
```

#### `tryit<Args, Return>(func)`

错误优先的回调风格包装器,用于同步/异步函数。

```typescript
const safeFunc = tryit(async (id: number) => {
  const data = await fetchUser(id)
  return data
})

const [error, result] = await safeFunc(123)
if (error) {
  console.error('失败:', error)
} else {
  console.log('成功:', result)
}
```

---

### 函数工具

#### `debounce<T>(callback, delay?, immediate?)`

对函数进行防抖处理,可选立即执行。

```typescript
const debouncedSearch = debounce((query: string) => {
  api.search(query)
}, 300)

// 取消防抖函数
debouncedSearch.cancel()
```

#### `throttle<T>(callback, interval, options?)`

对函数进行节流处理,支持前缘/后缘选项。

```typescript
const throttledScroll = throttle(
  () => {
    console.log('滚动事件')
  },
  100,
  { leading: true, trailing: false }
)

// 取消节流函数
throttledScroll.cancel()
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
const addOne = (x: number) => x + 1
const double = (x: number) => x * 2
const composed = compose(addOne, double)

composed(5) // (5 + 1) * 2 = 12
```

---

### 日期处理

#### `formatDate(date, format?, options?)`

使用可自定义模式格式化日期。

```typescript
const date = new Date('2025-10-14 15:30:45')

formatDate(date, 'yyyy-MM-dd') // "2025-10-14"
formatDate(date, 'yyyy年MM月dd日') // "2025年10月14日"
formatDate(date, 'HH:mm:ss') // "15:30:45"
formatDate(date, 'yyyy-MM-dd 星期W') // "2025-10-14 星期二"

// 获取格式化值对象
formatDate(date, null)
// {
//   year: "2025",
//   month: "10",
//   day: "14",
//   hours: "15",
//   minutes: "30",
//   seconds: "45",
//   week: "二",
//   weekNum: 2
// }
```

**可用模式:**

- `yyyy` - 完整年份 (2025)
- `MM` - 月份 (01-12)
- `dd` - 日期 (01-31)
- `HH` - 小时 (00-23)
- `mm` - 分钟 (00-59)
- `ss` - 秒数 (00-59)
- `W` - 星期几 (中文)

---

### 对象操作

#### `deepClone<T>(source, hash?)`

深度克隆对象、数组、Map、Set,并处理循环引用。

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

- 基本类型
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
shallow.b.c = 99 // 原对象改变(浅拷贝)
```

---

### 字符串操作

#### `insertAt(source, position, text)`

在指定位置插入文本。

```typescript
insertAt('Hello World', 5, ',') // "Hello, World"
insertAt('Hello', -1, '!') // "Hell!o"
```

#### `transformCase(source, separators?, caseRules?)`

使用自定义规则转换字符串大小写。

```typescript
// 驼峰命名
transformCase('hello world', [' ', ''], ['lower', 'upper'])
// "helloWorld"

// 帕斯卡命名
transformCase('hello world', [' ', ''], ['upper', 'upper'])
// "HelloWorld"

// 短横线命名
transformCase('Hello World', [' ', '-'], ['lower', 'lower'])
// "hello-world"
```

---

### 类型检查

#### `isType(type, target)`

检查值是否为指定类型。

```typescript
isType('string', 'hello') // true
isType('array', [1, 2, 3]) // true
isType('map', new Map()) // true
```

#### `getType<T>(target)`

获取准确的类型名称。

```typescript
getType('hello') // "string"
getType([1, 2, 3]) // "array"
getType(new Map()) // "map"
getType(null) // "null"
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
isPrimitive(value) // 基本类型
isEmpty(value) // 空值检查
isEqual(x, y) // 深度相等
```

---

### 其他工具

#### `setSerialInterval(execute, delay?, immediate?)`

串行间隔执行,等待上一次执行完成。

```typescript
const timer = setSerialInterval(async () => {
  await someAsyncTask()
  console.log('任务完成')
}, 1000)

// 取消定时器
timer.cancel()
```

**与 setInterval 的区别:**

- `setInterval`: 每 X 毫秒触发一次(无论是否完成)
- `setSerialInterval`: 等待完成后,再等待 X 毫秒

#### `random(min, max)`

生成 min 和 max 之间的随机整数(包含边界)。

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

```typescript
toQueryString({ name: 'John', age: 25 })
// "name=John&age=25"

toQueryString({
  filter: { status: 'active', type: 'user' },
  page: 1
})
// "filter[status]=active&filter[type]=user&page=1"
```

---

### 数字处理

#### `toFloat<T>(value, defaultValue?)`

安全地转换为浮点数,支持默认值。

```typescript
toFloat('3.14') // 3.14
toFloat('invalid', 0.0) // 0.0
toFloat(null, null) // null
```

#### `toInt<T>(value, defaultValue?)`

安全地转换为整数,支持默认值。

```typescript
toInt('42') // 42
toInt('invalid', 0) // 0
toInt(null, null) // null
```

#### `padNumber(value)`

将数字填充为两位数。

```typescript
padNumber(5) // "05"
padNumber(12) // "12"
```

---

## 🎯 使用场景

### 表单验证与防抖

```typescript
import { debounce, isEmpty } from 'kedash'

const validateEmail = debounce(async (email: string) => {
  if (isEmpty(email)) return
  const isValid = await api.validateEmail(email)
  showValidationMessage(isValid)
}, 500)
```

### 数据分组与排序

```typescript
import { group, sort } from 'kedash'

const orders = await fetchOrders()
const byStatus = group(orders, (order) => order.status)
const sortedPending = sort(
  byStatus.pending || [],
  'DESC',
  (order) => order.createdAt
)
```

### 安全的 API 调用

```typescript
import { sleep, tryit } from 'kedash'

const fetchWithRetry = async (url: string, retries = 3) => {
  const safeFetch = tryit(fetch)

  for (let i = 0; i < retries; i++) {
    const [error, response] = await safeFetch(url)
    if (!error) return response
    await sleep(1000 * (i + 1)) // 指数退避
  }

  throw new Error('达到最大重试次数')
}
```

### 复杂对象克隆

```typescript
import { deepClone } from 'kedash'

const state = {
  user: { id: 1, profile: { name: 'John' } },
  settings: new Map([['theme', 'dark']]),
  history: new Set(['/home', '/about'])
}

const newState = deepClone(state)
// 完全独立的副本,包含所有嵌套结构
```

## 🤝 贡献

欢迎贡献代码!请随时提交 Pull Request。

## 📄 许可证

[MIT 许可证](LICENSE) © OpenKnights 贡献者

## 🔗 链接

- [GitHub 仓库](https://github.com/coderking3/kedash)
- [NPM 包](https://www.npmjs.com/package/kedash)
- [Issues](https://github.com/coderking3/kedash/issues)
