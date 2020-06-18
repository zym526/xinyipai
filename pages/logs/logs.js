// pages/login/login.js
var startX, endX;
var moveFlag = true;// 判断执行滑动事件
Page({
  /**
   * 页面的初始数据
   */
  data: {
    login:[1,2,3],
    now:1,
    title1:"芯系健康",
    title2:"每一个新物品的诞生都为家庭带来",
    title3:"新的希望和幸福",
    centerImg:"one.png"
  },


  touchStart: function (e) {
    startX = e.touches[0].pageX; // 获取触摸时的原点
    moveFlag = true;
  },
  // 触摸移动事件
  touchMove: function (e) {
    endX = e.touches[0].pageX; // 获取触摸时的原点
    if (moveFlag) {
      if (endX - startX > 50) {
        this.move2right();
        moveFlag = false;
      }
      if (startX - endX > 50) {
        this.move2left();
        moveFlag = false;
      }
    }

  },
  // 触摸结束事件
  touchEnd: function (e) {
    moveFlag = true; // 回复滑动事件   
  },
  changeNow(){

  },
  move2left() {
    var that = this;
    if(that.data.now!==3){
      var newNow=this.data.now
      this.setData({
        now:newNow+1
      })
      if(that.data.now===1){
        this.setData({
          title1:"芯系健康",
          title2:"每一个新物品的诞生都为家庭带来",
          title3:"新的希望和幸福",
          centerImg:"one.png"
        })
      }else if(that.data.now===2){
        this.setData({
          title1:"意享生活",
          title2:"享受生活给予人类带来着无穷乐趣",
          title3:"并改变生活方式",
          centerImg:"one.png"
        })
      }else{
        this.setData({
          title1:"第三页",
          title2:"第三页",
          title3:"第三页",
          centerImg:"one.png"
        })
      }
      console.log(this.data.now)
    }else{
      wx.switchTab({
        url: '/pages/index/index',
      });
    }
  },
  move2right() {
    var that = this;
    if(that.data.now!==1){
      var newNow=this.data.now
      this.setData({
        now:newNow-1
      })
      if(that.data.now===1){
        this.setData({
          title1:"芯系健康",
          title2:"每一个新物品的诞生都为家庭带来",
          title3:"新的希望和幸福",
          centerImg:"one.png"
        })
      }else if(that.data.now===2){
        this.setData({
          title1:"意享生活",
          title2:"享受生活给予人类带来着无穷乐趣",
          title3:"并改变生活方式",
          centerImg:"one.png"
        })
      }else{
        this.setData({
          title1:"第三页",
          title2:"第三页",
          title3:"第三页",
          centerImg:"one.png"
        })
      }
      console.log(that.data.now)
    }
  },
  // 跳转至首页
  toHome:function(){
    wx.switchTab({
      url: '/pages/index/index',
    });
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