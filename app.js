//app.js
App({
  data:{
    wsid:"",
    userInfo:{},
    baseUrl:"https://auctionshop.xypvip.cn/index.php/home/"//芯意拍
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.setStorageSync("iv", res.iv);
              wx.setStorageSync("encryptedData", res.encryptedData)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    gid:"",
    justAndAuction:"",//1为直购，0为拍卖
  },
  // 时间戳转时分秒
  formatDuring: function(mss) {
    var time = parseInt(mss) + "秒";
    if( parseInt(mss )> 60){

      var second = parseInt(mss) % 60;  //取余获得秒数
      var min = parseInt(mss / 60);  //当剩余分钟数不大于60分钟时，取整获得分数
      time = min + ":" + second + ":";  
      // 如果大于60分钟则判断小时
      if( min > 60 ){  
          min = parseInt(mss / 60) % 60;  //获得分钟数
          var hour = parseInt( parseInt(mss / 60) /60 ); //获得小时 
          time = hour + ":" + min + ":" + second;  
          // 如果大于24小时则判断天数
          // if( hour > 24 ){  
          //     hour = parseInt( parseInt(mss / 60) /60 ) % 24; //获得小时 
          //     var day = parseInt( parseInt( parseInt(mss / 60) /60 ) / 24 );  //获得天
          //     time = day + "天" + hour + "小时" + min + "分" + second + "秒";  
          // }  
      }       
    }
    return time;
  },
  // 时间戳转为年月日
  formatDate: function(timestamp) {
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = this.addZero(date.getMonth() + 1);
    var day = this.addZero(date.getDate());
    var hours = this.addZero(date.getHours());
    var minutes = this.addZero(date.getMinutes());
    var seconds = this.addZero(date.getSeconds());
    // return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    return year + '-' + month + '-' + day;
  },
  addZero: function(num) {
    return num < 10 ? '0' + num : num;
  },
  // 轮播图尺寸
  widthLB:function(e,number){
    var winWid = (wx.getSystemInfoSync().windowWidth)-number;//获取当前屏幕的宽度减去24获得轮播图宽度
    var imgh=e.detail.height;//图片高度
    var imgw=e.detail.width;
    var swiperH=winWid*imgh/imgw + "px"//等比设置swiper的高度。  即 轮播图宽度 / swiper高度 = 图片宽度 / 图片高度    ==》swiper高度 = 轮播图宽度 * 图片高度 / 图片宽度
    return swiperH
  },

  /* 常用正则表达式集 */
  regExps: {
    email: /^[0-9a-zA-Z_]+@[0-9a-zA-Z_]+[\.]{1}[0-9a-zA-Z]+[\.]?[0-9a-zA-Z]+$/,    //邮箱
    mobile: /^(?:1\d{2})-?\d{5}(\d{3}|\*{3})$/,    //手机号码
    qq: /^[1-9][0-9]{4,9}$/,    //QQ
    befitName: /^[a-z0-9A-Z\u4e00-\u9fa5]+$/,    //合适的用户名，中文,字母,数字
    befitPwd: /^[a-z0-9A-Z_]+$/,     //合适的用户名，字母,数字,下划线
    allNumber: /^[0-9]+.?[0-9]$/    //全部为数字
  },
  /*信息提示 */
  showToast(title = "未知错误，请重试！", icon = "none", duration = 2000) {
    wx.showToast({
        title: title,
        icon: icon,
        duration: duration,
        mask: true
    });
  },
  /* 关闭当前页面 */
  closePage() {
    wx.navigateBack({
        delta: 1
    });
  },
  // 请求
  http: function({url = '', param = {}, type = 'json',method=''} = {}) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: this.data.baseUrl + url,
            method:method,
            data: param,
            header: {
                'content-type': type == 'json' ? 'application/json' : 'application/x-www-form-urlencoded',
                'token': wx.getStorageSync("token"),
            },
            complete: res => {
                // 重新请求完token，再次执行后的请求在这里拦截
                if (res.statusCode == 200) {
                    if (res.data.code == 401) {
                        this.getNewToken().then(() => {
                            this.http({url, param, type, method}).then(res => resolve(res));
                        })
                    }else{
                        // if(res.data.code==200){
                          resolve(res);
                        // }else{
                        //   reject(res);
                        // }
                    }   
                } else {
                    reject(res);
                }
            }
        }); 
    }); 
  },
  getNewToken: function() {    
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          wx.request({
            url: `${this.data.baseUrl}wxapi/wxlog`,
            method: 'POST',
            data: {
              code: res.code,
              avatarUrl:wx.getStorageSync('userInfo').avatarUrl,
              city:wx.getStorageSync('userInfo').city,
              gender:wx.getStorageSync('userInfo').gender===0?"女":"男",
              nickName:wx.getStorageSync('userInfo').nickName,
              province:wx.getStorageSync('userInfo').province,
            },
            header: {
              'content-type': 'application/json'
            },
            success: res => {
              console.log(res)
              wx.setStorageSync('token', res.data.token);
              resolve();
            }
          })
        }
      });
    }) 
  }, 
  // connectSocket(){
  //   wx.connectSocket({
  //     url:'ws://auctionshop.xypvip.cn:9501',
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     success: function (res) {
  //       console.log('Socket连接成功:', res);
  //     },
  //     fail: function (res) {
  //       console.error('连接失败:', res);
  //     },
  //   })
  // },
})