// pages/indent/indent.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topTab:["全部","待付款","待发货","待收货"],
    nowTab:"全部",
    nowIndex:-1,
  },

  // 改变导航
  changeTab: function(event){
    var index=event.currentTarget.dataset.index;
    console.log(event)
    this.setData({
      nowTab:this.data.topTab[index]
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if(wx.getStorageSync('userInfo')&&wx.getStorageSync('openId')){
      // 获取买家订单
      app.http({
        url:"wxorder/userorder",
        method:"POST",
        param:{
          id:wx.getStorageSync('userId'),
          pages:1
        }
      }).then(res=>{
        console.log(res)
      }).catch(err=>{
        app.showToast(err.data.msg)
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
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