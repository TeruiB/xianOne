// pages/popup/popup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 4,
    testData: null,  
    medal: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    // console.log(options.extra);
    _this.data.testData = JSON.parse(options.extra);
    console.log(_this.data.testData);
    _this.setData({
      medal: _this.data.testData.data.data.medal,
    })   
    // var medal = wx.getStorageSync('medal');
    // console.log(medal);
    // _this.setData({
    //   medal: medal
    // })
    // var status = _this.data.status;
    // wx.request({
    //   url: 'https://wanda.niowoo.com/api/knight/race',
    //   method: 'POST',
    //   data: {
    //     session_id: session_id,
    //     status: status
    //   },
    //   success: function (res) {
    //     console.log(res);
    //     _this.setData({
    //       medal: res.data.data.medal,
    //     });
    //   }
    // })
  },
  goToPerMedal:function(e){
    wx.redirectTo({
      url:'/pages/perMedal/perMedal'
    })
  }

})