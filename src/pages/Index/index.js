import React from 'react'
// 导入组件
import { Carousel, Flex,Grid,WingBlank } from 'antd-mobile-v2';
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
import './index.scss'
import axios from 'axios'

import { getCurrentCity } from '../../utils';

const navItems = [
  {
    id: 1,
    img: nav1,
    title: '整租',
    path:'/home/list'
  },
  {
    id: 2,
    img: nav2,
    title: '合租',
    path:'/home/list'
  },
  {
    id: 3,
    img: nav3,
    title: '地图找房',
    path:'/map'
  },
  {
    id: 4,
    img: nav4,
    title: '去出租',
    path:'/rent'
  },


]

// 获取地址位置信息
// navigator.geolocation.getCurrentPosition(position => {
//   console.log('当前位置信息：', position)
// })

export default class Index extends React.Component {
  state = {
    // 轮播图状态
    swiper: [],
    isSwipperLoad: false,
    
    groups: [],
    news: [],
    curCityName:'上海'
  }
  async getSwippers () {
    const res = await axios.get('http://localhost:8080/home/swiper')
    this.setState({
      swiper: res.data.body,
      isSwipperLoad:true
    })
  }

  async getGroups () {
    const res = await axios.get('http://localhost:8080/home/groups', {
      params: {
      area:'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    this.setState((state, props) => {
      return {
        groups:res.data.body
      }
    })
  }

  async getNews () {
    const res = await axios.get('http://localhost:8080/home/news', {
      params: {
      area:'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    this.setState((state, props) => {
      return {
        news:res.data.body
      }
    })
  }

  async getCurrentCity () {
    const curCity = await getCurrentCity()
     this.setState((state, props) => {
        return {
          curCityName:curCity.label
        }
      })
    
  }
  componentDidMount () {
    // 获取轮播图数据
    this.getSwippers();
    // 获取租房小组数据
    this.getGroups()
    // 获取最新咨询
    this.getNews()
    // 获取当前的城市
    this.getCurrentCity()
  }
  renderSwipper () {
    return this.state.swiper.map(item => (
            <a
              key={item.id}
              href="http://itcast.cn"
              style={{ display: 'inline-block', width: '100%', height: 212 }}
            >
              <img
                src={`http://localhost:8080${item.imgSrc}`}
                alt={item.alt}
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({ imgHeight: 'auto' });
                }}
              />
            </a>
          ))
  }
  renderNav () {
    return navItems.map(item => (
      <Flex.Item key={item.id} onClick={()=>this.props.history.push(item.path)}>
        <img src={item.img} alt={item.title} />
        <h2>{item.title} </h2>
      </Flex.Item>
    ))
  }

  renderGroups () {
    return (
        <div className="group">
          <h3 className="group-title">租房小组<span className="more">更多</span></h3>
          <Grid columnNum={2} data={this.state.groups} activeStyle={true} hasLine={false} square={false}
          renderItem={item => (
            <Flex className="group-item" justify="around" key={item.id}>
              <div className="desc">
                <p className="title">{item.title}</p>
                <span className="info">{item.desc}</span>
              </div>
              <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
            </Flex>
          )}
          ></Grid>
        </div>
    )
  }

  renderNews () {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
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
      <div className='index'>
        {/* 轮播图 */}
        <div className='swipper'>
          { this.state.isSwipperLoad ? (<Carousel
            autoplay
            infinite
            autoplayInterval={1000}
          >
            {this.renderSwipper()}
          </Carousel>) : ("")}
          
          {/* 搜索框 */}
          <Flex className='search-box'>
            <Flex className='search'>
              <div className="location" onClick={()=>this.props.history.push('/citylist')}>
                <span className="name">{this.state.curCityName}</span>
                <i className="iconfont icon-arrow"></i>
              </div>

              <div className="form"  onClick={()=>this.props.history.push('/search')}>
                <i className="iconfont icon-seach"></i>
                <span className="text">请输入小区</span>
              </div>
            </Flex>
            <i className='iconfont icon-map'  onClick={()=>this.props.history.push('/map')}></i>
          </Flex>
        </div>
        {/* 导航菜单 */}
        <Flex className='nav'>
          {this.renderNav()}
        </Flex>
        {/* 租房小组 */}
        {this.renderGroups()}
        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    );
  }
}





