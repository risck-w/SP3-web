import React from 'react'
import { Carousel, Timeline, Spin } from 'antd'
import './timeLine.less'


function Rank(props) {
    const isShowRank = props.props.isShowRank
    const rankData = props.props.rankData
    let timeLineItem
    let timeLine = []
    if (rankData && isShowRank) {
        rankData.pdt_type.forEach(element => {
            timeLineItem = rankData.data.map(item => {
                if (item.pdt_type === element) {
                    return <Timeline.Item key={item._id.$oid}>{item.name}</Timeline.Item>
                }
                return null
            })
            timeLine.push(<div key={element}><p /><Timeline>{timeLineItem}</Timeline></div>)

        })
    }

    if (isShowRank) {
        return <Carousel className='sp3-container-carousel' autoplay >{timeLine}</Carousel>
    } else {
        return <div className='sp3-rank-spin'><Spin /></div>
    }
}

export default Rank