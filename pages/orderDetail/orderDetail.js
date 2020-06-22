// pages/orderDetail/orderDetail.js
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
    var that=this
    if(app.globalData.orderId!=""){
      that.setData({
        orderId:app.globalData.orderId
      })
    }else{
      // 订单的id
      that.setData({
        orderId:options.orderId
      })
    } 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 取消订单
  cancelOrder(e){
    var that=this
    var order_sn=e.currentTarget.dataset.ordersn//订单号
    wx.showModal({
      content: '您确定要取消订单吗？',
      success: function (res) {
        if (res.confirm){
          app.http({
            url:"wxorder/cancel_order",
            method:"POST",
            param:{
              order_sn
            }
          }).then(res=>{
            if(res.data.code==200){
              // 跳转订单列表
              wx.redirectTo({
                url: '/pages/indent/indent',
              })
            }else{
              app.showToast(res.data.msg)
            }
          }).catch(err=>{})
        }
      }
    })
  },
  // 支付订单
  payOrder(e){
    var that=this
    var order_sn=e.currentTarget.dataset.ordersn//订单号
    // 调起支付
    app.http({
      url:"wxorder/order_pay",
      method:"POST",
      param:{
        order_sn
      }
    }).then(res=>{
      if(res.data.code==200){
        // 微信支付
        wx.requestPayment({  
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          paySign: res.data.data.paySign,
          timeStamp: res.data.data.timeStamp,
          signType:res.data.data.signType,
          success(res){
            console.log(res)
            // 订单状态查询
            app.http({
              url:"wxapi/orderstatus",
              method:"POST",
              param:{
                order_sn//订单号
              }
            }).then(res=>{
              if(res.data.data.result_code=="SUCCESS"){
                app.showToast("支付成功")
                // 支付成功后回调
                app.http({
                  url:"wxorder/uporder",
                  method:"POST",
                  param:{
                    order_sn:order_sn,//订单号
                  }
                }).then(res=>{
                  wx.redirectTo({
                    url: '/pages/indent/indent',
                  })
                }).catch(err=>{})
              }
            }).catch(err=>{
              app.showToast(err.data.msg)
            })
          },
          fail(error){
            wx.hideLoading()
            app.showToast("取消支付")
          }
        })
      }else{
        app.showToast(res.data.msg)
      }
    }).catch(err=>{})
  },
  // 查看物流
  lookLogistics(e){
    app.globalData.orderId=that.data.orderId
    var order_sn=e.currentTarget.dataset.ordersn//订单号
    wx.navigateTo({
      url: '/pages/logisticsDetail/logisticsDetail?order_sn='+order_sn,
    })
  },
  // 确认收货
  finish(e){
    var that=this
    var order_sn=e.currentTarget.dataset.ordersn//订单号
    wx.showModal({
      content: '是否确认收获？',
      success: function (res) {
        if (res.confirm){
          app.http({
            url:"wxorder/finish_order",
            method:"POST",
            param:{
              order_sn
            }
          }).then(res=>{
            console.log(res)
            if(res.data.code==200){
              wx.redirectTo({
                url: '/pages/indent/indent',
              })
            }else{
              app.showToast(res.data.msg)
            }
          }).catch(err=>{})
        }
      }
    })
  },
  // 删除订单
  delOrder(e){
    var that=this
    var order_sn=e.currentTarget.dataset.ordersn//订单号
    wx.showModal({
      content: '您确定要删除订单吗？',
      success: function (res) {
        if (res.confirm){
          app.http({
            url:"wxorder/del_order",
            method:"POST",
            param:{
              order_sn
            }
          }).then(res=>{
            if(res.data.code==200){
              wx.redirectTo({
                url: '/pages/indent/indent',
              })
            }else{
              app.showToast(res.data.msg)
            }
          }).catch(err=>{})
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    app.http({
      url:"wxorder/orderdetail",
      method:"POST",
      param:{
        id:that.data.orderId
      }
    }).then(res=>{
      console.log(res)
      if(res.data.code==200){
        var allMessage=res.data
        // 当前订单是直购还是拍卖
        if(allMessage.data.order_type==1){
          allMessage.data.order_type_text="直购"
        }else{
          allMessage.data.order_type_text="拍卖"
        }
        // 判断当前订单状态
        if(allMessage.data.order_state==0){
          allMessage.data.order_state_text="订单已取消"
          allMessage.data.order_state_text_bottom="订单已取消"
        }else if(allMessage.data.order_state==10){
          allMessage.data.order_state_text="等待您的付款"
          allMessage.data.order_state_text_bottom="剩余23小时59分自动关闭"
        }else if(allMessage.data.order_state==20){
          allMessage.data.order_state_text="待发货"
          allMessage.data.order_state_text_bottom="请耐心等待商家发货..."
        }else if(allMessage.data.order_state==30){
          allMessage.data.order_state_text="待收货"
          allMessage.data.order_state_text_bottom="商家已发货，宝贝正向你赶来..."
        }else if(allMessage.data.order_state==40){
          allMessage.data.order_state_text="已完成"
          allMessage.data.order_state_text_bottom="订单已完成，期待您的下次购买"
        }
        allMessage.data.add_time=app.format(allMessage.data.add_time)//创建时间
        allMessage.data.payment_time=allMessage.data.payment_time?app.format(allMessage.data.payment_time):""//支付时间
        allMessage.data.send_time=allMessage.data.send_time?app.format(allMessage.data.send_time):""//发货时间
        allMessage.data.finnshed_time=allMessage.data.finnshed_time?app.format(allMessage.data.finnshed_time):""//收货时间
        allMessage.data.cancel_time=allMessage.data.cancel_time?app.format(allMessage.data.cancel_time):""//取消时间

        allMessage.data.goods_startime=allMessage.data.goods_startime?app.format(allMessage.data.goods_startime):""//起拍时间
        allMessage.data.auction_time=allMessage.data.auction_time?app.format(allMessage.data.auction_time):""//竞拍成功时间
        that.setData({
          address:allMessage.address,//地址信息
          goods:allMessage.data,//商品
          logistics:allMessage.logistics//物流信息
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