// pages/classify/classify.js
const app=getApp()
Page({
  mixins: [require('../../mixin/themeChanged')],
  /**
   * 页面的初始数据
   */
  data: {
    valueInput: "",//搜索输入框
    inputInside:"高端厨具当前热拍",//输入框默认文字
    strong:"",//当前选中分类
  },
  // 顶部输入框内容改变
  onChange(e) {
    this.setData({
      valueInput: e.detail,
    });
  },
  // 搜索
  onSearch() {
    console.log('搜索' + this.data.valueInput);
  },
  // 触发修改分类
  changStrong: function(event){
    var that=this
    // 获取当前选中项
    var item = event.currentTarget.dataset.item
    this.setData({
      strong:item.gc_name
    })
    that.data.all.forEach(inside=>{
      // 遍历所有数据，将与当前点击数据的gc_id和gc_name相同里的gc_parent_id替换rightAll
      if(item.gc_id==inside.gc_id&&item.gc_name==inside.gc_name){
        that.setData({
          rightAll:inside.gc_parent_id
        })
      }
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
    var that=this//获取分类列表
    app.http({
      url:"wxcategory/category",
      method:"GET"
    }).then(res=>{
      console.log(res)
      that.setData({
        all:res.data,//所有信息
        strong:res.data[0].gc_name,//当前选中的分类
        rightAll:res.data[0].gc_parent_id,//当前选中分类的所有
      })
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