import React, { lazy } from 'react'

// 导入 TabBar
import { TabBar } from 'antd-mobile-v2'
import './index.css'
import { Route } from 'react-router-dom'
import Index from '../Index'

const News = lazy(() => import('../News'))
const Profile = lazy(() => import('../Profile'))
const HouseList = lazy(() => import('../HouseList'))
const tabItems = [
  {
    title: '首页',
    path: '/home',
    icon: 'icon-ind'
  },
  {
    title: '找房',
    path: '/home/list',
    icon: 'icon-findHouse'
  },
  {
    title: '资讯',
    path: '/home/news',
    icon: 'icon-infom'
  },
  {
    title: '我的',
    path: '/home/profile',
    icon: 'icon-my'
  }
]
export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: this.props.location.pathname
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }
  renderTabItems() {
    return tabItems.map(item => (
      <TabBar.Item
        title={item.title}
        key={item.title}
        icon={<i className={`iconfont ${item.icon}`} />}
        selectedIcon={<i className={`iconfont ${item.icon}`} />}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.props.history.push(item.path)
        }}
        data-seed="logId"
      ></TabBar.Item>
    ))
  }
  render() {
    return (
      <div className="home">
        <Route path="/home/news" component={News} />
        <Route path="/home/list" component={HouseList} />
        <Route exact path="/home" component={Index} />
        <Route path="/home/profile" component={Profile} />
        <TabBar tintColor="#21B97A" barTintColor="white" noRenderContent={true}>
          {this.renderTabItems()}
        </TabBar>
      </div>
    )
  }
}
