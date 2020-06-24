// pages/indent/indent.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topTab:[{text:"全部",state:100},{text:"待付款",state:10},{text:"待发货",state:20},{text:"待收货",state:30}],
    nowTab:{text:"全部",state:100},
    pages:1,//页数
    lock:true,//请求锁
    allOrder:[],//所有商品数据
    isNoMessage:true,//暂无数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      date:options.date
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 改变导航
  changeTab: function(event){
    var that=this
    var index=event.currentTarget.dataset.index;
    that.setData({
      nowTab:that.data.topTab[index],//修改当前tab
      pages:1,//页数重置
      lock:true,//请求重置
      allOrder:[],//所有商品重置
    })
    // 发起请求
    that.getOrder(that.data.pages,that.data.nowTab.state)
  },
  // 获取用户订单
  getOrder(pages,order_state){
    var that=this
    if(that.data.lock){
      that.setData({
        isNoMessage:true
      })
      // 获取买家订单
      app.http({
        url:"wxorder/userorder",
        method:"POST",
        param:{
          id:wx.getStorageSync('userId'),//用户id
          pages,//页数
          order_state//订单状态
        }
      }).then(res=>{
        console.log(res)
        // order_type中1为直购，0为拍卖
        if(res.data.code==200){
          var data=res.data.data//所有商品数据
          if(data.length!=0){//有商品
            data.forEach(item=>{
              // 判断是直购还是拍卖的商品
              if(item.order_type==1){
                item.order_type_text="直购"
              }else if(item.order_type==0){
                item.order_type_text="拍卖"
              }
              // 判断当前订单状态
              if(item.order_state==0){
                item.order_state_text="已取消"
              }else if(item.order_state==10){
                item.order_state_text="待付款"
              }else if(item.order_state==20){
                item.order_state_text="待发货"
              }else if(item.order_state==30){
                item.order_state_text="已发货"
              }else if(item.order_state==40){
                item.order_state_text="已完成"
              }
            })
            // 当前商品数据，将新请求的数据拼接后面
            var nowAllOrder=that.data.allOrder
            that.setData({
              allOrder:nowAllOrder.concat(data)
            })
            console.log(that.data.allOrder)
          }
        }else if(res.data.code==204){
          that.setData({
            lock:false
          })
          // 如果为第一页并且没有数据
          if(that.data.pages==1){
            that.setData({
              isNoMessage:false
            })
          }
          app.showToast("没有了~")
        }
      }).catch(err=>{
        app.showToast("请求失败，请稍后重试~")
      })
    }
  },
  // 取消订单
  cancelOrder(e){
    var that=this
    var order_sn=e.currentTarget.dataset.ordersn//订单号
    //是直购还是拍卖
    var contentText=""
    if(e.currentTarget.dataset.ordertype==0){
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
              that.setData({
                pages:1,//页数重置
                lock:true,//请求重置
                allOrder:[],//所有商品重置
              })
              that.getOrder(that.data.pages,that.data.nowTab.state)
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
              that.setData({
                pages:1,//页数重置
                lock:true,//请求重置
                allOrder:[],//所有商品重置
              })
              that.getOrder(that.data.pages,that.data.nowTab.state)
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
                  that.setData({
                    pages:1,//页数重置
                    lock:true,//请求重置
                    allOrder:[],//所有商品重置
                  })
                  that.getOrder(that.data.pages,that.data.nowTab.state)
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
              that.setData({
                pages:1,//页数重置
                lock:true,//请求重置
                allOrder:[],//所有商品重置
              })
              that.getOrder(that.data.pages,that.data.nowTab.state)
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
  // 跳转详情
  toOrderDetail(e){
    app.globalData.orderId=""
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?orderId='+e.currentTarget.dataset.orderid,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    console.log(that.data.date)
    if(wx.getStorageSync('userInfo')&&wx.getStorageSync('openId')){
      if(that.data.date){
        that.getOrder(that.data.pages,that.data.date)//如果有传参则根据传参获取
        // 根据传参的不同修改对应的tab
        if(that.data.date==10){
          that.setData({
            nowTab:{text:"待付款",state:10}
          })
        }else if(that.data.date==20){
          that.setData({
            nowTab:{text:"待发货",state:20}
          })
        }else if(that.data.date==30){
          that.setData({
            nowTab:{text:"待收货",state:30}
          })
        }
      }else{
        that.getOrder(that.data.pages,100)//获取全部用户订单信息
      }
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
    var that=this
    var nowPages=that.data.pages//当前页码
    this.setData({
      pages:nowPages+1//触底+1
    })
    this.getOrder(that.data.pages,that.data.nowTab.state);//获取商品信息
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})