// pages/confirmAnOrder/confirmAnOrder.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number:1,//商品数量
    isAddress:true,//有地址
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

  // 购买数量
  onChange(event) {
    console.log(event.detail);
  },
  // 跳转地址页面
  toAddress(){
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    // 将商品id存储
    that.setData({
      id:app.globalData.gid
    })
    // 获取地址信息，判断是否有地址
    app.http({
      url:"wxuser/useradderss",
      method:"POST",
    }).then(res=>{
      console.log(res)
      // 如果有地址
      if(res.data.code==200){
        that.setData({
          isAddress:true,
          addressAll:res.data.data
        })
      //如果没有地址  
      }else if(res.data.code==204){
        that.setData({
          isAddress:false
        })
      }else{
        app.showToast(res.data.msg)
      }
    }).catch(err=>{
      app.showToast(err.data.msg)
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