import React from 'react'
import { BrowserRouter as Router, Route,Redirect } from 'react-router-dom'

// 导入首页和城市选择两个组件（页面）
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'

function App() {
  return (
    <Router>
      <div className="App">
        {/* 默认路由，直接跳转到home */}
        <Route path="/" exact render={()=><Redirect to="/home" />}/>
        {/* 配置路由 */}
        <Route exact={false} path="/home" component={Home} />
        <Route exact={false} path="/citylist" component={CityList} />
        <Route exact={false} path="/map" component={Map} />
      </div>
    </Router>
  )
}
export default App
