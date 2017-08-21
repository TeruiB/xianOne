// pages/Registration/Registration.js
Page({
  data: {
    number: [

    ]
  },
  onLoad: function () {
    var that = this;
    var all_race_codes = wx.getStorageSync('all_race_codes');
    console.log(all_race_codes);
    if (all_race_codes) {
      for (var i = 0; i < all_race_codes.length; i++) {
        that.data.number.push(all_race_codes[i]);
      }
      this.setData({
        number: that.data.number
      })
    }
  },
  personage: function () {
    wx.redirectTo({
      url: '/pages/personage/personage',
    })
  },
  index: function () {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  }
})