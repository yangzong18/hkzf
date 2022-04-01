import React from 'react'
import { NavBar } from 'antd-mobile-v2'
import styles from './index.module.css'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
function NavHeader({ children, history, onLeftClick, className, rightContent }) {
  const defaultHandler = () => history.go(-1)
  return (
    <NavBar icon={<i className="iconfont icon-back" />} className={[styles.navbar, className || ''].join(' ')} mode="light" onLeftClick={onLeftClick || defaultHandler} rightContent={rightContent}>
      {children}
    </NavBar>
  )
}

NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func,
  className: PropTypes.string,
  rightContent: PropTypes.array
}

export default withRouter(NavHeader)
