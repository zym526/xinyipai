// pages/binding/binding.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    // hint:"手机号格式错误",
    yanzhengma:"发送验证码",
  },

  resetTime: function(){
    var second = 60;
    var timer = null;
    var that=this
    timer = setInterval(function () {
      second -= 1;
      if (second > 0) {
        that.setData({
          yanzhengma:"重新发送("+second+"s)"
        })
      } else {
        that.setData({
          yanzhengma:"发送验证码"
        })
      }
    }, 1000)
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