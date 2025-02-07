import qs from 'qs';
import { message } from 'antd';

const { stringify, parse } = qs;

const checkStatus = res => {
  if (200 >= res.status < 300) {
    return res;
  }
  message.error(`网络请求失败,${res.status}`);
  const error = new Error(res.statusText);
  error.response = error;
  throw error;
};

/**
 *  捕获成功登录过期状态码等
 * @param res
 * @returns {*}
 */
const judgeOkState = async res => {
  const cloneRes = await res.clone().json(); 
  
  //TODO:可以在这里管控全局请求
  if (!!cloneRes.code && cloneRes.code !== 200) {
    message.error(`${cloneRes.msg}${cloneRes.code}`);
  }
  return res;
};

/**
 * 捕获失败
 * @param error
 */
const handleError = error => {
  if (error instanceof TypeError) {
    message.error(`网络请求失败啦！${error}`);
  }
  return {   //防止页面崩溃，因为每个接口都有判断res.code以及data
    code: -1,
    data: false,
  };
};

class http {
  /**
   *静态的fetch请求通用方法
   * @param url
   * @param options
   * @returns {Promise<unknown>}
   */
  static async staticFetch(url = '', options = {}) {

    const defaultOptions = {};
    defaultOptions.headers = options.headers;
    const newOptions = { ...defaultOptions, ...options };
    return fetch(url, newOptions)
      .then(checkStatus)
      .catch(handleError);
  }

  /**
   *post请求方式
   * @param url
   * @returns {Promise<unknown>}
   */
  post(url, params = {}, option = {}) {
    const options = {...{ method: 'POST' }, ...option};
    //一般我们常用场景用的是json，所以需要在headers加Content-Type类型
    options.body = JSON.stringify(params);
    return http.staticFetch(url, options); //类的静态方法只能通过类本身调用
  }

  /**
   * put方法
   * @param url
   * @returns {Promise<unknown>}
   */
  put(url, params = {}, option = {}) {
    const options = Object.assign({ method: 'PUT' }, option);
    options.body = JSON.stringify(params);
    return http.staticFetch(url, options); //类的静态方法只能通过类本身调用
  }

  /**
   * get请求方式
   * @param url
   * @param option
   */
  get(url, option = {}) {
    const options = Object.assign({ method: 'GET' }, option);
    return http.staticFetch(url, options);
  }
}

const requestFun = new http(); //new生成实例
export const { post, get, put } = requestFun;
export default requestFun;