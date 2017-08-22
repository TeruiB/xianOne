//获取应用实例  
var app = getApp()
Page({
  data: {
    tempFilePaths: '',
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
    timeChoose: [],
    class: '',
    class2: '',
  },
  /*监听手机号输入*/
  mobileInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  notice: function() {
    wx.navigateTo({
      url: '/pages/notice/notice',
    })
  },
  /**  
   * 上传图片 
   */
  chooseimage: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9  
      // 可以指定是原图还是压缩图，默认二者都有  
      sizeType: ['original', 'compressed'],
      // 可以指定来源是相册还是相机，默认二者都有 
      sourceType: ['album', 'camera'],
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片   
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        if (tempFilePaths){
          _this.setData({
            class: 'show',
            class2: 'hide',
          })
        }else {
          _this.setData({
            class: 'hide',
            class2: 'show',
          })
        }
        _this.setData({
          tempFilePaths: res.tempFilePaths
        })
      }
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
  formSubmit: function () {
    var session_id = wx.getStorageSync('session_id');
    var name = this.data.userName;
    var phone = this.data.phone;
    var dates_selected = this.data.timeChoose;
    var tempFilePaths = this.data.tempFilePaths;
    // console.log(tempFilePaths);
    var regPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.phone.length == 0 || this.data.userName.length == 0 || this.data.tempFilePaths.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入姓名或手机号码或上传相片！',
      })
    } else if (!regPhone.test(this.data.phone)) {
      wx.showModal({
        title: '提示',
        content: '请输入11位手机号码',
      })
    } else if (this.data.timeChoose.length == 0){
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
          tempFilePaths: tempFilePaths
        },
        success: function (res) {
          if (res.data.code == 0){
            wx.navigateTo({
              url: '/pages/regSuccess/regSuccess',
            });
            console.log(res)
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
          }else{
            wx.showModal({
              title: '提示',
              content: '请重新输入',
            })
          }
        }
      })
    }
  }
})