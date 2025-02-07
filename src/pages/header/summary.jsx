import React,{useState, useEffect} from 'react'
import { Icon, Dropdown,Divider,Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Sider = () => {
  const items = [
    {
      key: '1',
      label:(
        <a target="_blank" rel="noopener noreferrer" href="#">
          设置
        </a>
      )
    },{
      key: '2',
      label:(
        <a target="_blank" rel="noopener noreferrer" href="#">
          个人中心
        </a>
      )
    },{
      key: '3',
      label:(
        <Divider />
      )
    },{
      key: '4',
      label: (
        <a target="_self" rel="noopener noreferrer" href="logout">
        退出
        </a>
      )
    }
  ];
  const [current, setCurrent] = useState('1');

  const handleClick = e => {
      setCurrent(e.key)
  };

    return (
        <Dropdown menu={{items}} placement="bottomRight">
          <a className="ant-dropdown-link" 
              style={{float:'right', margin: '0 10% 0 010%'}} 
//              onClick={e => e.preventDefault()}
              >
            <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} /> &nbsp;
          </a>
        </Dropdown>
    );
}

export default Sider