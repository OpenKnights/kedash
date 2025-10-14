import { defineConfig } from '@king-3/eslint-config'

const eslintConfig = defineConfig(
  {
    typescript: true
  },
  {
    rules: {
      'unused-imports/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_'
        }
      ]
    }
  },
  {
    files: ['**/*.md', '**/*.md/**'], // 更完整的 glob 模式
    rules: {
      'unused-imports/no-unused-vars': 'off'
    }
  }
)

export default eslintConfig
