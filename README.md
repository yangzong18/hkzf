## 好客租房手机端

### 技术

- 前后端分离开发模式，后端服务有 koa+mysql 开发
- 前端使用了`react` 和 `antv-mobile-v2`

### 技术解决

- 采用阿里旗下的 `antd-mobile` 组件库快速开发页面
  - 采用 `react-router-dom` 轻松实现 `SPA` 单页应用程序
  - 采用 `react-virtualized` 组件实现移动端长列表性能优化，保证加载大数据列表时用户使用流畅度
  - 采用 `formik+yup` 实现大型项目中复杂表单的处理
  - 采用 `react-spring` 轻松实现 `React` 动画效果，增加用户体验
  - 采用 `CSS Modules` 技术实现 `CSS` 模块化管理，避免组件间的样式冲突
  - 使用百度地图 `API` 实现可视化找房功能
  - 基于 `RESTful` 风格的数据 `API` 解决方案
  - 采用 `Swagger` 实现 `API` 文档
  - 使用 `JWT` 技术实现登录状态保持

### api 接口地址

- This api url is:https://gitee.com/yangpeng1838/hkzf_api
