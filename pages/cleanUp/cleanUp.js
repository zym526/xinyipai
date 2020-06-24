// pages/cleanUp/cleanUp.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  // 跳转总盈利页面
  toProfit(){
    wx.navigateTo({
      url: '/pages/profit/profit',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    app.http({
      url:"wxuser/balance",
      method:"POST",
      param:{
        uid:wx.getStorageSync('userId')
      }
    }).then(res=>{
      if(res.data.code==200){
        that.setData({
          totalEarnings:res.data.data,//总盈利
        })
      }else{
        app.showToast(res.data.msg)
      }
    }).catch(err=>{
      app.showToast("请求失败，请稍后重试~")
    })
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