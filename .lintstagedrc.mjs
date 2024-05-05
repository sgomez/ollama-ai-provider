import { relative } from 'path'

const buildEslintCommand = (filenames) =>
  `pnpm lint --fix ${filenames
    .map((f) => relative(process.cwd(), f))
    .join(' ')}`

export default {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}
