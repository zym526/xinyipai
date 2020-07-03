// pages/info/info.js
const app=getApp();
import Dialog from '../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zhanshou:"展开",//商品介绍
    isShow:true,//竞拍人员展示
    isBuyNow:true,//是否可以直接购买
    isPat:true,//判断是否还在进行中，立即抢拍是否可用
    isBid:false,//出价弹窗
    isCash:false,//保证金弹窗
    radio:"1",//竞拍协议同意
    reduceColor:"#999999",
    onceLock:true,//是否是初次进入
    // 位置
    x:0,
    y:200,
  },
  // 进入店铺首页,并将店铺id传过去
  toShop: function(){
    wx.navigateTo({
      url: '/pages/ShopFront/ShopFront?id='+this.data.store.store_id,
    })
  },
  // 设置轮播图高度
  imgH:function(e){
    this.setData({
        Hei:app.widthLB(e,0)//设置高度
    })
  },
  // 切换展开收起
  changeSZ: function(){
    if(this.data.zhanshou==="展开"){
      this.setData({
        zhanshou:"收起"
      })
    }else{
      this.setData({
        zhanshou:"展开"
      })
    }
  },
  // 判断是否收藏该商品
  changeSC: function(){
    var that=this
    // 判断是否登录,登录情况下
    if(wx.getStorageSync('userInfo')&&wx.getStorageSync('openId')){
      // 判断是否
      if(that.data.attention==="like-o"){
        app.http({
          url:"wxstore/storefollow",
          method:"POST",
          param:{
            fav_id:that.data.id,
            user_id:wx.getStorageSync('userId'),
            fav_type:"goods"
          }
        }).then(res=>{
          if(res.data.code==200){
            that.setData({
              attention:"like",
              color:"#E7260A"
            })
            app.showToast("收藏成功")
          }else{
            app.showToast(res.data.msg)
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
            fav_type:"goods"
          }
        }).then(res=>{
          if(res.data.code==200){
            that.setData({
              attention:"like-o",
              color:""
            })
          }else{
            app.showToast(res.data.msg)
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
  // 倒计时函数
  changeTime(){
    var that=this;
    // 获取当前时间
    var date=new Date();
    var now=parseInt(date.getTime()/1000);
    // 结束时间
    var endTime=that.data.endTime;
    // 开始时间
    var startime=that.data.startime;
    that.data.circulation = setTimeout(function(){
      // 如果结束时间大于现在时间则拍卖进行中
      if(endTime>now&&startime<now){
        that.setData({
          time:app.formatDuring2(endTime-now)
        })
        that.changeTime()
      // 否则拍卖结束
      }else{
        if(startime>now){
          that.setData({
            time:"拍卖未开始",
            isPat:false,//不能抢拍了
            depositPayment:"未开始"
          })
          that.changeTime()
        }else{
          that.setData({
            time:"拍卖已结束",
            isPat:false,//不能抢拍了
            depositPayment:"已结束"
          })
          // 清除轮询
          clearInterval(that.data.setInter)
        }
        // 时间结束如果自己出价最高则跳转到订单页面
        // if(that.data.allAuctionporce.length!=0){
        //   if(that.data.allAuctionporce[0].member_id==wx.getStorageSync("userId")){
        //     app.globalData.justAndAuction=0
        //     wx.navigateTo({
        //       url: '/pages/confirmAnOrder/confirmAnOrder',
        //     })
        //   }
        // }
        // console.log("计时器结束")
      }
    },1000)
  },
  // 将评价人姓名*号注释
  formatName: function(str) {
    return new Array(str.length).join('*') + str.substr(-1);
  },
  // 点击全部评价查看是否登录
  toAllPJ: function(){
    // 判断是否登录
    if(wx.getStorageSync('userInfo')&&wx.getStorageSync('openId')){
      wx.navigateTo({
        url: '/pages/allPJ/allPJ',
      })
    }else{
      // 未登录情况下跳转登录页面，并保存当前页面
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  // 点击查看全部出价人信息
  lookAllCJ: function(){
    var that=this
    // 判断是否登录
    if(wx.getStorageSync('userInfo')&&wx.getStorageSync('openId')){
      that.setData({
        isShow:!that.data.isShow
      })
    }else{
      // 未登录情况下跳转登录页面，并保存当前页面
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  // 直接购买,直接调用付款接口/付款成功
  toBuy: function(){
    var that=this
    // 判断是否登录
    if(wx.getStorageSync('userInfo')&&wx.getStorageSync('openId')){
      // 判断库存是否还有库存,如果isBuyNow为true时则库存未达上线,跳转订单页面
      if(that.data.isBuyNow){
        app.globalData.justAndAuction=1
        wx.navigateTo({
          url: '/pages/confirmAnOrder/confirmAnOrder',
        })
      }else{
        app.showToast("已无库存，暂时不能购买")
      }
    }else{
      // 未登录情况下跳转登录页面，并保存当前页面
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  // 根据是否缴纳保证金还是去出价判断弹窗
  toDepositpayment: function(){
    var that=this
    // 判断是否登录
    if(wx.getStorageSync('userInfo')&&wx.getStorageSync('openId')){
      // 判断当前是否可以抢拍,isPat判断是否在时间内
      if(that.data.isPat){
        // 如果为立即参拍则该商品需要缴纳保证金并且该用户未缴纳
        // console.log(that.data.depositPayment)
        if(that.data.depositPayment=="立即参拍"){
          that.setData({
            isCash:true
          })
        }else if(that.data.depositPayment=="去出价"||that.data.depositPayment=="再出价"){
          that.setData({
            isBid:true
          })
        }
      }else{
        app.showToast("请等待~")
      }
    }else{
      // 未登录情况下跳转登录页面，并保存当前页面
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  // 是否同意缴纳保证金
  onChange(event){
    var that=this
    if(event.detail==that.data.radio){
      that.setData({
        radio: "",
      })
    }else{
      that.setData({
        radio:event.detail
      })
    }  
  },
  // 缴纳保证金
  yesAndBuy(){
    var that=this
    if(that.data.radio==1){
      app.http({
        url:"wxorder/ordermargin",
        method:"POST",
        param:{
          uid:wx.getStorageSync("userId"),
          gid:that.data.id
        }
      }).then(res=>{
        // console.log(res)
        if(res.data.code==200){
          // 发起微信支付请求
          var data=res.data.data
          var order_sn=res.data.data.order_sn//存储订单号
          wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success(res) {
              if (res.errMsg == "requestPayment:ok") {
                that.setData({
                  isCash:false
                })
                // 支付成功发起定金回调
                app.http({
                  url:"wxapi/upmargin",
                  method:"POST",
                  param:{
                    order_sn,
                    uid:wx.getStorageSync("userId")
                  }
                }).then(res=>{
                  // console.log(res)
                  if(res.data.code==200){
                    that.lookPledge()
                  }else{
                    app.showToast(res.data.msg)
                  }
                }).catch(err=>{
                  app.showToast("请求失败，请稍后重试~")
                })
              } else {
                app.showToast("支付失败")
              }
            },
            fail(error) {
              if (error.errMsg == "requestPayment:fail cancel") {
                app.showToast("取消支付")
              }
            }
          })
        }else{
          app.showToast(res.data.msg)
        }
      }).catch(err=>{
        app.showToast("请求失败，请稍后重试~")
      })
    }else{
      app.showToast("请先同意拍卖协议")
    }
  },
  // 减价格
  reduce(){
    var that=this
    // 如果最低出价小于当前出价则可以往下减
    var lowPrice=that.data.auctionporce[0]?Number(that.data.auctionporce[0].price):that.data.shotdetail.goods_price
    if(app.changeTwoDecimal_f(app.help().Add(lowPrice,that.data.add_bond_price))<that.data.nowBidToPopup){
      that.setData({
        nowBidToPopup:app.changeTwoDecimal_f(app.help().Sub(that.data.nowBidToPopup,that.data.add_bond_price)),
        reduceColoe:"#333333",//可以减时为深色
        increaseColor:"#333333"//减时+为深色
      })
      if((lowPrice+that.data.add_bond_price)==that.data.nowBidToPopup){
        that.setData({
          reduceColor:"#999999",//减到最低时-变为浅色
          increaseColor:"#333333"//减价格的话+变为深色
        })
      }
    }else{
      that.setData({
        reduceColor:"#999999",//减到最低时-变为浅色
        increaseColor:"#333333"//减价格的话+变为深色
      })
    }
  },
  // 加价格
  increase(){
    var that=this
    // 如果最高价格大于当前出价则可以往上出
    console.log(that.data.shotdetail.goods_promotion_price,that.data.nowBidToPopup)
    if(that.data.shotdetail.goods_promotion_price>that.data.nowBidToPopup){
      that.setData({
        nowBidToPopup:app.changeTwoDecimal_f(app.help().Add(that.data.nowBidToPopup,that.data.add_bond_price)),
        reduceColor:"#333333",//可以加时-为深色
        increaseColor:"#333333",//可以加时+为深色
      })
      if(that.data.shotdetail.goods_promotion_price==that.data.nowBidToPopup){
        that.setData({
          reduceColoe:"#333333",//可以减时为深色
          increaseColor:"#999999"//减时+为深色
        })
      }
    }else{
      that.setData({
        reduceColor:"#333333",//不能加时-为深色
        increaseColor:"#999999",//不能加时+为浅色
      })
    }
  },
  // 立即出价 
  toOfferPrice(){
    var that=this
    // if(that.data.depositPayment=="出价领先中"){
    //   app.showToast("出价领先中，请稍后")
    // }else{
      wx.showModal({
        title: '提示',
        content: '您确定要出价￥'+that.data.nowBidToPopup+'元吗？',
        success: function (res) {
          if (res.confirm){
            app.http({
              url:"wxauctionlog/createauction",
              method:"POST",
              param:{
                uid:wx.getStorageSync('userId'),
                gid:that.data.id,
                price:that.data.nowBidToPopup
              }
            }).then(res=>{
              // console.log(res)
              if(res.data.code==200){
                // console.log("出价成功")
                that.setData({
                  isBid:false
                })
                if(that.data.nowBidToPopup==that.data.shotdetail.goods_promotion_price){
                  app.globalData.justAndAuction=0
                  wx.navigateTo({
                    url: '/pages/confirmAnOrder/confirmAnOrder',
                  })
                }
              }else{
                app.showToast(res.data.msg)
              }
            }).catch(err=>{
              app.showToast("请求失败，请稍后重试~")
            })
          }else{

          }
        }
      })
    // }
  },
  // 关闭弹窗
  onClose() {
    // console.log(13456)
    this.setData({ isBid: false,isCash:false });
  },
  // 判断自己是否缴纳过保证金
  lookPledge(){
    var that=this
    app.http({
      url:"wxorder/checkpay",
      method:"POST",
      param:{
        uid:wx.getStorageSync('userId'),
        gid:that.data.id
      }
    }).then(res=>{
      if(res.data.code==200){
        that.setData({
          depositPayment:"去出价"
        })
      }else{
        that.setData({
          depositPayment:"立即参拍"
        })
      }
    }).catch(err=>{
      app.showToast("请求失败，请稍后重试~")
    })
  },
  // 获取商品信息并判断
  getInfoDetail(){
    var that=this
    app.http({
      url:"wxindex/shotdetail",
      method:"GET",
      param:{
        id:that.data.id,
        uid:""
      }
    }).then(res=>{
      // 深拷贝两个数据，data进行剪切展现，data2进行必要的数据循环
      var data=JSON.parse(JSON.stringify(res.data.data));
      var data2=JSON.parse(JSON.stringify(res.data.data));
      // console.log("data,data2:",data,data2)
      // 全部出价人员信息
      that.setData({
        allAuctionporce:data2.auctionporce
      })
      // 如果浏览人数超过七个则头像只取前七个
      if(data.broesecont>7){
        data.broeseavatars=data.broeseavatars.slice(0,7);
      }
      // 如果出价人超过两个则只取前两个
      if(data.auctionporce.length>2){
        data.auctionporce=data.auctionporce.slice(0,2);
      }
      // 商品评价
      // if(data.shotcommon){
      //   data.shotcommon.member_name=that.formatName(data.shotcommon.member_name)
      //   data.shotcommon.geval_addtime=app.formatDate(data.shotcommon.geval_addtime*1000)
      // }

      // 好评率
      // data.store.store_desccredit=((data.store.store_desccredit/5)*100).toFixed(2)
      // 将商品起拍价和成交价转为数字
      data.shotdetail.goods_price=app.changeTwoDecimal_f(data.shotdetail.goods_price)
      data.shotdetail.goods_promotion_price=app.changeTwoDecimal_f(data.shotdetail.goods_promotion_price)
      that.setData({
        auctionporce:data.auctionporce,//用户拍卖记录，出价人信息
        broeseavatars:data.broeseavatars,//浏览人头像
        broesecont:data.broesecont,//浏览次数
        // commontotal:data.commontotal,//评价总数
        pricecont:data.shotdetail.add_bond_count,//拍卖次数
        shotbody:data.shotbody,//商品描述图片等
        // shotcommon:data.shotcommon,//最新评价
        shotdetail:data.shotdetail,//商品信息
        inventory:data.shotdetail.goods_salenum,//当前库存
        store:data.store,//店铺信息
        add_bond_price:Number(data.shotdetail.add_bond_price),//加价金额
        endTime:data.shotdetail.goods_endtime,//商品拍卖结束时间
        startime:data.shotdetail.goods_startime//商品开始时间
        // nowBidToPopup:auctionporce[0].price?auctionporce[0].price+add_bond_price:shotdetail.goods_price+add_bond_price,//当前最低出价金额
        // nowBidToPopup:data.auctionporce.length!=0?Number(data.auctionporce[0].price)+Number(data.shotdetail.add_bond_price):data.shotdetail.goods_price+Number(data.shotdetail.add_bond_price)//当前最低出价金额
      })
      var nowMoney=data.auctionporce.length!=0?app.changeTwoDecimal_f(app.help().Add(data.auctionporce[0].price,data.shotdetail.add_bond_price)):app.changeTwoDecimal_f(app.help().Add(data.shotdetail.goods_price,data.shotdetail.add_bond_price))
      if(that.data.minimum!=nowMoney){
        console.log("前后两次不同",that.data.minimum,nowMoney)
        that.setData({
          nowBidToPopup:app.changeTwoDecimal_f(nowMoney),
          minimum:app.changeTwoDecimal_f(nowMoney)
        })
      }else{
        // console.log("两次相同")
      }
      // 每次进来判断是否可以直接购买,库存达到上线则不能购买
      if(that.data.inventory==that.data.shotdetail.goods_storage){
        that.setData({
          isBuyNow:false
        })
      }
      
      // 判断是否显示评价
      // var newShotCommon=that.data.shotcommon
      // if(newShotCommon){
      //   that.setData({
      //     isHidden:false
      //   })
      // }else{
      //   that.setData({
      //     isHidden:true
      //   })
      // }
      // 判断每次加价多少(市场价-低价)/竞拍次数
      // var jiajia=(data2.shotdetail.goods_promotion_price-data2.shotdetail.goods_price)/data2.pricecont
      // 当前出价到第几步(当前价格-低价)/加价,如果竞拍记录为0则未有人竞拍
      if(data2.auctionporce.length===0){
        var dataLength=0
      }else{
        // （竞拍人第一个未最高价-商品最低价格）/一次出价多少钱
        var dataLength=(data2.auctionporce[0].price-data2.shotdetail.goods_price)/data2.shotdetail.add_bond_price
      }
      var chuiziAll=[]
      // 循环一共出价次数加上初始次数
      for(var i=0;i<=data2.shotdetail.add_bond_count;i++){
        if(i==0){//第一个为大的红色
          chuiziAll.push("/images/chuizi.png")
        }else if(i==data2.shotdetail.add_bond_count){//最后一个为大的灰色
          chuiziAll.push("/images/chuizi4.png")
        }else{//中间全部为小的红色
          chuiziAll.push("/images/chuizi2.png")
        }
      }
      // 从出价次数后+1修改后面次数，将当前出价后的小红色改为小灰色
      for(var i=dataLength+2;i<data.shotdetail.add_bond_count;i++){
        chuiziAll[i]="/images/chuizi3.png"
      }
      // 将出的最高价后面改为大锤子，为下一次出价
      if(dataLength==0){//如果没有人出价则第二个为大锤子
        chuiziAll[1]="/images/chuizi.png"
      }else{
        for(let i=0;i<chuiziAll.length+1;i++){
          if((i-1)==dataLength){
            // 判断用户是否登录
            if(wx.getStorageSync('userId')){
              // 如果下一次出价没有超过最高价
              // if(that.data.minimum<=that.data.shotdetail.goods_promotion_price){
              // 判断自己是否已经出过价格，并出价几次
              var allJia=[]
              for(var j=0;j<that.data.allAuctionporce.length;j++){
                // 如果出过价格
                if(that.data.allAuctionporce[j].member_id==wx.getStorageSync('userId')){
                  allJia.push(that.data.allAuctionporce[j])
                }
              }
              // 判断是否只能出价一次
              if(that.data.shotdetail.is_user==0){
                that.setData({
                  depositPayment:"去出价",
                })
                // 如果数组长为0则有人出价自己未出价
                if(allJia.length==0){        
                  if(i!=chuiziAll.length){
                    chuiziAll[i]=wx.getStorageSync('userInfo').avatarUrl
                  }        
                }else{
                  if(i!=chuiziAll.length){
                    chuiziAll[i]="/images/chuizi.png"
                  }
                  // 不能再次出价
                  that.setData({
                    isPat:false
                  })
                  // 判断自己头像的位置
                  chuiziAll[(Number(allJia[0].price)-data2.shotdetail.goods_price)/data2.shotdetail.add_bond_price]=wx.getStorageSync('userInfo').avatarUrl
                }
              }else{
                // 如果可以多次出价，并且自己出了一次或以上
                if(allJia.length>=1){
                  // 不能再次出价
                  that.setData({
                    depositPayment:"再出价",
                  })
                  for(let k=0;k<allJia.length;k++){
                    chuiziAll[(Number(allJia[k].price)-data2.shotdetail.goods_price)/data2.shotdetail.add_bond_price]=wx.getStorageSync('userInfo').avatarUrl
                    // console.log(i,k)
                  }
                }else{
                  that.setData({
                    depositPayment:"去出价",
                  })
                }
                if(i!=chuiziAll.length){
                  chuiziAll[i]=wx.getStorageSync('userInfo').avatarUrl
                }
                // }
              }
            }else{
              if(i!=chuiziAll.length){
                chuiziAll[i]="/images/chuizi.png"
              }
              that.setData({
                depositPayment:"去出价",
              })
            }
          }
        }
      }
      that.setData({
        chuiziAll:chuiziAll,//图片数组
        dataLength:dataLength
      })

      // 判断活动是否结束
      if(that.data.shotdetail.goods_endtime==0){
        that.setData({
          time:"拍卖已结束",
          isPat:false,//不能抢拍了
          depositPayment:"已结束",
          endTime:0
        })
        // 清除轮询
        clearInterval(that.data.setInter)
      }else{
        that.changeTime()
        // 判断该商品是否需要缴纳保证金,bond为0则该商品不用缴纳保证金，1则缴
        if(that.data.shotdetail.bond==0){
          // 没人参拍
          if(!that.data.depositPayment){
            // 如果没人出价的情况下设置为去出价，有人出价的情况下上面有
            if(that.data.allAuctionporce.length==0){
              that.setData({
                depositPayment:"去出价"
              })
            }
          }
        }else{
          // 如果没有这个参数则一次请求都没有
          if(!that.data.depositPayment){
            // 请求查看是否缴纳保证金
            that.lookPledge()
          }
        }
      }     
    }).catch(err=>{
      app.showToast("请求失败，请稍后重试~")
    })
  },
  // 没隔5秒请求一次数据
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    // 获取传来的商品id并存储
    var id=options.id;
    app.globalData.gid=id,//将商品id存储再app.js中
    that.setData({
      id:id
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
    var that=this
    // 获取屏幕
    wx.getSystemInfo({
      success (res) {
        // 设置悬浮框的位置
        that.setData({
          x:res.windowHeight
        })
      }
    })
    app.globalData.address_id=""//清空地址id
    that.setData({
      user_id:wx.getStorageSync('userId')?wx.getStorageSync('userId'):'',
      userInfo:wx.getStorageSync('userInfo')?wx.getStorageSync('userInfo'):''
    })
    // 轮询获取商品信息
    that.getInfoDetail()
    that.data.setInter = setInterval(
      function () {
          that.getInfoDetail()
      }
    , 3000); 
    // 判断用户是否登录请求数据判断是否收藏
    if(wx.getStorageSync('userInfo')&&wx.getStorageSync('openId')){
      // console.log("需要发起请求")
      app.http({
        url:"wxstore/storeisfollow",
        method:"POST",
        param:{
          fav_id:that.data.id,//商品id
          user_id:wx.getStorageSync('userId'),
          fav_type:"goods"
        }
      }).then(res=>{
        if(res.data.code==200){
          that.setData({
            attention:"like",
            color:"#E7260A"
          })
        }else if(res.data.code==204){
          that.setData({
            attention:"like-o",
            color:""
          })
        }else{
          app.showToast(res.data.msg)
        }
      }).catch(err=>{
        app.showToast("请求失败，请稍后重试~")
      })
    }else{
      // 未登录则显示关注
      that.setData({
        attention:"like-o",
        color:""
      })
    }
    // app.connectSocket()
    // websocket打开
    // wx.onSocketOpen(() => {
    //   console.log('监听到 WebSocket 连接已打开！');
    //   wx.sendSocketMessage({
    //     data:that.data.id
    //   })
    // })
    //连接失败
    // wx.onSocketError((err) => {
    //   console.log('websocket连接失败', err);
    //   app.connectSocket();
    // })
    // 收到websocket消息
    // wx.onSocketMessage(function (res) {
    //   console.log(res)
    // })
    // 检测到 WebSocket 连接已关闭
    // wx.onSocketClose(function (res) {
    //   console.log('监听到 WebSocket 连接已关闭！');
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that=this
    // console.log("清除计时器")
    clearInterval(that.data.setInter)
    // wx.closeSocket();
    // clearInterval(that.data.circulation)//清除计时器
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // console.log("清除计时器")
    var that=this
    clearInterval(that.data.setInter)
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