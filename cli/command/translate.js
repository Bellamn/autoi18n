const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const prettier = require('prettier');
const log = require('../utils/log');
const defaultOptions = require('../utils/autoi18n.config')
const LocaleFile = require('../utils/localeFile')
const baseUtils = require('../utils/baseUtils')
const { transform } = require('../../core/index')


async function doInquire(filePath) {
  // 1. 配置文件是否存在
  let configExist = true;
  try {
    fs.accessSync(filePath);
  } catch (e) {
    log.error('文件不存在')
    configExist = false;
    process.exit(0)
  }

  return configExist;
}

function getRandomChar(){
  let num = Math.floor(Maht.random()*(122-97)) + 97
  return String.fromCharCode(num)
}
function translate(str){
  let result = []
  let lenth =Math.floor(Maht.random()*30)
  for(let i=0; i<lenth; i++){
    result.push(getRandomChar())
  }
  return result.join('')
}

function traverse(data){
  for(let key of Object.keys(data)){
    if(typeof data[key] === 'string'){
      data[key] = translate('')
    }else{
      traverse(data[key])
    }
  }
}
module.exports = async function translate(programOption) {

  // 合并配置文件
  const options = mergeIi8nConfig(programOption)
  const answers = await doInquire(options.file);

  const localeFile = new LocaleFile(options.localePath)
 // 读取国际化json文件
 let data = localeFile.getConf('', '', options.file)
 
 // 遍历翻译
 traverse(data)

 localeFile.createConf(data, locale, options);

  log.success('翻译完成');
};
