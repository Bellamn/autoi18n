module.exports = {
  language: ['zh-cn', 'en-us'],
  modules: 'es6',
  entry: ['./src'],
  localePath: './src/locales',
  localeFileExt: '.json',
  extensions: [],
  exclude: [],
  ignoreMethods: ['i18n.get'],
  ignoreTagAttr: ['class', 'style', 'src', 'href', 'width', 'height'],
  i18nObjectMethod: 'i18n.get',
  i18nMethod: 'i18n.get',
  setMessageKey: false,
  i18nInstance: "import { i18n } from '~/i18n'",
  prettier: { singleQuote: true, trailingComma: 'es5', endOfLine: 'lf' },
};
