// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    threeWhite:[
      {img:"wuliu.png",title:"交易物流"},
      {img:"huodong.png",title:"活动精选"},
      {img:"tongzhi.png",title:"消息通知"}
    ],
    message:[
      {img:"photo1.png",title:"芯意客服",time:"10:00",messageOne:"链接"},
      {img:"photo.png",title:"大嘴猴旗舰店",time:"05:30",messageOne:"商品更加一步送达"},
      {img:"photo1.png",title:"芯意客服",time:"10:00",messageOne:"链接"},
      {img:"photo.png",title:"大嘴猴旗舰店",time:"05:30",messageOne:"商品更加一步送达"},
      {img:"photo1.png",title:"芯意客服",time:"10:00",messageOne:"链接"},
      {img:"photo.png",title:"大嘴猴旗舰店",time:"05:30",messageOne:"商品更加一步送达"}
    ]
  },
  // 跳转页面
  toNewPage: function(event){
    var newTitle=event.currentTarget.dataset.title;
    if(newTitle==="交易物流"){
      wx.navigateTo({
        url: '/pages/logistics/logistics',
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