// pages/profit/profit.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classify:["拍卖成功","分佣","待入帐"],
    nowTab:0,//当前选项
    pages:1,//页码
    state:2,//请求参数
    isShow:true,//暂无数据
    lock:true,//请求锁
    message:[],//所有数据
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
  // 切换tab
  changeTab(e){
    var that=this
    that.setData({
      nowTab:e.currentTarget.dataset.index,
      pages:1,
      lock:true,
      isShow:true,
      message:[],
      textTop:"拍卖订单已完成"
    })
    if(that.data.nowTab==0){
      that.setData({
        state:2,//订单完成
        textTop:"拍卖订单已完成"
      })
    }else if(that.data.nowTab==1){
      that.setData({
        state:0,//拍卖完成未支付
        textTop:"拍卖订单未支付，订单完成后入账"
      })
    }else{
      that.setData({
        state:1,//拍卖完成支付成功
        textTop:"拍卖订单已支付，订单完成后入账"
      })
    }
    that.getDetail(that.data.state)
  },
  // 获取盈利列表
  getDetail(state){
    var that=this
    if(that.data.lock){
      app.http({
        url:"wxuser/balance_detail",
        method:"POST",
        param:{
          uid:wx.getStorageSync('userId'),
          state,//参数
          pages:that.data.pages 
        }
      }).then(res=>{
        console.log(res)
        if(res.data.code==200){
          // 将时间戳转为时间
          res.data.data.forEach(item=>{
            item.create_time_new=app.format(item.create_time)
          })
          var nowData=that.data.message
          that.setData({
            message:nowData.concat(res.data.data),
            pages:that.data.pages+1
          })
        }else if(res.data.code==204){
          // 不再请求
          that.setData({
            lock:false
          })
          app.showToast("没有了~")
          console.log(that.data.pages)
          if(that.data.pages==1){
            that.setData({
              isShow:false,
            })
          }
        }
      }).catch(err=>{
        app.showToast("请求失败，请稍后重试~")
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    // 0拍卖完成未支付，1拍卖完成支付成功，2订单完成
    that.getDetail(that.data.state)
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