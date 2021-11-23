const fs = require('fs')
const path = require('path')
const defaultConfig = require('./autoi18n.config')
const log = require('./log')
const cwdPath = process.cwd()
const axios = require('axios')
const MD5 = require('./md5')
/**遍历对象，将对象value添加到列表中
 * @param {*} data 字段对象 
 * @returns 
 */
const traverse=(data, list)=>{
  for(let key of Object.keys(data)){
    if(typeof data[key] === 'string'){
      list.push(data[key])
    }else{
      traverse(data[key], list)
    }
  }
}

/**
 * @param {*} messages 国际化字段对象 
 * @returns 将国际化对象转化为字符串列表
 */
const getList = (message)=>{
  let list = []
  traverse(message, list)
  return list
}
/**
 * @param {*} options.messages 国际化字段对象 
 * @returns code 经过国际化的代码
 */
const recoverMessage=(message, list)=>{
  let index = 0
  function recoverTraverse(data){
    for(let key of Object.keys(data)){
      if(typeof data[key] === 'string'){
        data[key] = list[index]
        index++
      }else{
        recoverTraverse(data[key])
      }
    }
  }
  return recoverTraverse(message)

}

const getRequest=(query)=>{
  let appid = '20211116001000560';
  let key = 'v9JaIXGkQyPjLXM4tqm1';
  let salt = (new Date).getTime();
  // let query = 'apple';
  // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
  let from = 'zh';
  let to = 'en';
  let str1 = appid + query + salt +key;
  let sign = MD5(str1);
  return axios({
    method: 'get',
    url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
    params: {
      q: query,
      appid: appid,
      salt: salt,
      from: from,
      to: to,
      sign: sign
    }
  });
}
/**
 * @param {*} funList 待请求队列
 * @param {*} num 最大并发请求数
 * @returns 
 */
const reuqestQueue = async (funList,num)=>{
  let result = []
  let promiseList = []
  let res = []
  for(let fun of funList){
    promiseList.push(fun())
    if(promiseList.length === num){
      res = await Promise.all(promiseList)
      result = result.concat(res)
      promiseList = []
      res = []
    }
  }
  try{
    res = await Promise.all(promiseList)
    // console.log('response',res[0].data)
    result = result.concat(res)
    return result
  }catch{
    log.error('网络请求失败')
    return []
  }
}
module.exports = async function baiduTranstale(message) { 
  // console.log('message',message)
  let messageList = getList(message);
  // console.log('messageList',messageList)
  let queryNum = Math.ceil(messageList.length / 80)
  let funList = []

  for(let i = 0 ; i<queryNum ; i++){
    let str = messageList.slice(i*80, (i+1)*80).join('\n')
    funList.push(()=>getRequest(str))
  }
  // console.log('funList',funList)
  const res = await reuqestQueue(funList, 3)
  // console.log('translate result:', res)
  let resMessageList = []
  res.forEach(item=>{
    item.data.trans_result.forEach(val=>{
      resMessageList = resMessageList.concat(val.dst)
    })
  })
  recoverMessage(message, resMessageList)
  return message
};
