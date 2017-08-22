// pages/perMedal/perMedal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar_url: '', // 用户信息头像
    nickname: '',   // 用户信息昵称
    medal_amount: '', // 勋章总数
    medal_amount_user_got: '',  // 勋章获得数量
    phone: '',  // 手机号
    medals:[],  // 存储勋章图片和名称信息
    showMedals: true, // 判断有无勋章
    Medalss: false, // 判断勋章的显示
  }, 
  onLoad: function(res) {
    var _this = this; // 改变指向
    var session_id = wx.getStorageSync('session_id'); // 获取本地个人信息的身份证
    wx.request({
      url: 'https://wanda.niowoo.com/api/knight/mymedals', 
      method: 'POST',
      data: {
        session_id: session_id // 发送给后台的请求参数
      },
      success: function(res) {
        console.log(res);
        _this.setData({
          nickname: res.data.data.nickname, 
          avatar_url: res.data.data.avatar_url,
          medal_amount_user_got: res.data.data.medal_amount_user_got,
          medal_amount: res.data.data.medal_amount,
          phone: res.data.data.phone,
          medals: res.data.data.medals
        })
        if (res.data.data.medals.length == 0){
          _this.setData({
            showMedals: true,
            Medalss: false,
          })
        }else{
          console.log(33);
          _this.setData({
            showMedals: false,
            Medalss: true,
          })
        }
      }
    })
  },
  medalRules: function() {
    wx.navigateTo({
      url: '/pages/medalRules/medalRules',
    })
  },
  prizePublicity: function() {
    wx.navigateTo({
      url: '/pages/prizePublicity/prizePublicity',
    })
  }
})