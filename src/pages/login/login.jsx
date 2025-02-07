import React, { Component } from 'react'
import './login.less'
import { Form, Icon, Input, Button} from 'antd';
import Header from '../header/header'
import {reqLogin} from '../../api'
import { message } from 'antd'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom';

/**
 * 登录的路由界面
 */

const Login = () => {

    const [form] = Form.useForm()

    // 对密码进行自定义验证
    const validatorPwd = (rule, value, callback) => {
        if (!value) {
            callback('密码不能为空!')
        } else if (value.length < 8) {
            callback('密码长度不能小于8位')
        } else if (value.length > 16) {
            callback('密码长度不能大于16位')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('用户名必须是英文、数字或下划线组成')
        }
        callback()
    }
    const user = storageUtils.getUser()
    if (user && user._id) {
        return <Redirect to='/' />
    }

    const onFinish = async (values) => {
        console.log(values)
        const {username, password} = values
        const result = await reqLogin(username, password)
        if (result.status === 0){
            // 登录成功
            message.success('登录成功')
            // 保存对象
            storageUtils.saveUser(result)
            // this.props.history.push和repalce的区别是是否需要回退
            this.props.history.replace('/')
        } else {
            // 登录失败
            message.error(result.message)
        }
    }

    const onFinishFailed = (errorInfo) => {
        if (errorInfo) {
            message.error(errorInfo)
        }
    }

    return (
        <div className="login">
            <Header></Header>
            <section className="login-content">
                <h2>用户登录</h2>
                <Form 
                    form={form}
                    className="login-form" 
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                    name='username'
                        rules={[
                            {required: true, whitespace: true, message: '用户名必须输入'},
                            {min: 4, message: '用户名至少4位'},
                            {max: 12, message: '用户名最多12位'},
                            {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成'}
                        ]
                    }>
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="用户名"
                        />
                    )}
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                                {
                                    validator: validatorPwd
                                }
                            ]
                        }
                        hasFeedback
                    >
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                            />
                        ) }
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

/*
1. 高阶函数
    1）一类特别的函数
        a. 接受函数类型的参数
        b. 返回值是函数
    2）常见
        a. 定时器： setTimeout()/setInterval()
        b. Promise: Promise(() => {}) then(value => {}, reason => {})
        c. 数组遍历相关的方法： foreach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象的bind()方法
        e. form.create()() / getFieldDecorator()()
    3) 高阶函数更新动态，更加具有扩展性

2. 高阶组件
 1). 本质是一个函数
 2). 接受一个组件（被包装组件）, 返回一个新的组件（包装组件）, 包装组件会向被包装组件传入特定属性
*/


/**
 * 包装Form组件生成一个新的组件：Form(Login)
 * 新组件会向Form组件传递一个强大的对象属性：form
 */
// const WrapLogin = Form.create()(Login)
export default Login
 /**
  * 1、前台表单验证
  * 2、收集表单输入数据
  */

/**
 * async 和 await 
 * 1、作用？
 * 简化promise对象的使用，不用在使用then()来指定成功/失败的回调函数
 * 以同步编码（没有回调函数了）方式实现异步流程
 * 2、哪里写await?
 *  在返回promise的表达式左侧写await：不想要promise，想要promise异步执行的成功组件
 * 3、哪里写async?
 */