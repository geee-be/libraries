# Prettier Config

## To Use

Install or update the package

```bash
npm install --save-dev @geee-be/prettier-config@latest
# -- or --
pnpm add --save-dev @geee-be/prettier-config@latest
# -- or --
yarn add --dev @geee-be/prettier-config@latest
```

Configure prettier. In `package.json`, add

```json
{
  ...,
  "prettier": "@geee-be/prettier-config"
}
```

## Using with Eslint

Disable eslint rules that conflict.

Install plugin:

```bash
npm install --save-dev eslint-config-prettier@latest eslint@latest
# -- or --
pnpm add --save-dev eslint-config-prettier@latest eslint@latest
# -- or --
yarn add --dev eslint-config-prettier@latest eslint@latest
```

Configure `.eslintrc.json`

```json
{
  "extends": [
    ...,
    "prettier"
  ],
  ...
}
```
