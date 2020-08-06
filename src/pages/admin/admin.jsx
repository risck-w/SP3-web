import React, { Component } from 'react'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom'
import { Divider, Form, Radio, Button, Input} from 'antd'
import { message } from 'antd'
import './admin.less'
import { reqCraw } from '../../api'
import { formatData } from '../../utils/baseUtils'
import Player from 'griffith'

class Griffiths extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sources: {
                ld: {
                    bitrate: 0,
                    duration: 0,
                    format: 'm3u8',
                    height: 0,
                    width: 0,
                    play_url: '',
                    size: 0
                  }
            },
            __griffithId: 'fa8ddf0a-51b5-44e6-8ff0-39821a45dfdc',
            title:'',
            cover:'',
            autoplay: true,
            duration: 0
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.sources !== nextProps.sources){
            const sources = nextProps.sources
            const id = nextProps.id
            const title = nextProps.title
            const cover = nextProps.cover
            const duration = nextProps.duration
            const autoplay = nextProps.autoplay
            this.setState({
                title: title,
                sources: sources,
                __griffithId: id,
                cover: cover,
                autoplay: autoplay,
                duration: duration
            })
        }
    }

    render(){
        return <Player 
                    id={this.state.__griffithId} 
                    sources={this.state.sources}
                    title={this.state.title} 
                    cover={this.state.cover}
                    autoplay={this.state.autoplay}
                    duration={this.state.duration}   
                />
    }


}

class Admin extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title:'',
            sources: {},
            __griffithId: 'fa8ddf0a-51b5-44e6-8ff0-39821a45dfdc',
            cover:'',
            autoplay: true,
            duration: 100
        }
    }

    handleSubmit = (e) => {
        // 阻止默认事件
        e.preventDefault()
        this.props.form.validateFields( async (err, values) => {
            if(!err){
                try {
                    const result = await reqCraw(values)
                    if (result.code === 0 && result.data){
                        const {sources, __griffithId, title, cover, autoplay, duration} = await formatData(result.data)
                        this.setState({
                            sources, 
                            __griffithId,
                            title,
                            cover,
                            autoplay,
                            duration
                        })
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
                            <Radio value="vod">点播</Radio>
                            <Radio value="live">直播</Radio>
                            <Radio value="music">音乐</Radio>
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
                <div>
                    <Griffiths 
                        id={this.state.__griffithId} 
                        cover={this.state.cover} 
                        sources={this.state.sources} 
                        autoplay={this.state.autoplay} 
                        duration={this.state.duration} 
                        title={this.state.title} 

                        />
                </div>
                <Divider />
            </div>
        </div>
    }
}

const SP3Admin = Form.create()(Admin)
export default SP3Admin