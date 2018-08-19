/*
* @Author: Reviving-Pain-Laptop
* @Date:   2018-07-24 19:19:49
* @Last Modified by:   Reviving-Pain-Laptop
* @Last Modified time: 2018-07-25 19:25:25
*/

export var navSidebarData = [
  {
    menu: '调用公共接口',
    path: '/getPublicApi',
    subTabs: [
      { subMenu: '服务器请求', path: '/serverRequest' },
      { subMenu: '用户', path: '/user' },
      { subMenu: '文章详情', path: '/article' },
      { subMenu: '瀑布流', path: '/waterfallFlow' }
    ]
  },
  {
    menu: 'animation',
    path: '/animation',
    subTabs: [
      { subMenu: 'css3动画', path: '/css3Animation' },
      { subMenu: 'SVG动画', path: '/svgAnimation' },
      { subMenu: 'canvas动画', path: '/canvasAnimation' }
    ]
  },
  {
    menu: '数据验证',
    path: '/dataVerify',
    subTabs: [
      { subMenu: '一般输入验证 ', path: '/inputVerify' },
      { subMenu: '表单验证 ', path: '/formVerify' }
    ]
  },
  {
    menu: '添加与移除标签',
    path: '/modifyTags',
    subTabs: [
      { subMenu: '添加标签', path: '/addTag' },
      { subMenu: '移除标签', path: '/delTag' }
    ]
  },
  { menu: '轮播图', path: '/silder' }
]
