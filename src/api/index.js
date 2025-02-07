/**
 * 包含应用中所有接口请求函数的模块
 */

import ajax from './ajax'
import requestFun from './fetch'
import qs from 'qs'

const { stringify } = qs
const { post, get } = requestFun

 // 登录
//  export function reqLogin(username, password) {
//     return ajax('/login', {username, password}, 'POST')
//  }

 export const reqLogin = (username, password) => ajax('user/login', {username, password}, 'POST')

 // 添加用户
 export const reqAddUser = (user) => ajax('/user/add', user, 'POST')

 export const reqCraw = (data) => ajax('/craw', data, 'GET')

 export const reqRank = () => ajax('/pageRank', null, 'GET')

 export const reqHotWebSite = () => ajax('/hotWebSite', null, 'GET')

 export const reqWordCloud = () => ajax('/wordCloud', null, 'GET')

 export const reqTopHotWebSite = () => ajax('/topHotWebSite', null, 'GET')

 export const reqAIAgentSearch = (data) => ajax('/AIAgentSearch', data, 'GET')

 // fetch AI搜索
 export async function FetchAIContent(params, option={}) {
     return get(`/AIAgentSearch?${stringify(params)}`, option)
 }

 // Post fetch AI搜索
 export async function PostFetchAIContent(params, option={}) {
    return post('/AIAgentSearch', params, option,)
}