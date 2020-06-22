// pages/logisticsDetail/logisticsDetail.js
const app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    steps: [],//物流信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    // 获取订单号
    that.setData({
      order_sn:options.order_sn
    })
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
    var that=this
    app.http({
      url:"jdaddress/logistics",
      method:"POST",
      param:{
        // jdOrderId:that.data.order_sn
        jdOrderId:"118631419930"
      }
    }).then(res=>{
      if(res.data.code==200){
        var orderTrack=res.data.data.orderTrack//所有物流信息
        var order_sn=[]
        // 将物流信息进行处理
        for(var i=orderTrack.length-1;i>=0;i--){
          order_sn.push({text:orderTrack[i].content,desc:orderTrack[i].msgTime})
        }
        // 物流信息
        that.setData({
          steps:order_sn
        })
      }else{
        app.showToast(res.data.msg)
      }
    }).catch(err=>{})
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