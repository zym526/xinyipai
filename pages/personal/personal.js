// pages/personal/personal.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base64:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXcAAAEMCAYAAAA/Jfb8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkFFMDk4OENFN0VDQzExRUFCRkFGRjA3RkZGNkJFMkQxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkFFMDk4OENGN0VDQzExRUFCRkFGRjA3RkZGNkJFMkQxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QUUwOTg4Q0M3RUNDMTFFQUJGQUZGMDdGRkY2QkUyRDEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QUUwOTg4Q0Q3RUNDMTFFQUJGQUZGMDdGRkY2QkUyRDEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7HUtTuAAAdZ0lEQVR42uzd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",
    allNum:{
      finish:0,
      nopay:0,
      nosend:0,
      pay:0
    }
  },
  // 跳转订单
  toDingdan: function(e){
    console.log(e.currentTarget.dataset.index)
    if(e.currentTarget.dataset.index){
      console.log("有参数")
      wx.navigateTo({
        url: '/pages/indent/indent?date='+e.currentTarget.dataset.index,
      })
    }else{
      console.log("无参数")
      wx.navigateTo({
        url: '/pages/indent/indent',
      })
    }
    
  },
  // 跳转收获地址
  toAddress: function(){
    if(wx.getStorageSync('userId')){
      app.globalData.personal=1
      wx.navigateTo({
        url: '/pages/address/address',
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  // 跳转保证金
  toCashDeposit(){
    if(wx.getStorageSync('userId')){
      wx.navigateTo({
        url: '/pages/cashDeposit/cashDeposit',
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  // 跳转参拍页面
  toCompete(){
    if(wx.getStorageSync('userId')){
      wx.navigateTo({
        url: '/pages/compete/compete',
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  // 跳转赚钱页面
  toCleanUp(){
    if(wx.getStorageSync('userId')){
      wx.navigateTo({
        url: '/pages/cleanUp/cleanUp',
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
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
    var that=this
    if(wx.getStorageSync('userId')){
      app.http({
        url:"wxorder/userordercount",
        param:{
          id:wx.getStorageSync('userId')
        }
      }).then(res=>{
        if(res.data.code==200){
          that.setData({
            allNum:res.data.data
          })
        }else{
          app.showToast(res.data.msg)
        }
      }).catch(err=>{
        app.showToast("请求失败，请稍后重试~")
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