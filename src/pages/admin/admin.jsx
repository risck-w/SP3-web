import React, { useEffect, useState, use } from 'react'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom'
import { Divider, Form, Radio, Badge, Icon, Empty, Button, Input} from 'antd'
import { message, Tag } from 'antd'
import { notification } from 'antd'
import './admin.less'
import { reqCraw, reqHotWebSite, reqTopHotWebSite, reqAIAgentSearch, FetchAIContent, PostFetchAIContent } from '../../api'
import UUID from '../../utils/baseUtils.jsx'
import ContentLeft from './content'
import AIContentLeft from './AIcontent'
import MyTag from '../../components/tag'
import WordCloud from '../../components/wordCloud'
import Header from '../header/header'


const SP3Admin = () => {

    const [form] = Form.useForm()

    const [isShowRank, setIsShowRank] = useState(false)
    const [rankData, setRankData] = useState(null)
    const [isShowHotWebSite, setIsShowHotWebSite] = useState(false)
    const [hotWebSite, setHotWebSite] = useState(null)
    const [isShowTopHotWebSite, setIsShowTopHotWebSite] = useState(false)
    const [topHotWebSite, setTopHotWebSite] = useState(null)
    const [formInput, setFormInput] = useState(null)
    const [checked, setChecked] = useState(true)
    const [hotNews, setHotNews] = useState({})
    const [uuid, setUuid] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isShowEmpty, setIsShowEmpty] = useState(true)
    const [emptyDescription, setEmptyDescription] = useState(null)
    const [ai_content, setAi_Content] = useState(null)

    useEffect(() => {
        
        new Promise(async (resolve, reject)=>{
            try{
                const htb = await reqHotWebSite()
                resolve(htb)
            } catch (error) {
                reject(error)
            } 
        }).then((result) => {
            if (result) {
                setHotWebSite(result.hotWebSite)
                setIsShowHotWebSite(true)
            }
        })
        
        new Promise(async (resolve, reject)=>{
            try{
                const thws = await reqTopHotWebSite()
                resolve(thws)
            } catch (error) {
                reject(error)
            } 
        }).then((result) => {
            if (result) {
                setTopHotWebSite(result.topHotWebSite)
                setIsShowTopHotWebSite(true)
            }
        })
        
    },[])

    const enterLoading = async () => {
        let description = null
        setLoading(true)
        hotWebSite.map(async (item) => {
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
        setLoading(false)

    };

    const handleSubmit = (e) => {
        // 阻止默认事件
        //e.preventDefault()
        function delay(time) {
            return new Promise(resolve => setTimeout(resolve, time));
          }
        form.validateFields({url: 'url',parseType:'parseType'}).then(async (values) => {
            if (values.parseType === 'news' || values.parseType === 'website' ) {
                const result = await reqCraw(values)
                setLoadings(false);
                if (result.code === 0 && result.data && result.data.length > 0){
                    setUuid(UUID())
                    setHotNews(result.data)
                    setIsShowEmpty(false)
                            
                } else {
                    setIsShowEmpty(true)
                    setEmptyDescription('未检索到相应的数据')
                }
            } else {
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        "Cache-Control": "no-cache"
                      },
                    body: values
                }
                
                const AI_Search = await PostFetchAIContent(values,options)
                const reader = AI_Search.body.getReader();
                let decoder = new TextDecoder();
                let resultData = ''; 
                while (true) {
                    const {done, value} = await reader.read();
                    setLoadings(false);
                    if (done) {

                        break;
                    }
                    const resultArray = decoder.decode(value).split('\n').filter(line => line.trim() !== 'event:answer' && line.trim() !== '')
                    resultArray.pop()
                    for (const line of resultArray){
                        const jsonStartIndex = line.indexOf('data:') + 5
                        const jsonData = JSON.parse(line.slice(jsonStartIndex, line.length))
                        if (jsonData.message && jsonData.message.length > 0) {
                            resultData += jsonData.message
                        }
                        setAi_Content(resultData)
                        setIsShowEmpty(false)
                        await delay(15)
                    }
                }
                
                
                /*
                PostFetchAIContent(values,options).then(async AI_Search => {
                    const reader = AI_Search.body.getReader();
                    let decoder = new TextDecoder();
                    let resultData = '';
                    
                    while (true) {
                        const {done, value} = await reader.read()
                        if (done) {
                            console.log('break')
                            break;
                        }
                        resultData += decoder.decode(value)
                        console.log(decoder.decode(value))
    
                    }
                    setAi_Content(resultData)
                    setIsShowEmpty(false)
                })
                */
            }
            
        }).catch(error => {
            if (error){
                console.log(error)
            }
        })
    }

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo)
    }

    const [loadings, setLoadings] = useState(false);
    const buttonEnterLoading = (prevLoadings) => {
        setLoadings(prevLoadings);
        if (prevLoadings === true){
            setTimeout(() => {
                setLoadings(false);
                }, 30000);
        }
    };


    const user = storageUtils.getUser()
    // 如果内存中没存储user ==> 当前没有登录
    if (!user || !user.token) {
        // 自动跳转到登录界面（在render中）
        return <Redirect to='/login'/>
    }

    return <div className='container'>
        <Header></Header>
        <div className='sp3-container'>
            
            <Divider />

            <div className='sp3-con-form'>     
            <div>
            <Form name="basic" form = {form} onFinish={ handleSubmit } onFinishFailed={onFinishFailed} autoComplete="off">
                
                <Form.Item name="url" rules={[{required: true, message: '检索词不能为空', wrapperCol:{span:12}}]}>
                    <Input className='sp3-form-input' placeholder='实时热点搜索' />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loadings} onClick={()=> buttonEnterLoading(true)}>
                        搜索
                    </Button>
                </Form.Item>
                <Form.Item name='parseType' initialValue='AIcontent'>
                        <Radio.Group className='sp3-radio'>
                        <Radio value="AIcontent">AI</Radio>
                        <Radio value="news" color='white'>新闻</Radio>
                        <Radio value="website">网站</Radio>
                        </Radio.Group> 
                </Form.Item>
            </Form>
            </div>
            <div id='AI_content_left'>
                <AIContentLeft
                    ai_content={ai_content}
                />
            </div> 
            <div id='content_left'>
                {isShowEmpty && <Empty description={emptyDescription}/>}
                {isShowEmpty && emptyDescription && uuid !== null && '历史新闻'}
                <ContentLeft
                    id={uuid}
                    hotNews={hotNews}
                />
            </div>
            </div>
            
            <div className='sp3-container-rank' >
                <h4 style={ {marginBottom: 16} }>新闻网站:</h4>
                <div className=''>
                    { isShowHotWebSite && hotWebSite.map((item, i) => {
                        return <MyTag key={i} tagname={item.name} news={item}>{item.name}</MyTag>

                    })}
                </div>
                 { isShowHotWebSite && 
                    <Button type="primary" size="small" loading={loading} onClick={enterLoading} block>一键添加</Button>
                }
                    <h4 style={{ margin: '16px 0'}}>热点网站:</h4>
                <div>
                    { isShowTopHotWebSite && topHotWebSite.map((item, i) => {
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

export default SP3Admin