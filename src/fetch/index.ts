import axios from 'axios';
import { Message } from '@arco-design/web-react';
import api from './api'
// import httpErrorHandler from './httpErrorHandler.js' // http错误处理

// 公共参数配置
const instance = axios.create({
    baseURL: '/api',
    // baseURL,
    timeout: 30000,
    // contentType: 'application/json',
    headers: {
        // 'content-type': 'application/json'
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
    },
})

// 在实例已创建后修改默认值
// 返回结果公共处理
instance.interceptors.response.use((res) => {
    if (!res) {
        return Promise.reject(res)
    }
    // 未登录状态
    if (res.data && res.data.errCode === '401' && window.routerHistory) {
        window.localStorage.removeItem('Token')
        window.routerHistory.replace('/user')
        Message.error('请重新登录!')
    }

    // 未登录状态
    // if (res.data && res.data.errCode === null) {
    if (res.data && res.data.errCode === '403') {
        window.localStorage.removeItem('Token')
        window.routerHistory.replace('/user')
        Message.error('未授权, 请重新登录!')
        return false
    }


    // 服务端错误
    if (res.data && res.data.errCode === '500') {
        Message.error('服务器开小差了，请稍后再试!')
        return false
    }

    // 错误提示
    if (res.data && !res.data.success && res.data.errCode !== '0' && res.data.errCode !== '401' && res.data.errCode !== '403' && res.data.errCode !== '500') {
      Message.error(`${res.data.errMessage} --- ErrorCode: ${res.data.errCode}`)
    }
    return res.data
})

// 创建单个请求
function createApi(config: any) {
    return (data: any) => {
        const { lang, Token } = window.localStorage
        Object.assign(config, {
            headers: {
                'Accept-Language': lang,
                Authorization: Token || '',
            },
        })
        if (config.method === 'get') {
            return instance({
                ...config,
                params: {
                    ...data,
                    _t: Date.now()
                }
            }).catch((e) => {
                if (e) Message.error(e.message || e.msg)
                return e || {}
            })
        }
        if (config.inUrl) {
          const url = `${config.url}/${data}`
          return instance({
              ...config,
              url,
          }).catch((e) => {
              if (e) Message.error(e.message || e.msg)
              return e || {}
          })
        }
        return instance({
            ...config,
            data: {
                ...data,
            }
        }).catch((e) => {
            if (e) Message.error(e.message || e.msg)
            return e || {}
        })
    }
}
interface Apis {
  [key: string]: (data?: any) => Promise<any>;
}
const apis:Apis = {}

Object.entries(api).forEach((item) => {
    apis[item[0]] = createApi(item[1])
})

export default apis
