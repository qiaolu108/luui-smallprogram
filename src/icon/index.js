Component({
  externalClasses: ['l-class'],
  properties: {
    // 原生icon 的type 类型，可以使用小程序原生自带的图表
    type: {
      type: String,
      value: ''
    },
    // 图标大小
    size: {
      type: Number,
      value: 14
    },
    // 图标颜色
    color: {
      type: String,
      value: ''
    },
    // 自定义图标
    custom: {
      type: String,
      value: ''
    }
  }
})
