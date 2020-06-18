// pages/indent/indent.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topDH:["全部","待付款","待发货","待收获","待评价"],
    nowItem:"全部",
    nowIndex:-1,
    allCom:[
      {shop:"白沙狼青拍卖点",img:"lunbo.png",title:"钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒",num:"1",money:"500"},
      {shop:"白沙狼青拍卖点",img:"lunbo.png",title:"钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒",num:"1",money:"500"},
      {shop:"白沙狼青拍卖点",img:"lunbo.png",title:"钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒",num:"1",money:"500"},
      {shop:"白沙狼青拍卖点",img:"lunbo.png",title:"钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒",num:"1",money:"500"},
      {shop:"白沙狼青拍卖点",img:"lunbo.png",title:"钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒",num:"1",money:"500"}
    ],
    anyCom:[
      {img:"lunbo.png",title:"钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒",money:"500"},
      {img:"lunbo.png",title:"钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒",money:"500"},
      {img:"lunbo.png",title:"钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒",money:"500"},
      {img:"lunbo.png",title:"钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒",money:"500"},
      {img:"lunbo.png",title:"钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒",money:"500"},
      {img:"lunbo.png",title:"钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒钓鱼台礼兵酒珍藏级瓶装龙飞呈钓鱼台礼兵酒",money:"500"}
    ]
  },

  // 改变导航
  changeText: function(event){
    var index=event.currentTarget.dataset.index;
    this.setData({
      nowItem:this.data.topDH[index]
    })
  },
  // 显示隐藏删除按钮
  changeHidden: function(even){
    var index=even.currentTarget.dataset.index;
    this.setData({
      nowIndex:index
    })
  },
  // 跳转商品详情页
  toOrderDetail: function(){
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail',
    })
  },
  // 跳转商店首页
  toShop: function(){
    wx.navigateTo({
      url: '/pages/ShopFront/ShopFront',
    })
  },
  // 跳转物流页面
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