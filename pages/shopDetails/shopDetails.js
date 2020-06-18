// pages/shopDetails/shopDetails.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guanzhu:"关注",
    guanzhuHi:false
  },
  // 关注
  changeGZ: function(){
    if(this.data.guanzhu==="关注"){
      this.setData({
        guanzhu:"已关注",
        guanzhuHi:true
      })
    }else{
      this.setData({
        guanzhu:"关注",
        guanzhuHi:false
      })
    }
  },
  // 联系卖家，拨打电话
  phoneCall: function(e){
    console.log(e)
    var phone=e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    app.http({
      url:"wxstore/storedetail",
      method:"POST",
      param:{
        id:options.id
      }
    }).then(res=>{
      if(res.data.data.store_addtime){
        res.data.data.store_addtime=app.formatDate(res.data.data.store_addtime*1000)
      }
      that.setData({
        shopAllInfo:res.data.data,
        haopinglv:((res.data.data.store_desccredit/5)*100).toFixed(2)
      })
    }).catch(err=>{
      app.showToast(err.data.msg)
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