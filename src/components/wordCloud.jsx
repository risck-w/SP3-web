import React, {Component} from 'react'
import 'echarts-wordcloud'
import ReactEcharts from 'echarts-for-react'
import {reqWordCloud} from '../api'

export default class WordCloud extends Component {
    constructor(props){
        super(props)
        this.state = {
            wordCloud: []
        }
        this.timer()
        setInterval(this.timer.bind(this), 100000)
    }

    getWordCloud(){
        return new Promise(async (resolve, reject) => {
            try{
                const wordCloud = await reqWordCloud()
                resolve(wordCloud)
            } catch (error) {
                reject(error)
            } 
        })
    }

    shouldComponentUpdate(nextProps, nextState){
        if (nextState !== this.state){
            return true
        }
        return false
    }

    timer(){
        this.getWordCloud().then((result) => {       
            if (result) {
                this.setState({wordCloud: result.wordCloud})
            }
        })
    } 

    wordCloudOption(){
        let option = {
            backgroundColor: "rgba(21, 20, 13, 0)",
            tooltip: {
              pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
            },
            series: [
              {
                type: "wordCloud",
                gridSize: 1,
                sizeRange: [12, 55],
                rotationRange: [-45, 0, 45, 90],
                layoutAnimation:true,
                textStyle: {
                  normal: {
                    color: function () {
                      return (
                        "rgb(" +
                        Math.round(Math.random() * 255) +
                        ", " +
                        Math.round(Math.random() * 255) +
                        ", " +
                        Math.round(Math.random() * 255) +
                        ")"
                      );
                    }
                  }
                },
                left: "center",
                top: "center",
                //color: '#fff',
                right: null,
                bottom: null,
                width: "90%",
                height: "110%",
                data: this.state.wordCloud
              }
            ]
          };
        return option;
    }

    render(){
        return <div>
            <ReactEcharts
            option={this.wordCloudOption()}
            theme='ThemeStyle'
            />
        </div>
    }
}