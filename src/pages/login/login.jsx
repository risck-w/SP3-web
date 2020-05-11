import React, { Component } from 'react'
import './login.less'
import logo from './images/logo.png'
import { Form, Input, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';


/**
 * 登录的路由界面
 */

 class Login extends Component {

    handleSubmit = (event) => {

    }


     render(){
        return (
            <div className="login">
                <header className="login-header">
                    <img src={ logo } alt=""></img>
                    <h1>SiteParse3：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form className="login-form" onSubmit={this.handleSubmit}>
                        <Form.Item
                            name='username'
                            rules={[{required: true, message: 'Place input your Username!'}]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name='password'
                            rules={[{required: true, message:'Place input your Password!'}]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password" placeholder="密码"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
     }
 }

const WrapLogin = Login
export default WrapLogin
 /**
  * 1、前台表单验证
  * 2、收集表单输入数据
  */