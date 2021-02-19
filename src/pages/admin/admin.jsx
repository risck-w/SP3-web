import React, { Component } from 'react'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom'
import { Divider, Form, Radio, Badge, Icon, Empty, Button, Input} from 'antd'
import { message, Tag } from 'antd'
import { notification } from 'antd'
import './admin.less'
import { reqCraw, reqHotWebSite, reqTopHotWebSite } from '../../api'
import { UUID } from '../../utils/baseUtils'
import Player from 'griffith'
import ContentLeft from './content'
import _ from 'lodash'
import MyTag from '../../components/tag'
import WordCloud from '../../components/wordCloud'


class Griffiths extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sources: {
                ld: {
                    bitrate: 0,
                    duration: 0,
                    format: 'mp4',
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
        if (this.props.sources !== nextProps.sources && this.props.__griffithId !== nextProps.id){
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
            // title:'',
            // sources: {},
            // __griffithId: 'fa8ddf0a-51b5-44e6-8ff0-39821a45dfdc',
            // cover:'',
            // autoplay: true,
            // duration: 100,
            isShowRank: false,
            rankData: null,
            isShowHotWebSite: false,
            hotWebSite: null,
            isShowTopHotWebSite: false,
            topHotWebSite: null,
            formInput: null,
            checked: true,
            hotNews: {},
            uuid: null,
            loading: false,
            isShowEmpty: true,
            emptyDescription:null
        }
    }

    componentDidMount() {
        new Promise(async (resolve, reject)=>{
            try{
                // const rank = await reqRank()
                const hotWebSite = await reqHotWebSite()
                
                resolve(hotWebSite)
            } catch (error) {
                reject(error)
            } 
        }).then((result) => {
            if (result) {
                // this.setState({isShowRank: true, rankData:result})
                this.setState({isShowHotWebSite: true, hotWebSite: result.hotWebSite})
            }
        })

        new Promise(async (resolve, reject)=>{
            try{
                const topHotWebSite = await reqTopHotWebSite()
                resolve(topHotWebSite)
            } catch (error) {
                reject(error)
            } 
        }).then((result) => {
            if (result) {
                this.setState({isShowTopHotWebSite: true, topHotWebSite: result.topHotWebSite})
            }
        })

    }

    enterLoading = async () => {
        let description = null
        this.setState({loading: true})
        this.state.hotWebSite.map(async (item) => {
            try {
                const data = {
                    url: item.url,
                    parseType: item.pdt_type,
                    search: 1
                }
                const result = await reqCraw(data)
                if (result.status === 0) {
                    description = '《'+item.name+ '》加入爬取队列成功, 正在爬取...' 
                    notification.open({
                        key:this.key,
                        message: '消息通知',
                        description: description,
                        duration: 3
                      });
                }
                                     
            } catch (err){
                message.error(err)
            }
        })
        this.setState({loading: false})

    };

    handleSubmit = (e) => {
        // 阻止默认事件
        e.preventDefault()
        this.props.form.validateFields( async (err, values) => {
            if(!err){
                try {
                    values.parseType = 'news'
                    const result = await reqCraw(values)
                    if (result.code === 0 && result.data && result.data.length > 0){
                        this.setState({
                            uuid: UUID(),
                            hotNews: result.data,
                            isShowEmpty: false
                        })
                    } else {
                        this.setState({
                            isShowEmpty: true,
                            emptyDescription:'未检索到相应的数据'
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
                <h1>SiteParse3新闻聚合系统</h1>
                <p className='lead'>随心所欲，释放你的青春</p>
            </header>
            <div className='sp3-container'>
                
                <Divider />

                <div className='sp3-con-form'>     
                <div>
                <Form  onSubmit={ this.handleSubmit }>
                    
                    <Form.Item>
                        { getFieldDecorator('url', { valuePropName: 'checked', 'rules': [{required: true, message: '检索词不能为空'}]})(
                            <Input className='sp3-form-input' placeholder='实时热点搜索' />
                        )}
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                    </Form.Item>
                    {/* <Form.Item>
                        { getFieldDecorator("parseType", { initialValue: "news" })(
                            <Radio.Group>
                            <Radio value="news">新闻</Radio>
                            <Radio value="vod">点播</Radio>
                            <Radio value="live">直播</Radio>
                            <Radio value="music">音乐</Radio>
                            </Radio.Group>
                        )}  
                    </Form.Item> */}
                </Form>
                </div>
                <div id='content_left'>
                    {this.state.isShowEmpty && <Empty description={this.state.emptyDescription}/>}
                    {this.state.isShowEmpty && this.state.emptyDescription && this.state.uuid !== null && '历史新闻'}
                    <ContentLeft
                        id={this.state.uuid}
                        hotNews={this.state.hotNews}
                    />
                </div>
                </div>
                <div className='sp3-container-rank' >
                    <h4 style={ {marginBottom: 16} }>新闻网站:</h4>
                    <div className=''>
                        { this.state.isShowHotWebSite && this.state.hotWebSite.map((item, i) => {
                            return <MyTag key={i} tagname={item.name} news={item}>{item.name}</MyTag>

                        })}
                    </div>
                    { this.state.isShowHotWebSite && 
                        <Button type="primary" size="small" loading={this.state.loading} onClick={this.enterLoading} block>一键添加</Button>
                    }
                        <h4 style={{ margin: '16px 0' }}>热点网站:</h4>
                    <div>
                        { this.state.isShowTopHotWebSite && this.state.topHotWebSite.map((item, i) => {
                            return <Tag key={i} color={item.color}>{item.name}</Tag>
                        })}
                    </div>
                    
                    <h4 style={{ margin: '16px 0' } }>热点词汇:  <Badge count={0} dot><Icon type="notification" /></Badge></h4>
                    <WordCloud></WordCloud>

                </div>
            </div>
            <footer>
                <Divider />
                <h5>
                    @sp3版权所有
                </h5>
            </footer>
        </div>
    }
}

const SP3Admin = Form.create()(Admin)
export default SP3Admin