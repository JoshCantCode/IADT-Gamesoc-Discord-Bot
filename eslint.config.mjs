import tseslint from 'typescript-eslint';
import { configs as seyfert } from '@slipher/eslint-plugin';
export default tseslint.config(
  { languageOptions: { parserOptions: { projectService: true } } },
  ...seyfert.recommended,
);
