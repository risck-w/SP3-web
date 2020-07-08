/**
 * 发送一步请求的ajax模块
 * 封装axios库
 * 函数返回promise对象
 */

import axios from 'axios'

export default function ajax(url, data={}, method='GET') {
    if (method === 'GET') {
        return axios.get(url, {
            params: data
        })
    } else {
        return axios.post(url, data)
    }
}