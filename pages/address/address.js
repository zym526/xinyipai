// pages/address/address.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,//设置默认
    messages:[],//所有收获地址
    show: false,//弹出层显示隐藏
    username:"",//弹出层收货人姓名
    youPhone:"",//弹出层手机号
    youAddress:"",//地区
    addressAll:"",//弹出层具体位置
    isShowCity:false,//地址选择弹出层
    // selectAll:["请选择","","",""],//省市区县
    province:{name:"请选择",id:""},//省
    city:{name:"",id:""},//市
    district:{name:"",id:""},//区
    county:{name:"",id:""},//县
    provinceAll:[],//所有省份
    cityAll:[],//所有市
    districtAll:[],//所有区
    countyAll:[],//所有县
    indexNow:1,//当前是省市区县哪一个显示
  },
  // 点击添加收获地址，显示弹出层,将存储数据清空
  showPopup() {
    var that=this
    that.setData({ 
      show: true,
      addOrEdit:"添加地址",
      username:"",
      youPhone:"",
      addressAll:"",
      editId:"",
    });
  },
  // input框变化
  onChangeName(e){
    this.setData({
      username:e.detail.value
    })
  },
  // 监听电话input框
  onChangePhone(e){
    this.setData({
      youPhone:e.detail.value
    })
  },
  // 详细地址
  onChangeAddress(e){
    this.setData({
      addressAll:e.detail.value
    })
  },
  // 打开地址选择
  open(){
    var that=this
    that.setData({
      isShowCity:true
    })
    that.setData({
      indexNow:that.data.indexNow-1
    })
    // 获取省份
    app.http({
      url:"jdaddress/getprovince",
      method:"POST",
    }).then(res=>{
      if(res.data.code==200){
        that.setData({
          provinceAll:res.data.data
        })
      }else{
        app.showToast(res.data.msg)
      }
    }).catch(err=>{
      app.showToast("请求失败，请稍后重试~")
    })
  },
  // 选择省市区县
  selectAllCity(e){
    var that=this
    var id=e.currentTarget.dataset.id//省市区县id
    var name=e.currentTarget.dataset.name//省市区县名字
    that.setData({//当前选中的省市区县
      indexNow:that.data.indexNow+1,
    })
    var url
    if(that.data.indexNow==1){//为1时省份名字
      url="jdaddress/getcity"
      that.setData({
        province:{name,id},
      })
    }else if(that.data.indexNow==2){//为2时市的名字
      url="jdaddress/gettowon",
      that.setData({
        city:{name,id},
      })
    }else if(that.data.indexNow==3){//为3时区的名字
      url="jdaddress/street"
      that.setData({
        district:{name,id},
      })
    }else{
      that.setData({
        county:{name,id},
        youAddress:that.data.province.name+that.data.city.name+that.data.district.name+name,
        isShowCity:false
      })
    }
    // 如果打开了地址选择则可以发起请求
    if(that.data.isShowCity){
      app.http({
        url,
        method:"POST",
        param:{
          id
        }
      }).then(res=>{
        if(res.data.code==200){
          console.log(that.data.indexNow)
          // 判断是否有数据
          if(res.data.data){
            // 当当前下标为1，2，3时分别对应城市，区，镇
            if(that.data.indexNow==1){
              that.setData({
                cityAll:res.data.data,
                city:{name:"请选择",id:""},
                district:{name:"",id:""},
                county:{name:"",id:""}
              })
              console.log(that.data.city)
            }else if(that.data.indexNow==2){
              that.setData({
                districtAll:res.data.data,
                district:{name:"请选择",id:""},
                county:{name:"",id:""}
              })
            }else if(that.data.indexNow==3){
              that.setData({
                countyAll:res.data.data,
                county:{name:"请选择",id:""}
              })
            }
          }else{
            // 如果没有数据则判断当前为第几区
            if(that.data.indexNow==1){
              that.setData({
                youAddress:that.data.province.name,
                city:{name:"",id:""},
                district:{name:"",id:""},
                county:{name:"",id:""}
              })
            }else if(that.data.indexNow==2){
              that.setData({
                youAddress:that.data.province.name+that.data.city.name,
                district:{name:"",id:""},
                county:{name:"",id:""}
              })
            }else if(that.data.indexNow==3){
              that.setData({
                youAddress:that.data.province.name+that.data.city.name+that.data.district.name,
                county:{name:"",id:""}
              })
            }
            // 没有数据则关闭
            that.setData({
              isShowCity:false
            })
          }
        }else{
          app.showToast(res.data.msg)
        } 
      }).catch(err=>{
        app.showToast("请求失败，请稍后重试~")
      })
    }
  },
  // 选择地址切换
  changeCity(e){
    var that=this
    that.setData({
      indexNow:Number(e.currentTarget.dataset.index)
    })
  },
  // 编辑地址
  editData(e){
    console.log(e)
    var that=this
    var item=e.currentTarget.dataset.item
    console.log(item)
    that.setData({
      addOrEdit:"编辑地址",
      username:item.address_realname,
      youPhone:item.address_mob_phone,
      province:{name:item.provice,id:item.provinceid},
      city:{name:item.city,id:item.cityid},
      district:{name:item.area,id:item.areaid},
      county:{name:item.area_info,id:item.area_infoid},
      addressAll:item.address_detail,
      editId:item.address_id,
      youAddress:item.provice+item.city+item.area+item.area_info,
      indexNow:1,
      show:true
    })
    // 获取市
    app.http({
      url:"jdaddress/getcity",
      method:"POST",
      param:{
        id:item.provinceid
      }
    }).then(res=>{
      if(res.data.code==200){
        that.setData({
          cityAll:res.data.data
        })
      }
    }).catch(err=>{
      app.showToast("请求失败，请稍后重试~")
    })
    // 获取区
    app.http({
      url:"jdaddress/gettowon",
      method:"POST",
      param:{
        id:item.cityid
      }
    }).then(res=>{
      if(res.data.code==200){
        that.setData({
          districtAll:res.data.data
        })
      }
    }).catch(err=>{
      app.showToast("请求失败，请稍后重试~")
    })
    // 获取县
    app.http({
      url:"jdaddress/street",
      method:"POST",
      param:{
        id:item.areaid
      }
    }).then(res=>{
      if(res.data.code==200){
        that.setData({
          countyAll:res.data.data
        })
      }
    }).catch(err=>{
      app.showToast("请求失败，请稍后重试~")
    })
  },
  // 保存或编辑地址
  save(){
    var that=this
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if(that.data.username==""){
      app.showToast("请输入姓名")
    }else if(!myreg.test(that.data.youPhone)){
      app.showToast("手机号格式不正确")
    }else if(that.data.youAddress==""){
      app.showToast("请选择地区")
    }else if(that.data.addressAll===""){
      app.showToast("请输入详细地址")
    }else{
      var nowUrl,param
      param={
        member_id:wx.getStorageSync('userId'),
        address_realname:that.data.username,
        provice:that.data.province.name,
        city:that.data.city.name,
        area:that.data.district.name,
        area_info:that.data.county.name,
        provinceid:that.data.province.id,
        cityid:that.data.city.id,
        areaid:that.data.district.id,
        area_infoid:that.data.county.id,
        address_detail:that.data.addressAll,
        address_mob_phone:that.data.youPhone,
        address_is_default:""
      }
      if(that.data.addOrEdit=="添加地址"){
        nowUrl="wxuser/useraddersscreate"
      }else{
        nowUrl="wxuser/useraddedit"
        param.id=that.data.editId
      }
      app.http({
        url:nowUrl,
        method:"POST",
        param
      }).then(res=>{
        that.onClose();
        that.onShow()
      }).catch(err=>{
        app.showToast("请求失败，请稍后重试~")
      })
    }   
  },
  // 设置或取消默认地址,type设置传1,取消传0
  onChange(event) {
    var that=this
    var type
    // 如果选中和当前一致则为取消，如果不一致则为设置
    if(event.detail==that.data.radio){
      type=0
    }else{
      type=1    
    }
    app.http({
      url:"wxuser/useraddset",
      method:"POST",
      param:{
        type,
        id:event.detail,
        member_id:wx.getStorageSync('userId')
      }
    }).then(res=>{
      console.log(res)
      that.onShow()
    }).catch(err=>{
      app.showToast("请求失败，请稍后重试~")
    })
  },
  // 删除地址
  delData(e){
    var that=this
    wx.showModal({
      content: '您确定要删除该地址吗？',
      confirmColor:"#E7260A",
      success: function (res) {
        if (res.confirm){
          app.http({
            url:"wxuser/useradddel",
            method:"POST",
            param:{
              id:e.currentTarget.dataset.item.address_id
            }
          }).then(res=>{
            console.log(res)
            that.onShow()
          }).catch(err=>{
            console.log(err)
            app.showToast("请求失败，请稍后重试~")
          })
        }else{

        }
      }
    })
  },
  // 关闭弹出层
  onClose() {
    this.setData({ show: false });
  },
  onClose2(){
    var that=this
    that.setData({ isShowCity:false,indexNow:that.data.indexNow+1 });
  },
  // 跳转到订单页面
  toConfirmAnOrder(e){
    if(app.globalData.personal==""){
      app.globalData.address_id=e.currentTarget.dataset.item.address_id
      wx.redirectTo({
        url: '/pages/confirmAnOrder/confirmAnOrder',
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
    // 获取地址信息
    app.http({
      url:"wxuser/useradderss",
      method:"POST",
    }).then(res=>{
      if(res.data.code==204){
        that.setData({
          messages:[],
          isAddress:true
        })
      }else if(res.data.code==200){
        that.setData({
          messages:res.data.data,
          radio:"",
          isAddress:false
        })
        that.data.messages.forEach(item=>{
          if(item.address_is_default=="1"){
            that.setData({
              radio:item.address_id
            })
          }
        })
      }else{
        app.showToast(res.data.msg)
      }
    }).catch(err=>{
      app.showToast("请求失败，请稍后重试~")
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

  },
})