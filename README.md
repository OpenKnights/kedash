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
// Result: { admin: [{...}, {...}], user: [{...}] }

// Debounce function
const search = debounce((query: string) => {
  console.log('Searching:', query)
}, 300)

// Format dates
formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
// Result: "2024-03-15 15:30:45"

// Deep clone objects
const cloned = deepClone({ nested: { data: [1, 2, 3] } })
```

## 📚 API Documentation

### Array

#### `group<T, Key>(array, getGroupId)`

Sorts an array of items into groups. The return value is a map where the keys are the group ids the given getGroupId function produced and the value is an array of each item in that group.

```typescript
const users = [
  { name: 'John', role: 'admin' },
  { name: 'Jane', role: 'user' },
  { name: 'Bob', role: 'admin' }
]
const grouped = group(users, (user) => user.role)
// Result: { admin: [...], user: [...] }
```

#### `sort<T>(array, type?, getter)`

Sort an array without modifying it and return the newly sorted value.

```typescript
const numbers = [3, 1, 4, 1, 5]
sort(numbers, 'ASC', (x) => x) // [1, 1, 3, 4, 5]
sort(numbers, 'DESC', (x) => x) // [5, 4, 3, 1, 1]
```

#### `bubblingSort<T>(array, type?, getter)`

Sorts an array using the bubble sort algorithm without modifying the original array. Returns a new sorted array. Uses an optimized version that stops early if no swaps occur.

```typescript
const numbers = [64, 34, 25, 12, 22, 11, 90]
const sorted = bubblingSort(numbers)
// Result: [11, 12, 22, 25, 34, 64, 90]

const products = [{ price: 100 }, { price: 50 }, { price: 75 }]
const sorted = bubblingSort(products, 'DESC', (p) => p.price)
// Result: [{price: 100}, {price: 75}, {price: 50}]
```

#### `iterate<T>(count, func, initValue)`

Iterates a function N times with accumulator.

```typescript
// Calculate factorial of 5
const factorial = iterate(5, (acc, i) => acc * i, 1)
// Result: 120

// Build a string
const result = iterate(3, (str, i) => str + i, '')
// Result: "123"

// Generate array of squares
const squares = iterate(5, (arr, i) => [...arr, i * i], [] as number[])
// Result: [1, 4, 9, 16, 25]
```

---

### Async

#### `sleep(milliseconds)`

Async delay utility.

```typescript
// Wait 1 second
await sleep(1000)
console.log('1 second has passed')

// Use in a loop with delay
for (let i = 0; i < 5; i++) {
  console.log(i)
  await sleep(500) // Wait 500ms between iterations
}

// Rate limiting API calls
async function fetchWithDelay(url: string) {
  const response = await fetch(url)
  await sleep(1000) // Wait 1 second before next call
  return response.json()
}
```

#### `tryit<Args, Return>(func)`

Error-first callback style wrapper for sync/async functions.

```typescript
// With synchronous function
const safeParse = tryit((str: string) => JSON.parse(str))

const [err, result] = safeParse('{"valid": "json"}')
if (err) {
  console.error('Parse failed:', err)
} else {
  console.log('Parsed:', result) // { valid: 'json' }
}

// With async function
const safeFetch = tryit(async (url: string) => {
  const response = await fetch(url)
  return response.json()
})

const [err, data] = await safeFetch('https://api.example.com/data')
if (err) {
  console.error('Fetch failed:', err)
  return
}
console.log('Data:', data)

// Avoid nested try-catch blocks
const safeReadFile = tryit(async (path: string) => {
  return await fs.readFile(path, 'utf-8')
})

const safeWriteFile = tryit(async (path: string, content: string) => {
  return await fs.writeFile(path, content)
})

// Clean error handling without try-catch
const [readErr, content] = await safeReadFile('input.txt')
if (readErr) return console.error('Read failed:', readErr)

const [writeErr] = await safeWriteFile('output.txt', content.toUpperCase())
if (writeErr) return console.error('Write failed:', writeErr)

console.log('Success!')
```

---

### Function Utilities

#### `debounce<T>(callback, delay?, immediate?)`

Debounces a function with optional immediate execution.

```typescript
const searchAPI = (query: string) => fetch(`/api/search?q=${query}`)
const debouncedSearch = debounce(searchAPI, 300)

// Only the last call within 300ms will execute
debouncedSearch('a')
debouncedSearch('ab')
debouncedSearch('abc') // Only this will execute after 300ms

// With immediate flag
const saveData = (data: any) => console.log('Saving:', data)
const immediateSave = debounce(saveData, 1000, true)

immediateSave('first') // Executes immediately
immediateSave('second') // Ignored (within 1000ms)

// Using cancel
const debouncedFn = debounce(() => console.log('executed'), 1000)
debouncedFn()
debouncedFn.cancel() // Cancels the pending execution
```

#### `throttle<T>(callback, interval, options?)`

Throttles a function with leading/trailing options.

```typescript
const handleScroll = () => console.log('Scrolling...')
const throttledScroll = throttle(handleScroll, 1000)

window.addEventListener('scroll', throttledScroll)
// handleScroll will be called at most once per second

// With trailing edge execution
const updatePosition = (x: number, y: number) => console.log(x, y)
const throttledUpdate = throttle(updatePosition, 500, { trailing: true })

throttledUpdate(1, 1) // Executes immediately
throttledUpdate(2, 2) // Ignored
throttledUpdate(3, 3) // Will execute after 500ms (trailing)

// Without leading edge execution
const logEvent = () => console.log('Event logged')
const throttledLog = throttle(logEvent, 1000, {
  leading: false,
  trailing: true
})

throttledLog() // Won't execute immediately, will wait 1000ms

// Using cancel
const throttledFn = throttle(() => console.log('executed'), 1000)
throttledFn()
throttledFn.cancel() // Cancels any pending execution
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
const add5 = (x: number) => x + 5
const multiply2 = (x: number) => x * 2
const subtract3 = (x: number) => x - 3

const composed = compose(add5, multiply2, subtract3)
composed(10)
// Result: ((10 + 5) * 2) - 3 = 27

const toUpperCase = (str: string) => str.toUpperCase()
const addExclamation = (str: string) => `${str  }!`
const greet = (name: string) => `Hello, ${name}`

const pipeline = compose(greet, toUpperCase, addExclamation)
pipeline('world')
// Result: "HELLO, WORLD!"
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

- `yyyy` - Full year (2024)
- `MM` - Month (01-12)
- `dd` - Day (01-31)
- `HH` - Hours (00-23)
- `mm` - Minutes (00-59)
- `ss` - Seconds (00-59)
- `WK` - Day of week (locale-dependent)

```typescript
const date = new Date('2024-03-15 15:30:45')

/* ===== Basic Usage ===== */

// Default format (Chinese week names)
formatDate(date)
// "2024-03-15 15:30:45"

// Custom format
formatDate(date, 'yyyy/MM/dd')
// "2024/03/15"

formatDate(date, 'yyyy年MM月dd日')
// "2024年03月15日"

formatDate(date, 'HH:mm:ss')
// "15:30:45"

/* ===== Week Names Support ===== */

// Chinese week names (default)
formatDate(date, 'yyyy-MM-dd 星期WK')
// "2024-03-15 星期五"

// English week names
formatDate(date, 'yyyy-MM-dd WK', { weekNames: 'en' })
// "2024-03-15 Friday"

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
// "2024-03-15 Fri"

/* ===== Get Formatted Value Object ===== */

// Chinese week names
const values = formatDate(date, null)
// {
//   year: "2024",
//   month: "03",
//   day: "15",
//   hours: "15",
//   minutes: "30",
//   seconds: "45",
//   week: "五",      // Friday in Chinese
//   weekNum: 5       // Day of week (0=Sunday, 6=Saturday)
// }

// English week names
const valuesEn = formatDate(date, null, { weekNames: 'en' })
// {
//   ...
//   week: "Friday",
//   weekNum: 5
// }

// Use destructuring
const { year, month, day, weekNum } = formatDate(date, null)
const customFormat = `${year}-${month}-${day} (Day ${weekNum})`
// "2024-03-15 (Day 5)"
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

#### `transformObjectValues<Input, Output>(data, options?)`

Transforms string values in objects to their appropriate types.

```typescript
// Basic boolean and null conversion
transformObjectValues({ active: 'true', value: 'null' })
// { active: true, value: null }

// With number parsing
transformObjectValues({ count: '42', price: '3.14' }, { parseNumbers: true })
// { count: 42, price: 3.14 }

// Deep transformation
transformObjectValues(
  { user: { active: 'false', age: '25' } },
  { deep: true, parseNumbers: true }
)
// { user: { active: false, age: 25 } }

// With date parsing
transformObjectValues({ createdAt: '2024-01-01' }, { parseDates: true })
// { createdAt: Date(2024-01-01) }

// With custom transformer for formatting
transformObjectValues(
  { amount: 12302007 },
  {
    transformer: (val) => (typeof val === 'number' ? val.toLocaleString() : val)
  }
)
// { amount: "12,302,007" }

// Multiple transformations with custom logic
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

// Specific keys only (whitelist mode)
transformObjectValues({ active: 'true', name: 'true' }, { keys: ['active'] })
// { active: true, name: "true" }

// Empty string handling
transformObjectValues(
  { name: '', description: '' },
  { emptyStringToNull: true }
)
// { name: null, description: null }

// Special numbers
transformObjectValues(
  { invalid: 'NaN', max: 'Infinity', min: '-Infinity' },
  { parseSpecialNumbers: true }
)
// { invalid: NaN, max: Infinity, min: -Infinity }

// Chain with tryParse for JSON strings in data
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

// Type-safe usage with generics
interface User {
  name: string
  age: number
  active: boolean
}
const raw = { name: 'John', age: '30', active: 'true' }
const user = transformObjectValues<typeof raw, User>(raw, {
  parseNumbers: true
})
// user is typed as User with proper type checking
```

**Smart conversion supported:**

- "true"/"false" → boolean
- "null" → null
- "undefined" → undefined
- "42" → number (when parseNumbers enabled)
- "2024-01-01" → Date (when parseDates enabled)
- "" → null (when emptyStringToNull enabled)
- "NaN"/"Infinity"/"-Infinity" → special numbers (when parseSpecialNumbers enabled)

#### `createTransformer(rules)`

Creates a custom value transformer with predefined rules.

```typescript
// Basic transformer
const transformer = createTransformer({
  date: (val) => (val.match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(val) : val),
  price: (val) => (typeof val === 'string' ? Number.parseFloat(val) : val)
})

// Number formatting transformer
const formatTransformer = createTransformer({
  amount: (val) => (typeof val === 'number' ? val.toLocaleString() : val),
  count: (val) => (typeof val === 'number' ? val.toLocaleString() : val)
})

// Wildcard transformer (applies to all keys)
const trimTransformer = createTransformer({
  '*': (val) => (typeof val === 'string' ? val.trim() : val)
})

// Use with transformObjectValues
transformObjectValues(data, { transformer })
```

---

### String

#### `insertAt(source, position, text)`

Inserts a string at a specified position in the source string. Supports negative indices (counting from the end) similar to Array.slice().

```typescript
// Insert at positive position
insertAt('Hello World', 5, ',')
// "Hello, World"

insertAt('abcdef', 3, 'XYZ')
// "abcXYZdef"

insertAt('test', 0, 'pre-')
// "pre-test"

// Insert at end of string
insertAt('Hello', 5, '!')
// "Hello!"

insertAt('test', 100, '!!!')
// "test!!!" (position clamped to string length)

// Insert at negative position (from end)
insertAt('Hello', -1, '!')
// "Hell!o" (before last character)

insertAt('World', -2, 'l')
// "Wollrd" (before 2nd character from end)

insertAt('test', -10, 'pre-')
// "pre-test" (negative overflow goes to start)

// Practical use cases
// Add area code to phone number
insertAt('5551234', 0, '(555) ')
// "(555) 5551234"

// Insert separators in credit card number
let card = '1234567890123456'
card = insertAt(card, 4, '-')
card = insertAt(card, 9, '-')
card = insertAt(card, 14, '-')
// "1234-5678-9012-3456"

// Insert file extension
const filename = 'document'
insertAt(filename, filename.length, '.txt')
// "document.txt"
```

#### `transformCase(source, separators?, caseRules?)`

Transforms string case with custom separators and capitalization rules. Powerful utility for converting between different case conventions (camelCase, PascalCase, snake_case, etc.).

```typescript
// Convert to PascalCase (default behavior)
transformCase('hello world')
// "HelloWorld"

transformCase('foo bar baz')
// "FooBarBaz"

// Convert to camelCase
transformCase('hello world', [' ', ''], ['lower', 'upper'])
// "helloWorld"

transformCase('user profile settings', [' ', ''], ['lower', 'upper'])
// "userProfileSettings"

// Convert to snake_case
transformCase('Hello World', [' ', '_'], ['lower', 'lower'])
// "hello_world"

// Convert to kebab-case
transformCase('Hello World', [' ', '-'], ['lower', 'lower'])
// "hello-world"

transformCase('My Component Name', [' ', '-'], ['lower', 'lower'])
// "my-component-name"

// Convert to CONSTANT_CASE
transformCase('hello world', [' ', '_'], ['upper', 'upper'])
// "HELLO_WORLD"

transformCase('api response data', [' ', '_'], ['upper', 'upper'])
// "API_RESPONSE_DATA"

// Convert from snake_case to Title Case
transformCase('hello_world_example', ['_', ' '], ['upper', 'upper'])
// "Hello World Example"

transformCase('user_profile_data', ['_', ' '], ['upper', 'upper'])
// "User Profile Data"

// Convert from kebab-case to camelCase
transformCase('my-component-name', ['-', ''], ['lower', 'upper'])
// "myComponentName"

transformCase('user-login-form', ['-', ''], ['lower', 'upper'])
// "userLoginForm"

// Custom separator transformations
transformCase('hello.world.test', ['.', '/'], ['upper', 'upper'])
// "Hello/World/Test"

transformCase('path/to/file', ['/', '.'], ['lower', 'lower'])
// "path.to.file"

// Practical use cases
// API endpoint to function name
const endpoint = 'get user profile'
const fnName = transformCase(endpoint, [' ', ''], ['lower', 'upper'])
// "getUserProfile"

// Database column to JavaScript property
const dbColumn = 'user_email_address'
const jsProperty = transformCase(dbColumn, ['_', ''], ['lower', 'upper'])
// "userEmailAddress"
```

---

### Type Checking

#### `isType(type, target)`

Checks if a target value is of a specified type name. Combines getType with equality check for convenient type validation.

```typescript
// Basic usage
isType('string', 'hello') // true
isType('number', 42) // true
isType('array', [1, 2, 3]) // true
isType('date', new Date()) // true

// Returns false for mismatches
isType('string', 42) // false
isType('array', {}) // false
isType('object', []) // false

// Use in validation
function processArray(value: unknown) {
  if (!isType('array', value)) {
    throw new Error('Expected an array')
  }
  // value is now known to be an array
  return value.length
}

// With custom types
isType<'map'>('map', new Map()) // true
isType<'set'>('set', new Set()) // true
```

#### `getType<T>(target)`

Gets the exact type name of a variable as a lowercase string. More reliable than typeof for distinguishing between object types.

```typescript
// Basic types
getType('hello') // 'string'
getType(42) // 'number'
getType(true) // 'boolean'
getType(null) // 'null'
getType(undefined) // 'undefined'

// Object types
getType({}) // 'object'
getType([]) // 'array'
getType(new Date()) // 'date'
getType(/regex/) // 'regexp'
getType(new Map()) // 'map'
getType(new Set()) // 'set'
getType(new WeakMap()) // 'weakmap'
getType(new Promise(() => {})) // 'promise'

// With custom type extension
const type = getType<'customtype'>(value)
// Type: CommonType | 'customtype'

// Use in type switching
const value: unknown = [1, 2, 3]
switch (getType(value)) {
  case 'array':
    console.log('It is an array')
    break
  case 'object':
    console.log('It is an object')
    break
}
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

### Number

#### `toFloat<T>(value, defaultValue?)`

Safely converts to float with default value.

```typescript
// Basic usage
toFloat('3.14') // 3.14
toFloat('42') // 42.0
toFloat(123.456) // 123.456

// With invalid values (returns default 0.0)
toFloat('invalid') // 0.0
toFloat(null) // 0.0
toFloat(undefined) // 0.0
toFloat('') // 0.0

// With custom default value
toFloat('invalid', -1) // -1
toFloat(null, 100.5) // 100.5
toFloat(undefined, null) // null

// Parsing strings with whitespace
toFloat('  3.14  ') // 3.14
toFloat('3.14abc') // 3.14 (parseFloat stops at first non-numeric character)

// Use in data processing
const prices = ['10.99', 'invalid', '25.50', null]
const validPrices = prices.map((p) => toFloat(p, 0)).filter((p) => p > 0)
// [10.99, 25.50]
```

#### `toInt<T>(value, defaultValue?)`

Safely converts to integer with default value.

```typescript
// Basic usage
toInt('42') // 42
toInt('3.14') // 3 (truncates decimal)
toInt(123.456) // 123

// With invalid values (returns default 0)
toInt('invalid') // 0
toInt(null) // 0
toInt(undefined) // 0
toInt('') // 0

// With custom default value
toInt('invalid', -1) // -1
toInt(null, 999) // 999
toInt(undefined, null) // null

// Parsing with radix (default is 10)
toInt('42') // 42
toInt('0x10') // 0 (use Number.parseInt(value, 16) for hex)

// Parsing strings with non-numeric characters
toInt('42px') // 42 (parseInt stops at first non-numeric character)
toInt('  100  ') // 100

// Use in data validation
const getUserAge = (input: any) => {
  const age = toInt(input, null)
  if (age === null || age < 0 || age > 150) {
    throw new Error('Invalid age')
  }
  return age
}
```

#### `padNumber(value)`

Pads a number to at least two digits by adding leading zeros if necessary. Commonly used for formatting time components (hours, minutes, seconds) or dates.

```typescript
// Basic usage
padNumber(5) // '05'
padNumber(12) // '12'
padNumber(0) // '00'

// Numbers with more than 2 digits remain unchanged
padNumber(100) // '100'
padNumber(999) // '999'

// Use in time formatting
const hours = 9
const minutes = 5
const seconds = 3
const time = `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`
// "09:05:03"

// Use in date formatting
const month = 3
const day = 7
const date = `2024-${padNumber(month)}-${padNumber(day)}`
// "2024-03-07"

// Formatting a list of numbers
const items = [1, 5, 10, 25]
const formatted = items.map(padNumber)
// ['01', '05', '10', '25']
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

- `setInterval`: Triggers every X milliseconds (regardless of whether the previous execution is complete)
- `setSerialInterval`: Waits for the previous execution to complete, then waits X milliseconds before executing the next one

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

- Supports nested objects with bracket notation (e.g., filter[name]=value)
- Automatically encodes keys and values for URL safety
- Skips null, undefined, and empty string values

```typescript
// Simple parameters
toQueryString({ name: 'John', age: 25 })
// "name=John&age=25"

// Nested object parameters
toQueryString({ filter: { status: 'active', type: 'user' }, page: 1 })
// "filter[status]=active&filter[type]=user&page=1"

// Skips empty values
toQueryString({ name: 'John', email: null, phone: '' })
// "name=John"
```

#### `getQueryParams(keys, options?)`

Gets query parameters from URL.

```typescript
// Get from current URL
getQueryParams(['page', 'filter'])
// { page: '2', filter: 'active' }

// Get from custom URL
getQueryParams(['id'], { url: 'https://example.com?id=123&type=post' })
// { id: '123' }

// Get all query params
getQueryParams([], { url: 'https://example.com?id=123&type=post', all: true })
// { id: '123', type: 'post' }

// URL without params (automatically adds ?)
getQueryParams(['id'], { url: 'https://example.com' })
// { id: undefined }
```

#### `setQueryParams(params, options?)`

Sets or updates query parameters in URL.

```typescript
// Modify current URL
setQueryParams({ page: 2, filter: 'active' })
// Current URL becomes: ?page=2&filter=active

// Return modified custom URL
const newUrl = setQueryParams(
  { page: 2, filter: 'active' },
  { url: 'https://example.com/path' }
)
// "https://example.com/path?page=2&filter=active"

// URL with existing params
const newUrl = setQueryParams(
  { page: 3 },
  { url: 'https://example.com?page=1&filter=all' }
)
// "https://example.com?page=3&filter=all"

// Custom skip logic
setQueryParams(
  { tags: [], status: null },
  {
    skipNull: false,
    skipIf: (key, value) => Array.isArray(value) && value.length === 0
  }
)
```

#### `tryParse(params, options?)`

Attempts to parse a JSON string with fallback value.

```typescript
// Basic usage
const data = tryParse<User>('{"name":"John"}', {})

// With validation
const withValidation = tryParse('{"id":1}', null, {
  validator: (val): val is User => typeof val.id === 'number'
})

// With error handling
tryParse(
  'invalid json',
  {},
  {
    onError: (error, input) => console.log('Parse failed:', error)
  }
)
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[MIT License](LICENSE) © OpenKnights Contributors

## 🔗 Links

- [GitHub Repository](https://github.com/coderking3/kedash)
- [NPM Package](https://www.npmjs.com/package/kedash)
- [Issues](https://github.com/coderking3/kedash/issues)
