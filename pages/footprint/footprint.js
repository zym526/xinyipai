// pages/footprint/footprint.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    anyCom:[
      {img:"lunbo.png",title:"钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒",money:"500"},
      {img:"lunbo.png",title:"钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒",money:"500"},
      {img:"lunbo.png",title:"钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒",money:"500"},
      {img:"lunbo.png",title:"钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒",money:"500"},
      {img:"lunbo.png",title:"钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒",money:"500"},
      {img:"lunbo.png",title:"钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒",money:"500"}
    ]
  },
  // 跳转商品详情页
  toInfo: function(){
    wx.navigateTo({
      url: '/pages/info/info',
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
    var today=new Date();//获取当前时间
    var week=[]//存储一周
    // for(var i=0;i<7;i++){
    //   var lastDay=new Date(today.getTime() - 1000*60*60*24*i)//当前时间转为时间戳，并往前推一天，转为时间
    //   week.push({date:lastDay.getDate(),day:lastDay.getDay()})
    // }
    // console.log(week)
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