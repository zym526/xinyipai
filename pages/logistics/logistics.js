// pages/logistics/logistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allCom:[
      {title:"压技术旗舰店",img:"lunbo.png",message:"您购买的钓鱼台礼兵酒珍藏级瓶装龙凤钓鱼台礼兵酒珍藏级瓶装龙凤",user:"来自7321523329636",time:"星期日"},
      {title:"压技术旗舰店",img:"lunbo.png",message:"您购买的钓鱼台礼兵酒珍藏级瓶装龙凤钓鱼台礼兵酒珍藏级瓶装龙凤",user:"来自7321523329636",time:"2019-10-10"},
      {title:"压技术旗舰店",img:"lunbo.png",message:"您购买的钓鱼台礼兵酒珍藏级瓶装龙凤钓鱼台礼兵酒珍藏级瓶装龙凤",user:"来自7321523329636",time:"2019-10-10"},
      {title:"压技术旗舰店",img:"lunbo.png",message:"您购买的钓鱼台礼兵酒珍藏级瓶装龙凤钓鱼台礼兵酒珍藏级瓶装龙凤",user:"来自7321523329636",time:"2019-10-10"},
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