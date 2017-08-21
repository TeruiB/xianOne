//app.js
App({
  onLaunch: function () {
    // 登录接口
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.getUserInfo({
          success: function (result) {
            var iv = result.iv;
            var encrypted_data = result.encryptedData;        
            wx.request({
              url: 'https://wanda.niowoo.com/api/wechat/login',
              method: 'POST',
              data: {
                code: code,
                iv: iv,
                encrypted_data: encrypted_data,
              },
              success: function (res) {
                console.log(res.data)
                if (res.data.code == 0) {
                  wx.setStorageSync('session_id', res.data.data.session_id);
                  // wx.setStorage({
                  //   key: 'session_id',
                  //   data: res.data.data.session_id,
                  //   success: function () {
                  //     console.log(res.data)
                  //   }
                  // })
                }
              },
              fail: function () {
                console.log('服务器请求失败！')
              }
            });
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null
  }
})
