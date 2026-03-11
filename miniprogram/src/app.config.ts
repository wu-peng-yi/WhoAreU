export default {
  pages: [
    'pages/index/index',
    'pages/card/card',
    'pages/history/history',
    'pages/shop/shop'
  ],
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#8B5CF6',
    navigationBarTitleText: '今天演谁',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#8B5CF6',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/history/history',
        text: '历史'
      },
      {
        pagePath: 'pages/shop/shop',
        text: '商店'
      }
    ]
  }
}
