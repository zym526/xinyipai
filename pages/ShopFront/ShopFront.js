// pages/ShopFront/ShopFront.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"首页",//导航
    // zhuangtai:"未开始",//是否开始活动
    attention:"已关注",//是否关注店铺
    qitaData:[],//商品/推荐/新品/价格
    bottomIndex:1,//页数
    indexHidden:false,//首页数据显示隐藏
    jiage:["shang1.png","xia1.png"],//价格高低图标
    lock:true,//请求锁定
  },

  // 设置轮播图高度
  imgH:function(e){
    this.setData({
        Hei:app.widthLB(e,24)//设置高度
    })
  },
  // 关注/取消关注
  changeAttention: function(){
    var that=this
    // 判断是否登录,登录情况下
    if(wx.getStorageSync('userInfo')&&wx.getStorageSync('openId')){
      if(that.data.attention==="关注"){
        app.http({
          url:"wxstore/storefollow",
          method:"POST",
          param:{
            fav_id:that.data.id,
            user_id:wx.getStorageSync('userId'),
            fav_type:"store"
          }
        }).then(res=>{
          if(res.data.code==200){
            that.setData({
              attention:"已关注"
            })
            app.showToast("关注成功")
          }else{
            app.showToast("关注失败")
          }
        }).catch(err=>{
          app.showToast("请求失败，请稍后重试~")
        })
      }else{
        app.http({
          url:"wxstore/storedelfollow",
          method:"POST",
          param:{
            fav_id:that.data.id,
            user_id:wx.getStorageSync('userId'),
            fav_type:"store"
          }
        }).then(res=>{
          if(res.data.code==200){
            that.setData({
              attention:"关注"
            })
          }else{
            app.showToast("取消关注失败")
          } 
        }).catch(err=>{
          app.showToast("请求失败，请稍后重试~")
        })
      }
    }else{
      // 未登录情况下跳转登录页面，并保存当前页面
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  // 跳转商品详情页
  toInfo: function(){
    wx.navigateTo({
      url: '/pages/info/info',
    })
  },
  // 跳转店铺详情页
  toShopDetails: function(){
    var that=this
    wx.navigateTo({
      url: '/pages/shopDetails/shopDetails?id='+that.data.id,
    })
  },
  // 切换首页/商品/推荐/新品/价格
  change: function(e){
    var nowTitle=e.currentTarget.dataset.title;
    var that=this
    that.setData({
      bottomIndex:1,
      qitaData:[],
      lock:true
    })
    if(nowTitle==="首页"){
      that.setData({
        title:"首页",
        indexHidden:false,
        jiage:['shang1.png','xia1.png']
      })
      this.getIndexInfo();
    }else if(nowTitle==="商品"){
      that.setData({
        title:"商品",
        indexHidden:true,  
        jiage:['shang1.png','xia1.png']     
      })
      // 获取商品数据
      that.getData(that.data.bottomIndex);
    }else if(nowTitle==="推荐"){
      that.setData({
        title:"推荐",
        indexHidden:true,
        jiage:['shang1.png','xia1.png']
      })
      // 获取推荐商品数据
      that.getData(that.data.bottomIndex);
    }else if(nowTitle==="新品"){
      that.setData({
        title:"新品",
        indexHidden:true,
        jiage:['shang1.png','xia1.png']
      })
      // 获取新品商品数据
      that.getData(that.data.bottomIndex);
    }else if(nowTitle==="价格"){
      that.setData({
        title:"价格",
        indexHidden:true
      })
      if(that.data.jiage[0]=='shang1.png'&&that.data.jiage[1]=='xia1.png'){
        that.setData({
          jiage:['shang.png','xia1.png'],//将数据改为价格从低到高排序
          jiageNow:"上"
        })
      }else if(that.data.jiage[0]=='shang.png'){
        that.setData({
          jiage:['shang1.png','xia.png'],
          jiageNow:"下"
        })
      }else if(that.data.jiage[1]=='xia.png'){
        that.setData({
          jiage:['shang.png','xia1.png'],//将数据改为价格从低到高排序
          jiageNow:"上"
        })
      }
      that.getData(that.data.bottomIndex);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      id:options.id
    })
    // 判断用户是否登录
    if(wx.getStorageSync('userInfo')&&wx.getStorageSync('openId')){
      app.http({
        url:"wxstore/storeisfollow",
        method:"POST",
        param:{
          fav_id:options.id,//店铺id
          user_id:wx.getStorageSync('userId'),
          fav_type:"store"
        }
      }).then(res=>{
        if(res.data.code==200){
          that.setData({
            attention:"已关注"
          })
        }else{
          that.setData({
            attention:"关注"
          })
        }
      }).catch(err=>{
        app.showToast("请求失败，请稍后重试~")
      })
      // 未登录则显示未收藏
    }else{
      // 未登录则显示关注
      this.setData({
        attention:"关注"
      })
    }
    // 店铺信息请求
    app.http({
      url:"wxstore/storedetail",
      method:"POST",
      param:{
        id:options.id
      }
    }).then(res=>{
      // 判断是否认证
      if(res.data.data.store_state===1){
        res.data.data.store_state=true
      }else{
        res.data.data.store_state=false
      }
      // 转换为好评率百分比
      that.setData({
        shopAllInfo:res.data.data,
        haopinglv:((res.data.data.store_desccredit/5)*100).toFixed(2)
      })
    }).catch(err=>{
      app.showToast("请求失败，请稍后重试~")
    })
    // 获取首页数据
    that.getIndexInfo();
  },
  // 点击更更多跳转推荐
  lookTuijian(){
    var that=this
    that.setData({
      bottomIndex:1,
      qitaData:[],
      title:"推荐",
      indexHidden:true,
      jiage:['shang1.png','xia1.png']
    })
    // 获取推荐商品数据
    that.getData(that.data.bottomIndex)
  },
  // 点击更多跳转新品
  lookNew(){
    var that=this
    that.setData({
      bottomIndex:1,
      qitaData:[],
      title:"新品",
      indexHidden:true,
      jiage:['shang1.png','xia1.png']
    })
    // 获取新品商品数据
    that.getData(that.data.bottomIndex)
  },
  // 获取首页数据
  getIndexInfo(){
    var that=this
    // 店铺首页数据请求
    app.http({
      url:"wxstore/storeindexgoods",
      method:"POST",
      param:{
        id:that.data.id,
        pages:1
      }
    }).then(res=>{
      console.log("店铺首页数据",res.data.data)
      var allData=res.data.data;
      // 截取新品和推荐商品前两个
      allData.new=allData.new.slice(0,2);
      allData.recommend=allData.recommend.slice(0,2);
      // 获取当前时间戳
      var nowDay=new Date().getTime();
      // 判断推荐的当前活动是进行中/未开始/已结束
      allData.recommend.forEach((item)=>{
        // 如果当前时间小于开始时间则未开始
        if(nowDay<item.goods_startime*1000){
          item.text="未开始"
        // 如果当前时间大于开始时间小于结束时间则进行中
        }else if(nowDay>=item.goods_startime*1000 && nowDay<=item.goods_endtime*1000){
          item.text="进行中"
        // 如果当前时间大于结束时间则已结束
        }else if(nowDay>item.goods_endtime*1000){
          item.text="已结束"
        }
      })
      // 判断新品的当前活动是进行中/未开始/已结束
      allData.new.forEach((item)=>{
        // 如果当前时间小于开始时间则未开始
        if(nowDay<item.goods_startime*1000){
          item.text="未开始"
        // 如果当前时间大于开始时间小于结束时间则进行中
        }else if(nowDay>=item.goods_startime*1000 && nowDay<=item.goods_endtime*1000){
          item.text="进行中"
        // 如果当前时间大于结束时间则已结束
        }else if(nowDay>item.goods_endtime*1000){
          item.text="已结束"
        }
      })
      that.setData({
        allData:allData
      })
    }).catch(err=>{
      app.showToast("请求失败，请稍后重试~")
    })
  },
  // 获取数据（商品/推荐/新品/价格）
  getData(n){
    var that=this
    var urlNew
    if(that.data.title=="商品"){
      urlNew="wxstore/storegoodslist"
    }else if(that.data.title=="推荐"){
      urlNew="wxstore/storerecommendlist"
    }else if(that.data.title=="新品"){
      urlNew="wxstore/storenewlist"
    }else if(that.data.title=="价格"){
      if(that.data.jiageNow=="上"){
        urlNew="wxstore/storepricelist"
      }else{
        urlNew="wxstore/storepriceuplist"
      }
    }
    if(that.data.lock){
      app.http({
        url:urlNew,
        method:"POST",
        param:{
          id:that.data.id,
          pages:n
        }
      }).then(res=>{
        console.log("店铺商品数据",res.data.data)
        that.chuliData(res.data.data)
        if(res.data.data.length<10){
          that.setData({
            lock:false
          })
        }
      }).catch(err=>{
        app.showToast("请求失败，请稍后重试~")
      })
    }else{
      app.showToast("暂无更多数据~")
    }
  }, 
  // 将商品/推荐/新品/价格返回的数据进行处理
  chuliData(data){
    var that=this
    if(data.length!==0){
      var allData=data;
      // 获取当前时间戳
      var nowDay=new Date().getTime();
      // 判断当前商品活动是进行中/未开始/已结束
      allData.forEach((item)=>{
        // 如果当前时间小于开始时间则未开始
        if(nowDay<item.goods_startime*1000){
          item.text="未开始"
        // 如果当前时间大于开始时间小于结束时间则进行中
        }else if(nowDay>=item.goods_startime*1000 && nowDay<=item.goods_endtime*1000){
          item.text="进行中"
        // 如果当前时间大于结束时间则已结束
        }else if(nowDay>item.goods_endtime*1000){
          item.text="已结束"
        }
      })
      var newData=that.data.qitaData;
      that.setData({
        qitaData:newData.concat(allData)
      })
    }else{
      wx.showToast({
        title: '没有更多数据',
        icon: 'none',
        duration: 2000
      })
    }
  }, 
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 500) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  //回到顶部
  goTop: function (e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
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
    var that=this
    var newBottomIndex=this.data.bottomIndex
    this.setData({
      bottomIndex:newBottomIndex+1
    })
    if(that.data.title!="首页"){
      that.getData(that.data.bottomIndex)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})