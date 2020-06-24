// pages/orderDetail/orderDetail.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_state_text_bottom:""
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
    var contentText=""
    if(that.data.goods.order_type==0){
      contentText="取消拍卖订单后，保证金将不予返还，您确定要取消订单吗？"
    }else{
      contentText="您确定要取消订单吗？"
    }
    wx.showModal({
      content: contentText,
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
          }).catch(err=>{
            app.showToast("请求失败，请稍后重试~")
          })
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
                }).catch(err=>{
                  app.showToast("请求失败，请稍后重试~")
                })
              }
            }).catch(err=>{
              app.showToast("请求失败，请稍后重试~")
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
    }).catch(err=>{
      app.showToast("请求失败，请稍后重试~")
    })
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
          }).catch(err=>{
            app.showToast("请求失败，请稍后重试~")
          })
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
          }).catch(err=>{
            app.showToast("请求失败，请稍后重试~")
          })
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
        id:that.data.orderId,
        uid:wx.getStorageSync('userId')
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
          that.setData({
            order_state_text_bottom:"订单已取消"
          })
        }else if(allMessage.data.order_state==10){
          allMessage.data.order_state_text="等待您的付款"
          // 一天后结束
          var endTime=(allMessage.data.add_time+(24*60*60))*1000
          that.data.time=setInterval(function(){
            // 当前时间
            var nowTime=new Date().getTime()
            if(nowTime>=endTime){
              // 跳转订单列表
              wx.redirectTo({
                url: '/pages/indent/indent',
              })
            }else{
              that.setData({
                order_state_text_bottom:"剩余"+app.formatDuring(parseInt((endTime-nowTime)/1000))+"自动取消"
              })
            }
          },1000);
        }else if(allMessage.data.order_state==20){
          allMessage.data.order_state_text="待发货"
          that.setData({
            order_state_text_bottom:"请耐心等待商家发货..."
          })
        }else if(allMessage.data.order_state==30){
          allMessage.data.order_state_text="待收货"
          that.setData({
            order_state_text_bottom:"商家已发货，宝贝正向你赶来..."
          })
        }else if(allMessage.data.order_state==40){
          allMessage.data.order_state_text="已完成"
          that.setData({
            order_state_text_bottom:"订单已完成，期待您的下次购买"
          })
        }   

        allMessage.data.add_time=app.format(allMessage.data.add_time)//创建时间
        allMessage.data.payment_time=allMessage.data.payment_time?app.format(allMessage.data.payment_time):""//支付时间
        allMessage.data.send_time=allMessage.data.send_time?app.format(allMessage.data.send_time):""//发货时间
        allMessage.data.finnshed_time=allMessage.data.finnshed_time?app.format(allMessage.data.finnshed_time):""//收货时间
        allMessage.data.cancel_time=allMessage.data.cancel_time?app.format(allMessage.data.cancel_time):""//取消时间

        allMessage.data.goods_startime=allMessage.goods_startime?app.format(allMessage.goods_startime):""//起拍时间
        allMessage.data.auction_time=allMessage.auction_time?app.format(allMessage.auction_time):""//竞拍成功时间
        allMessage.data.auction_price=allMessage.auction_price?allMessage.auction_price:"免保证金"//保证金额

        that.setData({
          address:allMessage.address,//地址信息
          goods:allMessage.data,//商品
          logistics:allMessage.logistics//物流信息
        })
      }else{
        app.showToast(res.data.msg)
      }
    }).catch(err=>{
      app.showToast("请求失败，请稍后重试~")
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.time)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.time)
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