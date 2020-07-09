import React, { Component } from 'react'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom'

export default class Admin extends Component {
    render() {
        const user = storageUtils.getUser()
        // 如果内存中没存储user ==> 当前没有登录
        console.log(user)
        if (!user || !user._id) {
            // 自动跳转到登录界面（在render中）
            return <Redirect to='/login'/>
        }
        return <div>
            Hello {user.username}
        </div>
    }
}