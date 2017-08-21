var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');

Page({
  data: {
    name: '', // 不知道有什么用
    status:'', // 比赛判断状态码
    class:'hide', // 判断弹窗的显示与隐藏, 默认隐藏
    timer:0, // 定时更新坐标轴
    thoughOne:false,  // 检测是否经过检测点1，默认不经过
    thoughTwo:false,  // 检测是否经过监测点2，默认不经过
    messageShow: true,  // 
    end:false,  // 检测是否到达终点，默认未到达
    longitude:0, // 初始化精度
    latitude:0,  // 初始化纬度
    markers: [{//起点终点地点
      iconPath: "../img/marker_checked.png",
      id: 0,      
      latitude: 34.210100,
      longitude: 108.890330,      
      width:70,
      height: 70      
    },{
      iconPath: "../img/marker.png",
      id: 0,
      latitude: 34.220408,
      longitude: 108.887923,  
      width: 60,
      height: 60
    }],
    distance: '',
    cost: '',        
    polyline: [],// 骑车路线，由坐标点的数组构成    
    circles:[ //  以某一经纬度为中心的圆
     {
        latitude: 34.211607,
        longitude: 108.889757,      
        fillColor: '#ecbe64AA',
        radius:300
      },
      // {//水站补给
      //   latitude: 34.220408,
      //   longitude: 108.887923,      
      //   fillColor: '#ecbe64AA',
      //   radius: 300
      // },
    ]

  }, 
  onChangeClass:function(e){// 关闭弹窗
    var _this = this;
    _this.setData({
      class:'hide'
    })
  },
  onLoad: function () {   
    var _this = this;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: '7690184f69f98ac0fc5c1d033366faa8'});
    // myAmapFun.getRegeo({
    //   success: function (data) {
    //     //成功回调
    //     console.log(data);
    //   },
    //   fail: function (info) {
    //     //失败回调
    //     // console.log(info)
    //   }
    // })
    myAmapFun.getDrivingRoute({//获取比赛路线  getDrivingRoute 路线规划的方法
      strategy:2,
      origin: '108.889757,34.211607',//起点：万达西安
      waypoints: '108.888974,34.236934',//延平门坐标 经过点
      destination: '108.890330,34.211200',
      success: function(data){
        console.log(data);
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        _this.setData({
          polyline: [{
            points: points,
            color: "#ecbe64",
            width: 6
          }]
        });
        if (data.paths[0] && data.paths[0].distance) {
          _this.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.taxi_cost) {
          _this.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }

      },
      fail: function(info){

      }
    });
    var timerd = setInterval(this.local,5000);//定时更新坐标
    this.setData({
      timer:timerd
    }); 
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    });  
    // myAmapFun.getRegeo({
    //   success: function (data) {
    //     //成功回调
    //   },
    //   fail: function (info) {
    //     //失败回调
    //     console.log(info)
    //   }
    // })
  }, 
  onShareAppMessage: function (res) {//分享功能
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: '任务达成',
      path: '/pages/navigation_ride/navigation',
      success: function (res) {
        // 转发成功
        // console.log(1);
        
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }, 
  local:function(){
    var _this = this;    
    wx.getLocation({//获取参赛者本地坐标
      type: 'gcj02',
      success: function (res) {
        // console.log(res)  
        var tudes = {};
        _this.setData({
          circles: [
            { //终点坐标
              latitude: 34.211607,
              longitude: 108.889757,
              fillColor: '#ecbe64AA',
              radius:300
            }
          ],
          longitude: res.longitude,
          latitude: res.latitude,
          markers: [{//起点终点地点
            iconPath: "../img/marker_checked.png",
            id: 0,
            latitude: 34.211607,
            longitude: 108.889757,
            width: 70,
            height: 70
          },{
            iconPath: "../img/marker.png",//补水点位置
            id: 0,
            latitude: 34.220408,
            longitude: 108.887923,
            width: 60,
            height: 60
          },{
            iconPath: "../img/marker1.png",//参赛者当前位置
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude,
            width: 25,
            height: 30
          }]
        });
        var lat1 = res.latitude;
        var lng1 = res.longitude;
        // console.log(lat1)
        // console.log(lng1)
        var pass = false;
        var lat2 = 34.236934;
        var lng2 = 108.888974;
        var rad1 = lat1 * Math.PI / 180.0;
        var rad2 = lat2 * Math.PI / 180.0;
        var a = rad1 - rad2;
        var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
        var r = 6378137;
        var disOne = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)));
        // console.log(disOne); //disOne是本地位置到延平门(检测点1)的距离

        var lat3 = 34.208085;
        var lng3 = 108.888298;
        var rad1 = lat1 * Math.PI / 180.0;
        var rad3 = lat3 * Math.PI / 180.0;
        var a1 = rad1 - rad3;
        var b1 = lng1 * Math.PI / 180.0 - lng3 * Math.PI / 180.0;
        var r = 6378137;
        var disTwo = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a1 / 2), 2) + Math.cos(rad1) * Math.cos(rad3) * Math.pow(Math.sin(b1 / 2), 2)));
        // console.log('disTwo'+disTwo); //disTwo是本地位置到检测点2的距离

        var lat4 = 34.220408;
        var lng4 = 108.889757;
        var rad1 = lat1 * Math.PI / 180.0;
        var rad4 = lat4 * Math.PI / 180.0;
        var a1 = rad1 - rad4;
        var b1 = lng1 * Math.PI / 180.0 - lng4 * Math.PI / 180.0;
        var r = 6378137;
        var disEnd = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a1 / 2), 2) + Math.cos(rad1) * Math.cos(rad4) * Math.pow(Math.sin(b1 / 2), 2)));
        // console.log(disEnd); //参赛者到终点的距离


        if (disOne < 112307839.5037772453) {
          pass = true;
          _this.setData({
            thoughOne: true
          })
          // console.log('到达监测点1');  //检测是否到达检测点1                
        }
        if (disTwo < 112304846.6701896) {
          pass = true;
          _this.setData({
            thoughTwo: true
          })
          // console.log('到达监测点2');  //检测是否到达检测点2
        }

        if (disEnd < 1111306087.7838502766) {         
          _this.setData({            
            end:true            
          })         
        } 
        if (_this.data.thoughOne == true && _this.data.thoughTwo == true && _this.data.end == true) {
          _this.setData({//检测是否到达终点
            class:'show'
          });         
          // console.log('到达终点'); 
          clearInterval(_this.data.timer);
          var session_id = wx.getStorageSync('session_id');
          var status = _this.data.status;
          // console.log(_this.data);
          wx.request({
            url: 'https://wanda.niowoo.com/api/knight/race',
            method: 'POST',
            data:{
              session_id: session_id,
              status: status,
            },
            success: (res) => {
              console.log('res :' + res);
            }
          })
        }
      }
    })
    
  }
})