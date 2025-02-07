import React, {Component} from 'react'
import './header.less'
import Sider from './summary'

const Header = () =>  {
    return <header className="login-header">
        <h1 style={{float: 'left'}}>Spcloud</h1>
        <Sider></Sider>
    </header>
}
export default Header