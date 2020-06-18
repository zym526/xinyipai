// pages/allPJ/allPJ.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allLeibie:["全部(456条)","有图(200条)","视频(150条)"],
    newItem:"",
    value:5,
    allPingjia:[
      {image:"bgMe.png",name:"你的昵称或名字",value:"5",time:"2020/01/08",content:"评价内容",images:["bgMe.png","bgMe.png","bgMe.png","bgMe.png","bgMe.png"]},
      {image:"bgMe.png",name:"你的昵称或名字",value:"5",time:"2020/01/08",content:"评价内容",images:["bgMe.png","bgMe.png","bgMe.png","bgMe.png","bgMe.png"]},
      {image:"bgMe.png",name:"你的昵称或名字",value:"5",time:"2020/01/08",content:"评价内容",images:["bgMe.png","bgMe.png","bgMe.png","bgMe.png","bgMe.png"]},
      {image:"bgMe.png",name:"你的昵称或名字",value:"5",time:"2020/01/08",content:"评价内容",images:["bgMe.png","bgMe.png","bgMe.png","bgMe.png","bgMe.png"]},
    ]
  },
  // 上分类
  changeFenlei: function(e){
    var item=e.currentTarget.dataset.item
    this.setData({
      newItem:item
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