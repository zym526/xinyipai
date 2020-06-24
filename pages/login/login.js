const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否有用户数据，有的话就直接跳转页面
    if(wx.getStorageSync('userInfo')&&wx.getStorageSync('openid')){
      // app.enterMainPage(app.isNeedSearch());  
      wx.switchTab({
        url: '/pages/index/index',
      });
    }
  },
  bindGetUserInfo (e) {
    console.log(e)
    // 将用户信息存储
    var userInfo=e.detail.userInfo
    // 当允许授权的时候
    if(userInfo){
      wx.login({
        success (res) {
          wx.setStorageSync('userInfo', userInfo)
          console.log(res,userInfo)
          // 获取code发起请求
          if (res.code) {
            // 发起网络请求
            app.http({
              url:'wxapi/wxlog',
              method:'POST',
              param:{
                code: res.code,
                avatarUrl:userInfo.avatarUrl,
                city:userInfo.city,
                gender:userInfo.gender===0?"女":"男",
                nickName:userInfo.nickName,
                province:userInfo.province,
              }
            }).then(res=>{
              // 将openid和token存储起来
              wx.setStorageSync('openId', res.data.res.openid);
              wx.setStorageSync('token', res.data.res.token);
              wx.setStorageSync('userId', res.data.res.uid)
              wx.navigateBack({
                delta: 1
              })
            }).catch(err=>{
              app.showToast("请求失败，请稍后重试~")
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }else{
      // 当拒绝授权的时候跳转页面
      wx.navigateBack({
        delta: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})