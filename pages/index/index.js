//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '',
    userInfo: {},
    name: '',
  },
  onLoad: function() {

  },
  //事件处理函数
  beforelogin: function() {
    wx.navigateTo({
      url: '../beforelogin/beforelogin'
    })
  },
  personage: function() {
    var _this = this;
    var session_id = wx.getStorageSync('session_id');
    wx.request({
      url: 'https://wanda.niowoo.com/api/signup/datesselected',
      method: 'POST',
      data: {
        session_id: session_id
      },
      success: (res) => {
        // console.log(res);
        _this.setData({
          // name: res.data.data.name,
        })
        if(res.data.code == 6){
          // console.log(1);
          wx.navigateTo({
            url: '/pages/weiboBinding/weiboBinding',
          })
        }else{
          wx.navigateTo({
            url:  '/pages/personage/personage',
          })
        }
      },
      fail: (res) => {
        console.log(res);
      }
    })
    
  },
  commingSoon: function() {
    wx.navigateTo({
      url: '/pages/commingSoon/commingSoon',
    })
  },
  perMedal: function() {
    var _this = this;
    var session_id = wx.getStorageSync('session_id');
    wx.request({
      url: 'https://wanda.niowoo.com/api/signup/datesselected',
      method: 'POST',
      data: {
        session_id: session_id,
      },
      success: (res) => {
        console.log(res);
        if(res.data.code == 6) {
          wx.showModal({
            title: '友情提示',
            content: '请先报名！',
          })
        }else {
          wx.navigateTo({
            url: '/pages/perMedal/perMedal',
          })
        }
      }
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
     // 更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
