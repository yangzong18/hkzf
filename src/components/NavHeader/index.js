import React from 'react'
import { NavBar } from 'antd-mobile-v2'
import './index.scss'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
function NavHeader({ children, history, onLeftClick }) {
  const defaultHandler = () => history.go(-1)
  return (
    <NavBar className="navbar" mode="light" icon={<i className="iconfont icon-back"></i>} onLeftClick={onLeftClick || defaultHandler}>
      {children}
    </NavBar>
  )
}

NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func
}

export default withRouter(NavHeader)
