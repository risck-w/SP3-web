import React, {Component} from 'react'
import './AIcontent.less'
import Markdown from 'react-markdown'


export default class AIContentLeft extends Component {
    constructor(props){
        super(props)
        this.state = {
            ai_content: '' //接口数据
        }
    }
    delay = function(time) {
        return new Promise(resolve => setTimeout(resolve, time));
      }

    UNSAFE_componentWillReceiveProps(nextprops) {
        if (nextprops.ai_content){
            this.delay(50)
            //const lines = nextprops.ai_content
            this.setState({
                ai_content: nextprops.ai_content
            })
            
        }
        
    }


    render(){
        /*
        return <div>
            <div className='c-container'>
                    <h3>{this.state.ai_content}</h3>
                </div>
        </div>
        */
        //const [rows, setRows] = useState(2);
        //const [expanded, setExpanded] = useState(false);

        return (
            <div>
            <div className='c-container'>
                    <Markdown>{ 
                        this.state.ai_content
                    }</Markdown>
                </div>
        </div>
        );
    
    }

}