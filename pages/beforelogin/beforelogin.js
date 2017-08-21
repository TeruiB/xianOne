
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    messageShow: false,
    message: '',
    comment: [],
    searchPageNum: 1, // 设置加载的第几次，默认是第一次
    callbackcount: 10, // 返回数据的个数
    searchLoading: false, // "上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false, // "没有数据"的变量，默认false,隐藏
    flag: true//是否請求數據
  },
  onLoad: function (res) {
    var _this = this;
    var session_id = wx.getStorageSync('session_id');
    wx.request({
      url: 'https://wanda.niowoo.com/api/knight/getcomments',
      method: 'POST',
      data: {
        session_id: session_id,
        page: _this.data.searchPageNum,
      },
      success: (res) => {
        // console.log(res)
        _this.setData({
          comment: res.data.data,
        })
      }
    })
  },
  // 监听用户名输入
  messageInput: function (e) {
    this.setData({
      message: e.detail.value
    })
  },
  messageShow: function () {
    this.setData({
      messageShow: true
    })
  },
  formSubmit: function (e) {
    var _this = this;
    var session_id = wx.getStorageSync('session_id');
    var message = _this.data.message;
    // console.log(message)
    wx.request({
      url: 'https://wanda.niowoo.com/api/knight/makecomments',
      method: 'POST',
      data: {
        session_id: session_id,
        comment: message
      },
      success: function (res) {
        // console.log(res);
        // var remsg = "评论失败";

        if (res.data.code == 0) {
          // var remsg = "评论成功";          
          _this.setData({
            messageShow: false,
            message: ''
          });
          wx.showModal({
            title: '提示',
            content: '评论成功',
          })
        } else {
          // _this.setData({
          //   messageShow: false,
          //   message: ''
          // });
          wx.showModal({
            title: '提示',
            content: '请输入留言',
          })
        };
        // _this.setData({
        //   messageToast: true,
        //   retmessage: remsg
        // });
        // setTimeout(function(){
        //   _this.setData({
        //     messageToast: false,
        //     messageShow: false
        //   })
        // },2000)        

      }
    })
  },
  // 监听页面拉到底部 加载更多
  scroll: function (e) {
    console.log(1);
    let that = this;
    var session_id = wx.getStorageSync('session_id');
    // if (that.data.searchLoading && !that.data.searchLoadingComplete) {
    that.setData({
      searchPageNum: that.data.searchPageNum + 1, // 每次触发上拉事件，把searchPageNum + 1
    })
    // that.onLoad();
    // }
    if (this.data.flag) {
      this.setData({ flag: false })
      wx.request({
        url: 'https://wanda.niowoo.com/api/knight/getcomments',
        method: 'POST',
        data: {
          session_id: session_id,
          page: that.data.searchPageNum,
        },
        success: (res) => {
          !res.data.data.length && that.setData({ flag: true })
          console.log(res)
          that.setData({
            comment: that.data.comment.concat(res.data.data)
          })

        }
      })
    }
    // this.setData({
    //   searchPageNum: this.data.searchPageNum + 1,
    // })
    // console.log("上拉拉加载更多。。。。" + this.data.searchPageNum)
  },
  registerOnline: function (res) {
    var that = this;
    var all_race_codes = wx.getStorageSync('all_race_codes');
    // console.log(wx.getStorageSync);
    // console.log(typeof all_race_codes);
    if (!all_race_codes) {
      console.log(1);
      wx.navigateTo({
        url: '/pages/registerOnline/registerOnline',
      })
    } else {
      console.log(2);
      wx.redirectTo({
        url: '/pages/continueReg/continueReg',
      })
    }
  },
  registerOffline: function () {
    var that = this;
    var all_race_codes = wx.getStorageSync('all_race_codes');
    console.log(all_race_codes);
    if (!all_race_codes) {
      wx.navigateTo({
        url: '/pages/registerOnline/registerOnline',
      })
    } else {
      wx.navigateTo({
        url: '/pages/continueReg/continueReg',
      })
    }
  },
  weiboBinding: function () {
    wx.navigateTo({
      url: '/pages/weiboBinding/weiboBinding',
    })
  },
  onReachBottom: function () {
    // console.log(1);
  }
})
