// pages/confirmAnOrder/confirmAnOrder.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number:1,//商品数量
    maxNumber:1,//最大的商品数量
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
    var that=this
    that.setData({
      number:event.detail,
      allMoney:event.detail*that.data.parice
    })
  },
  // 跳转地址页面
  toAddress(){
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  // 下订单
  toBuy(){
    var that=this
    wx.showLoading({
      title: "正在加载",
      mask: true
    })
    // 发起请求订单创建
    app.http({
      url:"wxorder/ordercreate",
      method:"POST",
      param:{
        uid:wx.getStorageSync('userId'),//用户id
        gid:that.data.id,//商品id
        order_type:that.data.justAndAuction,//0拍卖，1直购
        count:that.data.number,//商品数量
        daddress_id:that.data.nowAddress.address_id,//地址id
        reciver_name:that.data.nowAddress.address_realname,//收货人姓名
        reciver_info:that.data.nowAddress.address_mob_phone,//收货人手机号
        reciver_province_id:that.data.nowAddress.provinceid,//省份id
        reciver_city_id:that.data.nowAddress.cityid,//城市id
        reciver_town_id:that.data.nowAddress.areaid,//县id
        reciver_count_id:that.data.nowAddress.area_infoid,//街道id
      }
    }).then(res=>{
      console.log(res)
      // 成功获取数据
      if(res.data.code==200){
        let order_sn=res.data.order_sn
        wx.requestPayment({  
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          paySign: res.data.data.paySign,
          timeStamp: res.data.data.timeStamp,
          signType:res.data.data.signType,
          success(res){
            wx.hideLoading()
            // 支付成功后状态查询
            console.log(order_sn)
            app.http({
              url:"wxapi/orderstatus",
              method:"POST",
              param:{
                order_sn//订单号
              }
            }).then(res=>{
              console.log("支付成功后状态查询：",res)
              if(res.data.data.result_code=="SUCCESS"){
                app.showToast("支付成功")
                // 支付成功后回调
                app.http({
                  url:"wxorder/uporder",
                  method:"POST",
                  param:{
                    order_sn:order_sn,//订单号
                  }
                }).then(res=>{}).catch(err=>{})
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
    }).catch(err=>{
      wx.hideLoading()
      app.showToast(err.data.msg)
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    // 将商品id存储
    that.setData({
      id:app.globalData.gid,
      justAndAuction:app.globalData.justAndAuction,//1为直购，0为拍卖
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
          addressAll:res.data.data,
          nowAddress:res.data.data[0]
        })
        that.data.addressAll.forEach(item=>{
          // 判断app.js中是否有地址id，有的话就是从地址列表过来，没有则不是
          if(app.globalData.address_id==""){
            if(item.address_is_default=="1"){
              that.setData({
                nowAddress:item
              })
            }
          }else{
            if(item.address_id==app.globalData.address_id){
              that.setData({
                nowAddress:item
              })
            }
          }
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
    // 获取商品信息
    app.http({
      url:"wxindex/shotdetail",
      method:"GET",
      param:{
        id:that.data.id,
        uid:""
      }
    }).then(res=>{
      console.log(res)
      if(res.data.code==200){
        var data=res.data.data
        that.setData({
          goods_name:data.shotdetail.goods_name,//商品名称
          imgurl:data.shotbody.imgurl,//商品图片
          goods_freight:data.shotdetail.goods_freight=="0.00"?"免运费":data.shotdetail.goods_freight,//运费
        })
        // 判断直购1，拍卖0
        if(that.data.justAndAuction==1){
          that.setData({
            parice:data.shotdetail.goods_promotion_price,//商品价格
            maxNumber:data.shotdetail.goods_storage-data.shotdetail.goods_salenum,//购买数量
            allMoney:data.shotdetail.goods_promotion_price,//小计
          })
        }else{
          that.setData({
            parice:data.auctionporce[0].price,//拍卖成交价
            allMoney:data.auctionporce[0].price,//小计
          })
        }
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