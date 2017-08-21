Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    username: '',
    allTimes: [
      { name: '26', value: '20170826', checked: false },
      { name: '27', value: '20170827', checked: false },
      { name: '28', value: '20170828', checked: false },
      { name: '29', value: '20170829', checked: false },
      { name: '30', value: '20170830', checked: false },
      { name: '31', value: '20170831', checked: false },
    ],
    timeChoose: []
  },
  /*监听手机号输入*/
  mobileInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 监听用户名输入
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },

  notice: function () {
    wx.navigateTo({
      url: '../notice/notice',
    })
  },
//  日期选择
  checkboxChange: function (e) {
    var that = this;
    var allTimes = that.data.allTimes;
    var checkArr = e.detail.value;
    // console.log(checkArr);
    var arr = [];
    for (var i = 0; i < checkArr.length; i++) {
      arr.push(parseInt(checkArr[i]) - 20170826 + '');
    }
    for (var i = 0; i < allTimes.length; i++) {
      if (arr.indexOf(i + "") != -1) {
        allTimes[i].checked = true;
      } else {
        allTimes[i].checked = false;
      }
    }
    that.setData({
      allTimes: allTimes,
      timeChoose: e.detail.value
    })
    // console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  // 表单验证,传数据到后台
  formSubmit: function (res) {
    var session_id = wx.getStorageSync('session_id');
    var name = this.data.userName;
    var phone = this.data.phone;
    var dates_selected = this.data.timeChoose;
    console.log(dates_selected);
    var regPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1})|(16[0-9]{1}))+\d{8})$/;
    if (this.data.phone.length == 0 || this.data.userName.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入姓名或手机号码！',
      })
    } else if (!regPhone.test(this.data.phone)) {
      wx.showModal({
        title: '提示',
        content: '请输入11位手机号码',
      })
    } else if (this.data.timeChoose.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择日期',
      })
    } else {
      wx.request({
        url: 'https://wanda.niowoo.com/api/signup/online',
        method: 'POST',
        data: {
          session_id: session_id,
          name: name,
          phone: phone,
          dates_selected: dates_selected,
        },
        success: function (res) {
          console.log(res);
          if(res.data.code == 0){
            // wx.setStorageSync('race_codes', res.data.data.race_codes);
            // wx.setStorageSync('all_race_codes', res.data.data.all_race_codes);
            wx.setStorage({
              key: 'race_codes',
              data: res.data.data.race_codes,
              success: function(res) {
                console.log(res)
              } 
            });
            wx.setStorage({
              key: 'all_race_codes',
              data: res.data.data.all_race_codes,
              success: function (res) {
                console.log(res)
              }
            });
            wx.navigateTo({
              url: '/pages/regSuccess/regSuccess',
              complete: function(res) {
                // console.log(res)
              }
            })
          };
          
        }
      })
    }
  },
})