
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',           // 貌似没用的
    messageShow: false,  // 设置留言板一开始为隐藏
    message: '',    // 留言板输入的内容
    comment: [],    // 存储留言板的内容
    searchPageNum: 1, // 设置加载的第几次，默认是第一次
    callbackcount: 10, // 返回数据的个数
    searchLoading: false, // "上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false, // "没有数据"的变量，默认false,隐藏
    markShow:false,
    flag: true,// 是否请求数据的开关
    first: true, // 判断是否为第一页
  },
  onLoad: function (res) {  // 页面开始加载时请求留言板数据
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
  // 控制留言框的显示隐藏
  messageShow: function () {
    this.setData({
      messageShow: true,
      markShow:true
    })
  },
  //点击蒙版和留言框
  close:function(){
    this.setData({
      messageShow: false,
      markShow: false
    })
    
  },
  // 发表留言
  formSubmit: function (e) {
    var _this = this;
    var session_id = wx.getStorageSync('session_id');
    var message = _this.data.message;
    _this.setData({
      markShow: false,
    });
    wx.request({
      url: 'https://wanda.niowoo.com/api/knight/makecomments',
      method: 'POST',
      data: {
        session_id: session_id,
        comment: message
      },
      success: function (res) {
        if (res.data.code == 0) {
          _this.setData({
            messageShow: false,
            message: ''
          });
          wx.showModal({
            title: '提示',
            content: '评论成功',
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '请输入留言',
          })
        };
      }
    })
  },
  // 监听页面拉到底部 加载更多
  // scroll: function (e) {
  //   let that = this;
  //   var session_id = wx.getStorageSync('session_id');
  //   console.log(that.data.searchPageNum);
  //   if (this.data.flag) {
  //     this.setData({ flag: false });
  //     if (that.data.first) {
  //       that.setData({
  //         first: false,
  //         searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
  //       });
  //     }
  //     var page = that.data.searchPageNum;
  //     console.log(page);
  //     wx.request({
  //       url: 'https://wanda.niowoo.com/api/knight/getcomments',
  //       method: 'POST',
  //       data: {
  //         session_id: session_id,
  //         page: page,
  //       },
  //       success: (res) => {
  //         !res.data.data.length && that.setData({ flag: true });
  //         console.log(res);
  //         setTimeout(function () {
  //           that.setData({
  //             comment: that.data.comment.concat(res.data.data),
  //             searchLoading: false,
  //             searchPageNum: page + 1,
  //           })
  //         }, 2000)
  //         // if(res.data.data.length !=0 ) {
  //         //   that.setData({ searchLoading: true });
  //         //   setTimeout(function () {
  //         //     that.setData({
  //         //       comment: that.data.comment.concat(res.data.data),
  //         //       searchLoading: false,
  //         //       searchPageNum: that.data.searchPageNum + 1,
  //         //     })
  //         //   }, 2000);
  //         // } else {
  //         //   that.setData({ searchLoadingComplete: true });
  //         //   setTimeout(function(){
  //         //     that.setData({
  //         //       searchLoadingComplete: false,
  //         //     });
  //         //   }, 500)
  //         // }
  //       }
  //     })
  //   } else {
  //     that.setData({ searchLoadingComplete: true });
  //     setTimeout(function () {
  //       that.setData({
  //         searchLoadingComplete: false,
  //       });
  //     }, 500)
  //   }
  // },
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
          setTimeout(function(){
            that.setData({
              comment: that.data.comment.concat(res.data.data)
            })
          },1000);

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
    if (all_race_codes.length>0) {
      wx.redirectTo({
        url: '/pages/continueReg/continueReg',
      })
    } else {
      wx.navigateTo({
        url: '/pages/registerOffline/registerOffline',
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
