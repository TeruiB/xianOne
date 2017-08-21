Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
  },
  /*监听手机号输入*/
  mobileInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  index: function() {
   wx.redirectTo({
     url: '../index/index',
     complete: function(res) {
       console.log(res);
     }
   })
  },
  registerOnline: function() {
    wx.navigateTo({
      url: '../registerOnline/registerOnline',
    })
  },
  notice: function() {
    wx.navigateTo({
      url: '../notice/notice',
    })
  },
  // 表单验证,传数据到后台
  formSubmit: function (res) {
    var session_id = wx.getStorageSync('session_id');
    console.log(session_id);
    var phone = this.data.phone;
    var regPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.phone.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入手机号码！',
      })
    } else if (!regPhone.test(this.data.phone)) {
      wx.showModal({
        title: '提示',
        content: '请输入11位手机号码',
      })
    }else {
      wx.request({
        url: 'https://wanda.niowoo.com/api/signup/weibobinding',
        method: 'POST',
        data: {
          session_id: session_id,
          phone: phone,
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 4) {
            wx.showModal({
              title: '友情提示',
              content: '绑定失败，请确认是否在微博页面已报名！',
            })
          }else {
            wx.redirectTo({
              url: '/pages/regSuccess/regSuccess',
            })
          }

        }
      })
    }
  },
})