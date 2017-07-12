// pages/auth/bind.js
var app = getApp();
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");

var timer ;
Page({
    data:{
        mobile:'',
        mobileVerify:'',
        codeVerify:'',
        login_disable:true,
        code_enable:true,

        timer_count:60,

        isChecked:false,
    }
    ,
    onLoad:function(options){
      // 页面初始化 options为页面跳转所带来的参数
    },

    mobileInput: function(e) {
        this.setData({
            mobile: e.detail.value
        })
    },

    codeInput: function(e) {
        this.setData({
            codeVerify: e.detail.value
        })
    },

    getVerifyCode:function() {
        var that = this;
        //verify mobile number
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if(!myreg.test(this.data.mobile))
        {
            wx.showToast({title: '请输入有效的手机号码！', icon: 'success', duration: 3000})
            return false;
        }

        timer=setInterval(function () {
            if (that.data.timer_count > 0) {
                that.setData({
                    timer_count : that.data.timer_count - 1 ,
                    code_enable : false
                })
            }else {
                that.setData({
                    timer_count : 60 ,
                    code_enable : true
                })
                clearInterval(timer);
            }
        },1000)

        var param = {'mobile':this.data.mobile};
        httpUtil.http_get(URL.SERVER.AUTH_SMS_GETCODE_URL, param,function (res) {
            that.setData({
                //verifyCode:res.data.data,
                mobileVerify:that.data.mobile,
                login_disable: false,
            });


            wx.showToast({title: res.data.data, icon: 'success', duration: 3000})
        })
    },

    instantLogin: function () {
        var that = this;

        if(!this.data.isChecked){
            wx.showToast({
                title: '请阅读并同意《免责声明 & 使用协议》',
                icon: 'success',
                duration: 3000
            });
            return;
        }

        app.getUserInfo(function (userInfo) {
            if(typeof userInfo.nickName == 'null' || that.data.codeVerify=='' || that.data.mobileVerify=='') {
                wx.showToast({title: "电话或验证码为空", icon :'success', duration: 3000})
                return;
            }

            var param = {
                mobile:that.data.mobileVerify,
                code:that.data.codeVerify,
                display_name: userInfo.nickName,
                avatar_url: userInfo.avatarUrl
            };

            httpUtil.http_post(URL.SERVER.AUTH_USER_LOGIN_URL, param,function (res) {
                wx.setStorageSync('token', res.data.data);
                app.globalData.token = res.data.data;
                wx.showToast({title: "登陆成功！", icon: 'success', duration: 3000})
                wx.navigateBack({
                  delta: 1, // 回退前 delta(默认为1) 页面
                  complete: function(res) {
                  }
                })
            })
        });
    },

    onCheckTap:function () {
        this.setData({
            isChecked : !this.data.isChecked,
        })
    },

    onTermsLink:function () {
        wx.navigateTo({
            url:"terms"
        });
    }
})