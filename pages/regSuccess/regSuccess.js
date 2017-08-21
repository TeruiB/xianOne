Page({
  data: {
    number: [
      
    ]
  },
  onLoad: function() {
    var that = this;
    var race_codes = wx.getStorageSync('race_codes');
    if(race_codes) {
      for(var i=0;i<race_codes.length;i++){
        that.data.number.push(race_codes[i]);       
      }
      this.setData({
        number: that.data.number
      })
    }
  },
  personage: function() {
    wx.redirectTo({
      url: '/pages/personage/personage',
    })
  },
  index: function() {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  }
})