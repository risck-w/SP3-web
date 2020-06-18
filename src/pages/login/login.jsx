import React, { Component } from 'react'
import './login.less'
import logo from './images/logo.png'
import { Form, Icon, Input, Button} from 'antd';


/**
 * 登录的路由界面
 */

 class Login extends Component {

    handleSubmit = (event) => {

        // 组织事件的默认行为
        event.preventDefault();

        // 获取表单项输入数据
        this.props.form.validateFields((err, values) => {
            if(!err) {
                console.log('进行ajax请求: ', values)
            }
        });
    }
    // 对密码进行自定义验证
    validatorPwd = (rule, value, callback) => {
        console.log(rule, value)
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


    render(){

        const { getFieldDecorator } = this.props.form;

        return (
            <div className="login">
                <header className="login-header">
                    <img src={ logo } alt=""></img>
                    <h1>SiteParse3：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                        {getFieldDecorator('username', {
                            // 声明式验证，直接使用别人定义好的验证规则进行验证
                            'rules': [
                                {required: true, whitespace: true, message: '用户名必须输入'},
                                {min: 4, message: '用户名至少4位'},
                                {max: 12, message: '用户名最多12位'},
                                {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成'}
                            ]
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户名"
                            />
                        )}
                        </Form.Item>
                        <Form.Item>
                            { getFieldDecorator('password', {
                                'rules': [
                                    {
                                        validator: this.validatorPwd
                                    }
                                ]
                            })(
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
const WrapLogin = Form.create()(Login)
export default WrapLogin
 /**
  * 1、前台表单验证
  * 2、收集表单输入数据
  */