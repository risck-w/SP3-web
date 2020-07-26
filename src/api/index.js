/**
 * 包含应用中所有接口请求函数的模块
 */

import ajax from './ajax'

 // 登录
//  export function reqLogin(username, password) {
//     return ajax('/login', {username, password}, 'POST')
//  }

 export const reqLogin = (username, password) => ajax('user/login', {username, password}, 'POST')

 // 添加用户
 export const reqAddUser = (user) => ajax('/user/add', user, 'POST')

 export const reqCraw = (data) => ajax('/craw', data, 'GET')