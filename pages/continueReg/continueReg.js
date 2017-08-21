Page({
  data: {
    phone: '',
    username: '',
    allTimes: [
      { name: '26', value: '20170826', checked: false, disabled: false },
      { name: '27', value: '20170827', checked: false, disabled: false },
      { name: '28', value: '20170828', checked: false, disabled: false },
      { name: '29', value: '20170829', checked: false, disabled: false },
      { name: '30', value: '20170830', checked: false, disabled: false },
      { name: '31', value: '20170831', checked: false, disabled: false },
    ],
    timeChoose: [],
    dates_selected: '',
    class: '',
  },
  onLoad: function (res) {
    var _this = this;
    var session_id = wx.getStorageSync('session_id');
    wx.request({
      url: 'https://wanda.niowoo.com/api/signup/datesselected',
      method: 'POST',
      data: {
        session_id: session_id
      },
      success: (res) => {
        console.log(res)
        _this.setData({
          dates_selected: res.data.data.dates_selected,
          phone: res.data.data.phone,
          username: res.data.data.name,
        });
        if (_this.data.dates_selected) {
          let newTimes = _this.data.allTimes.map((val, idx) => {
            for (let i = 0; i < res.data.data.dates_selected.length; i++) {
              if (val.value == res.data.data.dates_selected[i]) {
                val.disabled = true;
                val.checked = true;
              }
            }
            return val;
          })
          _this.setData({
            allTimes: newTimes
          })
        }
      }
    })
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
      username: e.detail.value
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
    var name = this.data.username;
    console.log(name);
    var phone = this.data.phone;
    console.log(phone);
    var dates_selected = this.data.timeChoose;
    console.log(dates_selected);
    var regPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1})|(16[0-9]{1}))+\d{8})$/;
    if (this.data.timeChoose.length == 0) {
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
          if (res.data.code == 0) {
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
            wx.redirectTo({
              url: '/pages/regSuccess/regSuccess',
              complete: function (res) {
                // console.log(res)
              }
            })
          };

        }
      })
    }
  },
})