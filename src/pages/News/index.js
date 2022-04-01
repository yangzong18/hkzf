import React from 'react'
import { Flex, WingBlank } from 'antd-mobile-v2'
import { request } from '../../utils/request.js'
import { BASE_URL } from '../../utils/url.js'
export default class News extends React.Component {
  state = {
    // 最新资讯
    news: []
  }
  async componentDidMount() {
    this.getNews()
  }
  // 获取最新资讯
  async getNews() {
    const res = await request.get('/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
    this.setState({
      news: res.data.body
    })
  }
  // 渲染最新资讯
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img className="img" src={BASE_URL + item.imgSrc} alt="" />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }
  render() {
    return (
      <div className="news">
        <h3 className="group-title">最新资讯</h3>
        <WingBlank size="md">{this.renderNews()}</WingBlank>
      </div>
    )
  }
}
