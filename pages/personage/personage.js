Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    nickName: '',
    avatar_url: '',
    medal_amount_user_got: '',
    medal_amount: '',
    status: 1, 
  },
  onLoad: function () {
    var _this = this;
    var session_id = wx.getStorageSync('session_id');
    wx.request({
      url: 'https://wanda.niowoo.com/api/knight/index',
      method: 'POST',
      data: {
        session_id: session_id
      },
      success: function (res) {
        // console.log(res)
        _this.setData({
          nickName: res.data.data.nickname,
          avatar_url: res.data.data.avatar_url,
          medal_amount_user_got: res.data.data.medal_amount_user_got,
          medal_amount: res.data.data.medal_amount
        })
      },
      fail: function () {
        console.log('获取失败');
      }
    })
  },
  continueReg: function () {
    wx.navigateTo({
      url: '/pages/continueReg/continueReg',
    })
  },
  perMedal: function () {
    wx.navigateTo({
      url: '/pages/perMedal/perMedal',
    })
  },
  notice: function () {
    wx.navigateTo({
      url: '/pages/notice/notice',
    })
  },
  Registration: function() {
    wx.navigateTo({
      url: '/pages/Registration/Registration',
    })
  },
  game: function() {
    var _this = this;
    var session_id = wx.getStorageSync('session_id');
    var status = _this.data.status;
    wx.request({
      url: 'https://wanda.niowoo.com/api/knight/race',
      method: 'POST',
      data: {
        session_id: session_id,
        status: status,
      },
      success: (res) => {
        if(res.data.code == 0) {
          wx.redirectTo({
            url: '/pages/navigation/navigation',
          })
        }
      }
    })
  }
})