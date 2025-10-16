# Kedash

> A lightweight, fully typed TypeScript utility library that provides essential functions for working with arrays, objects, strings, dates, and async operations.

[![npm version](https://img.shields.io/npm/v/kedash.svg)](https://www.npmjs.com/package/kedash)
[![npm downloads](https://img.shields.io/npm/dm/kedash.svg)](https://www.npmjs.com/package/kedash)
[![bundle size](https://img.shields.io/bundlephobia/minzip/kedash.svg)](https://bundlephobia.com/package/kedash)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](README.md) | [简体中文](README_zh.md)

## ✨ Features

- 🎯 **Fully Typed** - Written in TypeScript with comprehensive type definitions
- 🪶 **Lightweight** - Zero dependencies, tree-shakeable
- 🚀 **Modern** - ES6+ syntax, supports ESM
- 🛡️ **Reliable** - Well-tested utility functions
- 📦 **Modular** - Import only what you need

## 📦 Installation

```bash
npm install kedash
```

```bash
pnpm add kedash
```

```bash
yarn add kedash
```

## 🚀 Quick Start

```typescript
import { debounce, deepClone, formatDate, group } from 'kedash'

// Group array items
const users = [
  { name: 'John', role: 'admin' },
  { name: 'Jane', role: 'user' },
  { name: 'Bob', role: 'admin' }
]
const grouped = group(users, (user) => user.role)
// { admin: [{...}, {...}], user: [{...}] }

// Debounce function
const search = debounce((query: string) => {
  console.log('Searching:', query)
}, 300)

// Format dates
formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
// "2025-10-14 15:30:45"

// Deep clone objects
const cloned = deepClone({ nested: { data: [1, 2, 3] } })
```

## 📚 API Documentation

### Array

#### `group<T, Key>(array, getGroupId)`

Groups array items by a key function.

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

Sorts an array without modifying the original.

```typescript
const numbers = [3, 1, 4, 1, 5]
sort(numbers, 'ASC', (x) => x) // [1, 1, 3, 4, 5]
sort(numbers, 'DESC', (x) => x) // [5, 4, 3, 1, 1]
```

#### `bubblingSort<T>(array, type?, getter)`

Bubble sort implementation.

```typescript
const arr = [64, 34, 25, 12, 22]
bubblingSort(arr, 'ASC') // [12, 22, 25, 34, 64]
```

#### `iterate<T>(count, func, initValue)`

Iterates a function N times with accumulator.

```typescript
iterate(5, (acc, i) => acc + i, 0) // 15 (1+2+3+4+5)
```

---

### Async

#### `sleep(milliseconds)`

Async delay utility.

```typescript
await sleep(1000) // Wait 1 second
console.log('Done!')
```

#### `tryit<Args, Return>(func)`

Error-first callback style wrapper for sync/async functions.

```typescript
const safeFunc = tryit(async (id: number) => {
  const data = await fetchUser(id)
  return data
})

const [error, result] = await safeFunc(123)
if (error) {
  console.error('Failed:', error)
} else {
  console.log('Success:', result)
}
```

---

### Function Utilities

#### `debounce<T>(callback, delay?, immediate?)`

Debounces a function with optional immediate execution.

```typescript
const debouncedSearch = debounce((query: string) => {
  api.search(query)
}, 300)

// Cancel debounced function
debouncedSearch.cancel()
```

#### `throttle<T>(callback, interval, options?)`

Throttles a function with leading/trailing options.

```typescript
const throttledScroll = throttle(
  () => {
    console.log('Scroll event')
  },
  100,
  { leading: true, trailing: false }
)

// Cancel throttled function
throttledScroll.cancel()
```

#### `currying(fn)`

Converts a function to curried version.

```typescript
const add = (a: number, b: number, c: number) => a + b + c
const curriedAdd = currying(add)

curriedAdd(1)(2)(3) // 6
curriedAdd(1, 2)(3) // 6
curriedAdd(1)(2, 3) // 6
```

#### `compose(...fns)`

Composes multiple functions from left to right.

```typescript
const addOne = (x: number) => x + 1
const double = (x: number) => x * 2
const composed = compose(addOne, double)

composed(5) // (5 + 1) * 2 = 12
```

---

### Date

#### `formatDate(date, format?, options?)`

Formats dates with customizable patterns and locale support.

**Parameters:**

- `date`: `string | number | Date` - The date to format
- `format`: `string | null` - Format pattern (default: `'yyyy-MM-dd HH:mm:ss'`)
  - Pass `null` or empty string to get the formatted value object
- `options`: `FormatDateOptions` (optional)
  - `weekNames`: `'zh' | 'en' | WeekNamesRecord` - Week name locale or custom week names (default: `'zh'`)

**Available Patterns:**

- `yyyy` - Full year (2025)
- `MM` - Month (01-12)
- `dd` - Day (01-31)
- `HH` - Hours (00-23)
- `mm` - Minutes (00-59)
- `ss` - Seconds (00-59)
- `WK` - Day of week (locale-dependent)

```typescript
const date = new Date('2025-10-14 15:30:45')

/* ===== Basic Usage ===== */

// Default format (Chinese week names)
formatDate(date) // "2025-10-14 15:30:45"

// Custom format
formatDate(date, 'yyyy/MM/dd') // "2025/10/14"
formatDate(date, 'yyyy年MM月dd日') // "2025年10月14日"
formatDate(date, 'HH:mm:ss') // "15:30:45"

/* ===== Week Names Support ===== */

// Chinese week names (default)
formatDate(date, 'yyyy-MM-dd 星期WK')
// "2025-10-14 星期二"

// English week names
formatDate(date, 'yyyy-MM-dd WK', { weekNames: 'en' })
// "2025-10-14 Tuesday"

// Custom week names
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
// "2025-10-14 Tue"

/* ===== Get Formatted Value Object ===== */

// Chinese week names
const values = formatDate(date, null)
// {
//   year: "2025",
//   month: "10",
//   day: "14",
//   hours: "15",
//   minutes: "30",
//   seconds: "45",
//   week: "二",      // Tuesday in Chinese
//   weekNum: 2       // Day of week number (0-6)
// }

// English week names
const valuesEn = formatDate(date, null, { weekNames: 'en' })
// {
//   ...
//   week: "Tuesday",
//   weekNum: 2
// }

// Use destructuring
const { year, month, day, weekNum } = formatDate(date, null)
const customFormat = `${year}-${month}-${day} (Day ${weekNum})`
// "2025-10-14 (Day 2)"
```

---

### Object

#### `deepClone<T>(source, hash?)`

Deep clones objects, arrays, Map, Set, and handles circular references.

```typescript
const original = {
  name: 'John',
  nested: { age: 30 },
  hobbies: ['reading', 'coding'],
  metadata: new Map([['key', 'value']])
}

const cloned = deepClone(original)
cloned.nested.age = 31 // Original unchanged
```

**Supports:**

- Primitive types
- Objects and arrays
- Map and Set
- Symbol keys
- Circular references

#### `shallowClone<T>(obj)`

Creates a shallow copy of a value.

```typescript
const obj = { a: 1, b: { c: 2 } }
const shallow = shallowClone(obj)
shallow.a = 99 // Original unchanged
shallow.b.c = 99 // Original CHANGED (shallow copy)
```

---

### String

#### `insertAt(source, position, text)`

Inserts text at a specified position.

```typescript
insertAt('Hello World', 5, ',') // "Hello, World"
insertAt('Hello', -1, '!') // "Hell!o"
```

#### `transformCase(source, separators?, caseRules?)`

Transforms string case with custom rules.

```typescript
// CamelCase
transformCase('hello world', [' ', ''], ['lower', 'upper'])
// "helloWorld"

// PascalCase
transformCase('hello world', [' ', ''], ['upper', 'upper'])
// "HelloWorld"

// kebab-case
transformCase('Hello World', [' ', '-'], ['lower', 'lower'])
// "hello-world"
```

---

### Type Checking

#### `isType(type, target)`

Checks if a value is of specified type.

```typescript
isType('string', 'hello') // true
isType('array', [1, 2, 3]) // true
isType('map', new Map()) // true
```

#### `getType<T>(target)`

Gets the exact type name.

```typescript
getType('hello') // "string"
getType([1, 2, 3]) // "array"
getType(new Map()) // "map"
getType(null) // "null"
```

#### Type Guards

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

### Other Utilities

#### `setSerialInterval(execute, delay?, immediate?)`

Serial interval that waits for previous execution to complete.

```typescript
const timer = setSerialInterval(async () => {
  await someAsyncTask()
  console.log('Task completed')
}, 1000)

// Cancel timer
timer.cancel()
```

**Difference from setInterval:**

- `setInterval`: Triggers every X ms (regardless of completion)
- `setSerialInterval`: Waits for completion, then waits X ms

#### `random(min, max)`

Generates random integer between min and max (inclusive).

```typescript
random(1, 10) // Random number between 1-10
random(0, 100) // Random number between 0-100
```

#### `uid(length, specials?)`

Generates unique ID string.

```typescript
uid(8) // "aB3kL9mQ"
uid(16, '!@#') // "aB3!kL9@mQ#xY2z"
```

#### `toQueryString(params)`

Converts object to URL query string.

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

### Number

#### `toFloat<T>(value, defaultValue?)`

Safely converts to float with default value.

```typescript
toFloat('3.14') // 3.14
toFloat('invalid', 0.0) // 0.0
toFloat(null, null) // null
```

#### `toInt<T>(value, defaultValue?)`

Safely converts to integer with default value.

```typescript
toInt('42') // 42
toInt('invalid', 0) // 0
toInt(null, null) // null
```

#### `padNumber(value)`

Pads number to two digits.

```typescript
padNumber(5) // "05"
padNumber(12) // "12"
```

---

## 🎯 Use Cases

### Form Validation with Debounce

```typescript
import { debounce, isEmpty } from 'kedash'

const validateEmail = debounce(async (email: string) => {
  if (isEmpty(email)) return
  const isValid = await api.validateEmail(email)
  showValidationMessage(isValid)
}, 500)
```

### Data Grouping and Sorting

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

### Safe API Calls

```typescript
import { sleep, tryit } from 'kedash'

const fetchWithRetry = async (url: string, retries = 3) => {
  const safeFetch = tryit(fetch)

  for (let i = 0; i < retries; i++) {
    const [error, response] = await safeFetch(url)
    if (!error) return response
    await sleep(1000 * (i + 1)) // Exponential backoff
  }

  throw new Error('Max retries reached')
}
```

### Complex Object Cloning

```typescript
import { deepClone } from 'kedash'

const state = {
  user: { id: 1, profile: { name: 'John' } },
  settings: new Map([['theme', 'dark']]),
  history: new Set(['/home', '/about'])
}

const newState = deepClone(state)
// Fully independent copy with all nested structures
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[MIT License](LICENSE) © OpenKnights Contributors

## 🔗 Links

- [GitHub Repository](https://github.com/coderking3/kedash)
- [NPM Package](https://www.npmjs.com/package/kedash)
- [Issues](https://github.com/coderking3/kedash/issues)
