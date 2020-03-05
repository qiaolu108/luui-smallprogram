Component({
  externalClasses: ['l-class'],
  properties: {
    // default, primary, text, success, warning, error
    type: {
      type: String,
      value: ''
    },
    // default, large, small
    size: {
      type: String,
      value: ''
    },
    disabled: {
      type: Boolean,
      value: false
    },
    loading: {
      type: Boolean,
      value: false
    },
    long: {
      type: Boolean,
      value: false
    },
    openType: String
  },
  methods: {
  }
})
