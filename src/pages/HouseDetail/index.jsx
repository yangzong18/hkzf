import { Carousel, Flex } from 'antd-mobile-v2'
import React, { Component } from 'react'
import HousePackage from '../../components/HousePackage'
import NavHeader from '../../components/NavHeader'
import { request } from '../../utils/request'
import { BASE_URL } from '../../utils/url'

import styles from './index.module.css'

// 百度地图
const BMap = window.BMapGL
const labelStyle = {
  position: 'absolute',
  zIndex: -7982820,
  backgroundColor: 'rgb(238, 93, 91)',
  color: 'rgb(255, 255, 255)',
  height: 25,
  padding: '5px 10px',
  lineHeight: '14px',
  borderRadius: 3,
  boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
  whiteSpace: 'nowrap',
  fontSize: 12,
  userSelect: 'none'
}
export default class HouseDetail extends Component {
  state = {
    isLoading: false,
    houseInfo: {
      houseImg: [],
      title: '',
      tags: [],
      price: 0,
      roomType: '两室一厅',
      size: 89,
      // 装修类型
      renovation: '精装',
      // 朝向
      oriented: [],
      floor: '',
      community: '',
      coord: {
        latitude: '39.928033',
        longitude: '116.529466'
      },
      // 房屋配套
      supporting: [],
      // 房屋标识
      houseCode: '',
      description: ''
    },
    isFavorite: false
  }
  componentDidMount() {
    this.getHouseDetail()
  }
  async getHouseDetail() {
    const { id } = this.props.match.params
    this.setState({
      isLoading: true
    })
    const { data } = await request.get(`/houses/${id}`)
    this.setState({
      houseInfo: data.body,
      isLoading: false
    })
    const { community, coord } = data.body
    this.renderMap(community, coord)
  }
  // 渲染地图
  renderMap = (community, coord) => {
    const { latitude, longitude } = coord
    const map = new BMap.Map('map')
    const point = new BMap.Point(longitude, latitude)
    map.centerAndZoom(point, 17)

    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(0, -36)
    })
    label.setStyle(labelStyle)
    label.setContent(`
       <span>${community}</span>
      <div class="${styles.mapArrow}"></div>
    `)
    map.addOverlay(label)
  }
  // 轮播图渲染
  renderSwiper() {
    const { houseInfo } = this.state
    return houseInfo.houseImg.map(item => (
      <a key={item}>
        <img src={BASE_URL + item} alt={item} />
      </a>
    ))
  }
  // 渲染标签
  renderTags() {
    const {
      houseInfo: { tags }
    } = this.state
    return tags.map((item, index) => {
      let tagClass = ''
      if (index > 2) {
        tagClass = 'tag3'
      } else {
        tagClass = 'tag' + (index + 1)
      }
      return (
        <span key={item} className={[styles.tag, styles[tagClass]].join(' ')}>
          {item}
        </span>
      )
    })
  }
  render() {
    const {
      isLoading,
      houseInfo: { community, title, price, roomType, size, floor, oriented, supporting }
    } = this.state
    return (
      <div className={styles.root}>
        {/* 导航栏 */}
        <NavHeader className={styles.navHeader} rightContent={[<i key="share" className="iconfont icon-share" />]}>
          {community}
        </NavHeader>
        {/* 轮播图 */}
        <div className={styles.slides}>
          {!isLoading ? (
            <Carousel autoplay infinite autoplayInterval={3000}>
              {this.renderSwiper()}
            </Carousel>
          ) : (
            ''
          )}
        </div>
        {/* 房租基础信息 */}
        <div className={styles.info}>
          <h3 className={styles.infoTitle}>{title}</h3>
          <Flex className={styles.tags}>
            <Flex.Item>{this.renderTags()}</Flex.Item>
          </Flex>
          <Flex className={styles.infoPrice}>
            <Flex.Item className={styles.infoPriceItem}>
              <div>
                {price}
                <span className={styles.month}>/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{roomType}</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{size}平米</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoBasic} align="start">
            <Flex.Item>
              <div>
                <span className={styles.title}>装修：</span>
                精装
              </div>
              <div>
                <span className={styles.title}>楼层：</span>
                {floor}
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                <span className={styles.title}>朝向：</span>
                {oriented.join('、')}
              </div>
              <div>
                <span className={styles.title}>类型：</span>
                普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>
        {/* 地图位置 */}
        <div className={styles.map}>
          <div className={styles.mapTitle}>
            小区：<span>{community}</span>
          </div>
          <div className={styles.mapContainer} id="map">
            地图
          </div>
        </div>
        {/* 房屋配套 */}
        <div className={styles.about}>
          <div className={styles.houseTitle}>房屋配套</div>
          {supporting.length === 0 ? <div className={styles.titleEmpty}>暂无数据</div> : <HousePackage list={supporting} />}
        </div>
      </div>
    )
  }
}
