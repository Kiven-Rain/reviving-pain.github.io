/*
* @Author: Reviving-Pain-Laptop
* @Date:   2018-07-24 19:19:49
 * @Last Modified by: Reviving-Pain-Laptop
 * @Last Modified time: 2018-10-10 23:56:06
*/

export var navSidebarData = [
  {
    menu: 'CnodeJS社区',
    path: '/cnodeCommunity',
    subTabs: [
      { subMenu: '社区主页', path: '/cnodejsTopic', iconMark: 'fa-home' },
      { subMenu: '发布话题', path: '/createTopic', iconMark: 'fa-pencil-square' },
      { subMenu: '个人中心', path: '/profile', iconMark: 'fa-user-circle-o' }
    ]
  },
  {
    menu: 'Mock数据测试',
    path: '/mockDataTest',
    subTabs: [
      { subMenu: '获取数据', path: '/getMockdata', iconMark: 'fa-database' }
    ]
  },
  { menu: '缺省一级菜单', path: '/tabMenu' }
]
