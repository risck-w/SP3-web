import React, {Component} from 'react'
import { Tag, message } from 'antd'
import { notification } from 'antd';
import  { reqCraw } from '../api'
const { CheckableTag } = Tag;


export default class MyTag extends Component {

    constructor(props){
        super(props)
        this.state = { 
            checked: false,
            tagname: props.tagname,
            news: props.news,
            showMsg: false

        };
    }

    key = 'updatable';

    handleChange = async (checked) => {
        let description = null
        if (!this.state.showMsg){
            if (checked){
                const news = this.state.news
                const data = {
                    url: news.url,
                    parseType: news.pdt_type,
                    search: 1
                }
                const result = await reqCraw(data)
                if (result.status === 1) {
                    description = '《'+this.state.tagname+ '》加入爬取队列成功, 正在爬取...'
                    notification.open({
                        key:this.key,
                        message: '消息通知',
                        description: description,
                        duration: 1.5
                      });
                }
            }
            
        }
        this.setState({ checked });
    };

    render() {
        return (
            <CheckableTag {...this.props} checked={this.state.checked} onChange={this.handleChange} />
        );
    }
}