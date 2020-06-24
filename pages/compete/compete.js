// pages/compete/compete.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowEmpty:true,//暂无数据
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
  // 跳转页面
  toNewPage(e){
    console.log(e.currentTarget.dataset.item)
    var item=e.currentTarget.dataset.item
    if(item.now_status=="付尾款>"){
      // 跳转订单页面
      app.globalData.gid=item.gid
      app.globalData.justAndAuction=0
      wx.navigateTo({
        url: '/pages/confirmAnOrder/confirmAnOrder',
      })
    }else if(item.now_status=="查看订单>"){
      app.globalData.orderId=""//订单id
      wx.navigateTo({
        url: '/pages/orderDetail/orderDetail?orderId='+item.order_id,
      })
    }else{
      // 跳转商品详情页
      var id=item.gid
      wx.navigateTo({
        url: '/pages/info/info?id='+id,
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    // 获取参拍数据
    app.http({
      url:"wxuser/auction_log",
      method:"POST",
      param:{
        uid:wx.getStorageSync('userId')
      }
    }).then(res=>{
      console.log(res)
      if(res.data.data.length==0){
        that.setData({
          isShowEmpty:false
        })
      }else{
        // status中-1待开拍，1领先，2成交，0出局
        // 遍历数据，进行判断
        res.data.data.forEach(item=>{
          if(item.status=="-1"){
            item.status_text="待开拍",
            item.now_status="去开价>"
          }else if(item.status=="1"){
            item.status_text="领先中",
            item.now_status="领先中"
          }else if(item.status=="0"){
            item.status_text="出局"
            // 判断是否截拍
            var nowTime=new Date().getTime()
            // 当前时间大于结束时间则已截拍
            console.log(nowTime,item.goods_endtime)
            if(nowTime>=item.goods_endtime*1000){
              item.now_status="已截拍"
            }else{
              // is_user中0可以多次出价，1只能出一次
              // 判断是否可以多次出价
              if(item.is_user==0){
                item.now_status="再出价>"
              }else{
                item.now_status="已出局"
              }
            }
          }else if(item.status=="2"){
            item.status_text="成交"
            // to_pay中0已支付，1未支付
            if(item.to_pay==0){
              item.now_status="查看订单>"
            }else{
              item.now_status="付尾款>"
            }
          }
        })
        that.setData({
          allMessage:res.data.data
        })
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