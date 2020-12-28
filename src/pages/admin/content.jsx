import React, {Component} from 'react'
import {UUID} from '../../utils/baseUtils'
import './content.less'
import {Pagination} from 'antd'
import _ from 'lodash'


export default class ContentLeft extends Component {
    constructor(props){
        super(props)
        this.state = {
            uuid: UUID(), // 唯一标识
            hotNews: [], //接口数据
            pageNumber: 0
        }
    }

    UNSAFE_componentWillReceiveProps(nextprops) {
        if (this.state.uuid !== nextprops.id) {
            this.setState({
                uuid: nextprops.id,
                hotNews: nextprops.hotNews
            })
        } 
    }

    onChange = (pageNumber) => {
        if (pageNumber-1 !== this.state.pageNumber) {
            this.setState({
                pageNumber: pageNumber -1
            })
        }
    }

    render(){
        let size = 15
        return <div>
            { this.state.hotNews.length > 0 && _.chunk(this.state.hotNews, size)[this.state.pageNumber].map((item, i)=> {
                return <div key={i} className='c-container'>
                    <h3><a href={item.url} className="t">{item.title}</a></h3>
                
                </div>

            }) }

            <Pagination 
                showQuickJumper 
                pageSize={size} 
                defaultCurrent={1} 
                total={this.state.hotNews.length} 
                onChange={this.onChange} 
                hideOnSinglePage={true}
            />
            <br/>
        </div>
    
    }

}