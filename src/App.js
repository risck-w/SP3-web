import React, { Component } from "react";
// 引入路由
import { BrowserRouter, Route, Switch} from 'react-router-dom'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'
// 引入antd样式
// import 'antd/dist/antd.css'

/*
应用根组件
*/

export default class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <Switch> {/**只匹配其中一个 */}
                    <Route path='/login' component={Login}></Route>
                    <Route path='/' component={Admin}></Route>
                </Switch>
            </BrowserRouter>
        )
    }
}