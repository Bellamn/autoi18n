const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const prettier = require('prettier');
const log = require('../utils/log');
const defaultOptions = require('../utils/autoi18n.config')
const LocaleFile = require('../utils/localeFile')
const baseUtils = require('../utils/baseUtils')
const mergeIi8nConfig = require('../utils/mergeIi8nConfig')
const { transform } = require('../../core/index')
const baiduTranstale = require('../utils/baiduTranslate')

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

// function getRandomChar(){
//   let num = Math.floor(Math.random()*(122-97)) + 97
//   return String.fromCharCode(num)
// }
// function translate(str){
//   let result = []
//   let lenth =Math.floor(Math.random()*30)
//   for(let i=0; i<lenth; i++){
//     result.push(getRandomChar())
//   }
//   return result.join('')
// }

// function traverse(data){
//   for(let key of Object.keys(data)){
//     if(typeof data[key] === 'string'){
//       data[key] = translate('')
//     }else{
//       traverse(data[key])
//     }
//   }
// }
module.exports = async function translate(programOption) {
  const cwdPath = process.cwd()
  // console.log(programOption)
  // 合并配置文件
  const options = mergeIi8nConfig(programOption)
  
  log.info('当前文件路径: '+cwdPath)
  log.info('加载文件路径: '+options.file);
  // console.log(options)
  const answers = await doInquire(options.file);

  const localeFile = new LocaleFile(options.localePath)
 // 读取国际化json文件
 let data = localeFile.getConf('', '', options.file)
 
 // 遍历翻译
 try{
  let res = await baiduTranstale(data)

  localeFile.createConf(res, '', options,options.file );
 
 log.success('翻译完成');
 }catch(error){
   console.log(error)
  log.error('翻译失败');
 }

};
