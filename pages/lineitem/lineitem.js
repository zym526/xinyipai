// pages/lineitem/lineitem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 跳转商城
  toShop: function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 跳转地址
  toAddress: function(){
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  // 跳转商品详情
  toInfo: function(){
    wx.navigateTo({
      url: '/pages/info/info',
    })
  },
  // 跳转所有订单
  toIndent: function(){
    wx.navigateTo({
      url: '/pages/indent/indent',
    })
  },
  // 跳转物流信息
  toLogistics: function(){
    wx.navigateTo({
      url: '/pages/logistics/logistics',
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