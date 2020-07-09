/**
 * 发送一步请求的ajax模块
 * 封装axios库
 * 函数返回promise对象
 * 
 * 1、优化
 * 统一处理返回异常
 */

import axios from 'axios'
import {message} from 'antd'

export default function ajax(url, data={}, method='GET') {

    return new Promise((resolve, reject) => {
        let promise;
        // 1、执行异步ajax请求
        if (method === 'GET') {
            promise =  axios.get(url, {
                params: data
            })
        } else {
            promise = axios.post(url, data)
        }
        // 2、如果成功，调用reslove（value）
        promise.then(response => {
            resolve(response.data)
        }).catch(error => {
            // 3、如果失败，不调用reject(reason), 而是提示异常信息，这样就不会进入trycatch了
            message.error('请求出错了： ' + error.message);
        });
    })
}