var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');

Page({
  data: {    
    status:'',//比赛检测点   
    timer:0,//定时器
    medal: [],//后台返回的勋章名称
    thoughOne:false,//检测是否到达检测点1，默认为未到达
    thoughTwo:false,//检测是否到达检修点2，默认为未达到    
    end:false,//检测是否到达重点，默认为未到达
    longitude:0,
    latitude:0,
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
    polyline: [],//过程中的坐标    
    circles:[ //圆圈范围
     {
        latitude: 34.211607,
        longitude: 108.889757,      
        fillColor: '#ecbe64AA',
        radius:300
      }      
    ]

  }, 
  onChangeClass:function(e){//隐藏弹窗
    var _this = this;
    _this.setData({
      class:'hide'
    })
  },
  onLoad: function () {   
    var _this = this;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: '7690184f69f98ac0fc5c1d033366faa8'});    
    myAmapFun.getDrivingRoute({//获取比赛路线     
      strategy:2,
      origin: '108.889757,34.211607',//起点：万达西安
      waypoints: '108.888974,34.236934',//延平门坐标 经过点
      destination: '108.890330,34.211200',
      success: function(data){
        // console.log(1);
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
        // console.log(2);
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
            width: 50,
            height: 60
          }]
        });
        var lat1 = res.latitude;
        var lng1 = res.longitude;
        // console.log(lat1);
        // console.log(lng1);        
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
        // console.log('disTwo'+disTwo);//disTwo是本地位置到检测点2的距离
        
        var lat4 = 34.220408;
        var lng4 = 108.889757;
        var rad1 = lat1 * Math.PI / 180.0;
        var rad4 = lat4 * Math.PI / 180.0;
        var a1 = rad1 - rad4;
        var b1 = lng1 * Math.PI / 180.0 - lng4 * Math.PI / 180.0;
        var r = 6378137;
        var disEnd = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a1 / 2), 2) + Math.cos(rad1) * Math.cos(rad4) * Math.pow(Math.sin(b1 / 2), 2)));
        // console.log(disEnd);//参赛者到终点的距离


        if (disOne < 300) {          
          _this.setData({
            thoughOne: true,
            status: 2
          });
          var session_id = wx.getStorageSync('session_id');
          var status = _this.data.status;
          // console.log(_this.data);
          // console.log(status);
          // console.log(session_id);
          wx.request({
            url: 'https://wanda.niowoo.com/api/knight/race',
            method: 'POST',
            data: {
              session_id: session_id,
              status: status
            },
            success: function (res) {
              // console.log(res);
            }
          })
          // console.log('到达监测点1');  //检测是否到达检测点1                
        }
        if (disTwo < 300) {         
          _this.setData({
            thoughTwo: true,
            status: 3 
          });
          var session_id = wx.getStorageSync('session_id');
          var status = _this.data.status;
          // console.log(_this.data);
          // console.log(status);
          // console.log(session_id);
          wx.request({
            url: 'https://wanda.niowoo.com/api/knight/race',
            method: 'POST',
            data: {
              session_id: session_id,
              status: status,             
            },
            success: function (res) {
              // console.log(res);
            }
          }) 

          // console.log('到达监测点2');//检测是否到达检测点2
        }

        if (disEnd < 300) {         
          _this.setData({ //检测是否到达终点           
            end:true,                      
          });          
        } 
        if (_this.data.thoughOne == true && _this.data.thoughTwo == true && _this.data.end == true){
          // wx.navigateTo({
          //   url: '/pages/weiboBinding/weiboBinding',
          // });
          _this.setData({//完成比赛            
            status: 4
          });         
          // console.log('到达终点'); 
          clearInterval(_this.data.timer);
          var session_id = wx.getStorageSync('session_id');          
          var status = _this.data.status;       
          wx.request({
            url: 'https://wanda.niowoo.com/api/knight/race',
            method: 'POST',
            data:{
              session_id: session_id,
              status: status       
            },
            success: function (res){
              console.log(res);
              // console.log(res.data);
              // console.log(res);                    
              // console.log(res.data.data.medal);
              // console.log(_this.data.medal);
              // _this.setData({
              //   medal: res.data.data.medal,
              // });
              wx.redirectTo({
                url: '/pages/popup/popup?extra=' + JSON.stringify(res)
              })
            }
          })
        }
      }
    })
    
  }
})