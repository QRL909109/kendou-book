const conf = require('../conf')
const md5 = require('md5')

import { getStorageSync } from '@/utils/storage'
import wepy from 'wepy'

/**
 * 生成n位随机数字串
 * @param  {Number} n 产生随机数的位数
 * @return {String}   产生的随机数
 */
const randomNum = n => {
  var res = ''
  for (var i = 0; i < n; i++) {
    res += Math.floor(Math.random() * 10)
  }

  return res
}

/**
 * 组装参数
 * @param  {[type]} params [description]
 * @param  {[type]} secret [description]
 * @return {[type]}        [description]
 */
let wrapReqParams = (params, secret) => {
  let timeStamp = new Date().getTime(),
    reqId = timeStamp + randomNum(3),
    reqSign = md5(reqId + ':' + secret + ':' + timeStamp),
    wrapedParams = {
      id: reqId,
      sign: reqSign,
      timestamp: timeStamp
    }
  wrapedParams.data = params
  return wrapedParams
}

/**
 * 代理接口请求
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
export default obj => {
  obj.data = obj.data || {}
  
  // 组装url
  if (obj.url.indexOf('http') != 0) {
      obj.url =  wepy.$appConfig.apiPrefix + (obj.url.indexOf('/') === 0 ? '' : '/') + obj.url
  }

  // 所有请求带上sid
  let sid = getStorageSync('sid')
  if (sid) {
      obj.data.sid = sid
  }

  // 注入版本号标识给后端
  obj.data.clientVer = conf.clientVer;
  obj.data.caller = 'b_weapp';

  // 组装参数
  let propsData = wrapReqParams(obj.data, conf.apiKey)
  obj.data = propsData
  obj.method = obj.method || 'POST'

  return wepy.request(obj)
}
