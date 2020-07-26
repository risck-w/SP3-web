import React, { Component } from 'react'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom'
import { Divider, Form, Radio, Button, Input} from 'antd'
import { message } from 'antd'
import './admin.less'
import { reqCraw } from '../../api'
import { judgeType } from '../../utils/baseUtils'

class Admin extends Component {

    handleSubmit = (e) => {
        // 阻止默认事件
        e.preventDefault()
        this.props.form.validateFields( async (err, values) => {
            if(!err){
                try {
                    const data = await reqCraw(values)
                    if (values.parseType){
                        console.log(data.vod.music)
                        const url = await judgeType(data, values.parseType)
                        message.info(url)
                    }
                } catch (err){
                    message.error(err)
                }
            }
        })
    }

    render() {
        const user = storageUtils.getUser()
        // 如果内存中没存储user ==> 当前没有登录
        if (!user || !user._id) {
            // 自动跳转到登录界面（在render中）
            return <Redirect to='/login'/>
        }

        const { getFieldDecorator } = this.props.form

        return <div className='container'>
            <header className='admin-header'>
                <h1>SiteParse3影视解析系统</h1>
                <p className='lead'>随心所欲，释放你的青春</p>
            </header>
            <div className='sp3-container'>
                <h4 className='lead'>解析类型</h4>

                <Divider />
                
                <Form  onSubmit={ this.handleSubmit }>
                    <Form.Item>
                        { getFieldDecorator("parseType", { initialValue: "1" })(
                            <Radio.Group>
                            <Radio value="1">点播</Radio>
                            <Radio value="2">直播</Radio>
                            <Radio value="3">音乐</Radio>
                            </Radio.Group>
                        )}  
                    </Form.Item>
                    <Form.Item>
                        { getFieldDecorator('url', { valuePropName: 'checked', 'rules': [{required: true, message: '解析地址不能为空'}]})(
                            <Input className='sp3-form-input' placeholder='URL解析地址' />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            解析
                        </Button>
                    </Form.Item>
                </Form>
                
                <Divider />
                <p>解析结果</p>
            </div>
        </div>
    }
}

const SP3Admin = Form.create()(Admin)
export default SP3Admin