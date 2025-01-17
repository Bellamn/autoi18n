const path = require('path')
const program = require('commander')
const initFileConf = require('./command/initFileConf')
const collect = require('./command/collect')
const package = require('../package')
const translate = require('./command/translate')

// 用法 版本说明
program
  .version(package.version) // 定义版本
  .usage('<command>') // 定义用法

// 初始化配置文件
program
  .command('init') // 定义命令
  .alias('i') // 命令别名
  .description('init locales conf') // 对命令参数的描述信息
  // .option('-c, --config <path>', 'set config path. defaults to ./autoi18n.config.js') // 指定配置文件
  .action(function (options) {
    initFileConf(options)
  })
  .on('--help', function () {
    console.log('  Examples:')
    console.log('    $ autoi18n init')
  })

// 同步国际化配置文件并替换为对应的国际化字段
program
  .command('sync') // 定义命令
  .alias('s') // 命令别名
  .description('Synchronize the Chinese configuration to the internationalization profile') // 对命令参数的描述信息
  .option('-r, --replace', 'Replace Internationalization Fields') // 替换国际化字段 如果为true 会写入源文件 默认为false
  .action(function (options) {
    collect(options)
  })
  .on('--help', function () {
    console.log('  Examples:');
    console.log('    $ autoi18n sync')
  })

 // 将json文件翻译为目标语言
program
.command('translate') // 定义命令
.alias('t') // 命令别名
.description('translate the source json file into target language json file') // 对命令参数的描述信息
.option('-f, --file <filePath>', 'the path to the source file') // 替换国际化字段 如果为true 会写入源文件 默认为false
.action(function (options) {
  translate(options)
})
.on('--help', function () {
  console.log('  Examples:');
}) 

program.parse(process.argv)
