
//获取应用实例
const app = getApp()

Page({
  mixins: [require('../../mixin/themeChanged')],
  data: {
    inputInside:"高端厨具当前热拍",//搜索框默认文字
    valueInput:"",//输入框内容
    classify:[//轮播图下方分区
      {img:"sign-in.png",title:"签到领赏"},
      {img:"second-beats.png",title:"极限秒拍"},
      {img:"lottery.png",title:"抽奖专区"},
      {img:"invite.png",title:"邀请好友"},
      {img:"footprint.png",title:"浏览足迹"},
    ],
    secondBeats3:[],//具体拍品
    news:"张女士成功拍卖洗碗机一台",//芯意快报
    auctionItems:["推荐拍品","全部拍品"],//推荐/全部拍品
    strong:"推荐拍品",//当前选中拍品
    bottomIndex:1,//请求页数
    isHidden:true,//暂无数据是否显示
    lock:true,//拍品请求锁定
  },
  onLoad: function () {
    var that=this;
    // 获取轮播图
    that.lunbotu();
    // 获取极限秒拍商品
    that.jixianmiaopai();
    // 获取品牌秒拍
    that.pinpaimiaopai();
    // 获取推荐拍品商品
    that.tuijianpaipin(1);
  },
  // 设置轮播图高度
  imgH:function(e){
    this.setData({
        Hei:app.widthLB(e,24)//设置高度
    })
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
  // 轮播图请求
  lunbotu: function(){
    var that=this
    app.http({
      url:"wxindex/banner",
      method:"GET",
    }).then(res=>{
      that.setData({
        lunboImages:res.data.data
      })
    }).catch(err=>{
      app.showToast(err.data.msg)
    })
  },
  // 极限秒拍请求
  jixianmiaopai: function(){
    var that=this
    app.http({
      url:"wxindex/limitshot",
      method:"POST",
      param:{
        pages:1
      }
    }).then(res=>{
      // 截取前三个商品
      var nowSecondBeats=res.data.data.slice(0,3)
      that.setData({
        secondBeats:nowSecondBeats
      })
      that.changeTime(that.data.secondBeats,"secondBeats")
    }).catch(err=>{
      app.showToast(err.data.msg)
    })
  },
  // 品牌秒拍请求
  pinpaimiaopai: function(){
    var that=this
    app.http({
      url:"wxindex/brandshot",
      method:"GET",
      param:{
        pages:1
      }
    }).then(res=>{
      // 截取前三个商品
      var nowSecondBeats2=res.data.data.slice(0,3);
      that.setData({
        secondBeats2:nowSecondBeats2
      })
      that.changeTime(that.data.secondBeats2,"secondBeats2")
    }).catch(err=>{
      app.showToast(err.data.msg)
    })
  },
  // 推荐拍品请求/全部拍品请求
  tuijianpaipin: function(a){
    var that=this
    var item=""
    // 根据当前情况区分请求
    if(this.data.strong==="推荐拍品"){
      item="wxindex/recommendshot"
    }else{
      item="wxindex/wholeshot"
    }
    if(that.data.lock){
      app.http({
        url:item,
        method:"GET",
        param:{
          pages:a
        }
      }).then(res=>{
        console.log(res)
        if(res.data.data.length!==0){
          var newData=that.data.secondBeats3;
          that.setData({
            secondBeats3:newData.concat(res.data.data)
          })
          if(res.data.data.length<10){
            that.setData({
              lock:false,
              isHidden:false,
            })
          }
        }else{
          that.setData({
            lock:false
          })
        }
      }).catch(err=>{
        app.showToast(err.data.msg)
      })
    }else{
      app.showToast("没有更多数据了~")
    }
  },
  // 跳转至商品详情页
  toInfo: function(e){
    // 获取商品id
    var id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/info/info?id='+id,
    })
  },
  // 轮播图跳转
  toInfoLB: function(e){
    var url=e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  // 倒计时
  changeTime: function(second,texts){
    var that=this;
    //获取当前时间  
    var date = new Date();  
    var now = parseInt(date.getTime()/1000); 
    // 获取三个商品结束时间
    var one=(second[0].goods_endtime);
    var two=(second[1].goods_endtime);
    var three=(second[2].goods_endtime);
    // 倒计时
    var goods1=texts+"["+0+"].time"
    var goods2=texts+"["+1+"].time"
    var goods3=texts+"["+2+"].time"
    // 获取三个商品结束时间
    setTimeout(function(){
      if(one-now>0){
        that.setData({
          [goods1]:app.formatDuring(one-now)
        })
      }else{
        that.setData({
          [goods1]:"00:00:00"
        })
      }
      if(two-now>0){
        that.setData({
          [goods2]:app.formatDuring(two-now)
        })
      }else{
        that.setData({
          [goods2]:"00:00:00"
        })
      }
      if(three-now>0){
        that.setData({
          [goods3]:app.formatDuring(three-now)
        })
      }else{
        that.setData({
          [goods3]:"00:00:00"
        })
      }
      that.changeTime(second,texts)
    },1000)
  },
  // 改变拍品选项
  changeStrong: function(event){
    var item = event.currentTarget.dataset.item
    // 当改变时将数据重置
    this.setData({
      strong:item,
      isHidden:true,
      lock:true
    });
    // 根据item判断请求
    this.data.bottomIndex=1;
    this.data.secondBeats3=[]
    this.tuijianpaipin(this.data.bottomIndex)
  },
  // 跳转页面（签到领奖/极限秒拍/抽奖专区/邀请好友/浏览足迹）
  toPage: function(event){
    var nowTitle=event.currentTarget.dataset.title;
    if(nowTitle==="浏览足迹"){
      wx.navigateTo({
        url: '/pages/footprint/footprint',
      })
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
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 1300) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var nowBottomIndex=this.data.bottomIndex
    console.log(nowBottomIndex)
    this.setData({
      bottomIndex:nowBottomIndex+1
    })
    this.tuijianpaipin(this.data.bottomIndex);
  },
})
