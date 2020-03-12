// 参考教程  https://www.jianshu.com/p/2b7484a9c3a6
const app = getApp()
Component({
  externalClasses: ['l-class'],
  options: {
    multipleSlots: true
  },
  properties: {
    // 导航栏背景色， 默认黑色
    bgColor: {
      type: String,
      value: '#ffffff'
    },
    // 导航栏标题
    title: {
      type: String,
      value: ''
    },
    // 导航栏标题颜色，和返回按钮颜色, 默认黑色
    color: {
      type: String,
      value: '#000000'
    },
    // 是否显示返回按钮, 默认显示
    showBack: {
      type: Boolean,
      value: true
    },
    // 是否显示取消按钮
    showCancel: {
      type: Boolean,
      value: false
    },
    // 控制是否有顶部padding,默认是有
    hastop: {
      type: Boolean,
      value: true
    },
    // 导航栏背景图
    bgsrc: {
      type: String,
      value: ''
    },
    // 显示顶部搜索框
    showSearch: {
      type: Boolean,
      value: false
    }
  },
  data: {
    statusBarHeight: 0,
    navBarHeight: 0
  },
  ready () {
    let {statusBarHeight, navBarHeight} = app.globalData;
    this.setData({
      statusBarHeight,
      navBarHeight
    })
    // 如果背景色不是白色 要设置状态栏文字颜色为白色
    const { bgColor } = this.properties
    if (bgColor !== '#fff' && bgColor !== '#ffffff' && bgColor !== 'white') {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: 'red',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    } else {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: 'red',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }
  },
  methods: {
    handleBack () {
      wx.navigateBack({
        delta: 1
      })
    },
    // 监听搜索框输入文字
    handleInput ({ detail = {} } = {}) {
      this.triggerEvent('onInput', detail)
    },
    // 搜索框失去焦点
    handleBlur ({ detail = {} } = {}) {
      this.triggerEvent('onBlur', detail)
    },
    // 搜索框获取焦点
    handleFocus ({ detail = {} } = {}) {
      this.triggerEvent('onFocus', detail)
    }
  }
})
