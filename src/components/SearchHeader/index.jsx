import { Flex } from 'antd-mobile-v2'
import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './index.scss'
function SearchHeader({ cityName, className, history }) {
  return (
    <Flex className={['search-box', className || ''].join(' ')}>
      <Flex className="search">
        <div className="location" onClick={() => history.push('/citylist')}>
          <span className="name">{cityName}</span>
          <i className="iconfont icon-arrow"></i>
        </div>

        <div className="form" onClick={() => history.push('/search')}>
          <i className="iconfont icon-seach"></i>
          <span className="text">请输入小区</span>
        </div>
      </Flex>
      <i className="iconfont icon-map" onClick={() => history.push('/map')} />
    </Flex>
  )
}
// 添加属性校验
SearchHeader.propTypes = {
  cityName: PropTypes.string.isRequired,
  className: PropTypes.string
}
export default withRouter(SearchHeader)
