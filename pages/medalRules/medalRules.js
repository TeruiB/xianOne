// pages/medalRules/medalRules.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    medals: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
    var _this = this;
    var session_id = wx.getStorageSync('session_id');
    wx.request({
      url: 'https://wanda.niowoo.com/api/knight/medalsrule',
      method: 'POST',
      data: {
        session_id: session_id,
      },
      success: (res) => {
        console.log(res);
        _this.setData({
          medals: res.data.data.medals,
        })
      }
    })
  },

})