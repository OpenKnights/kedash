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
    files: ['**/*.md', '**/*.md/**'],
    rules: {
      'unused-imports/no-unused-vars': 'off'
    }
  }
)

export default eslintConfig
