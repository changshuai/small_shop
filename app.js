//app.js
var app = getApp();
const URL = require("utils/urlUtil");

var syncOpenIdToServer = function (code) {
    wx.request({
        url: URL.SERVER.LOGIN_URL,
        data: {
            code: code,
        },
        success: function (res) {
            console.log(res);
            console.log("rd_session: " + res.data.data);
            getApp().globalData.rd_session = res.data.data;
            // store the rd_session
            wx.setStorageSync('rd_session', res.data.data);
        }
    });
}

App({
    onLaunch: function () {
        this.checkSession();
        this.getUserInfo();
    },

    checkSession: function () {
        var that = this
        wx.checkSession({
            success: function () {
                console.log("checkSession success!");
            },
            fail: function () {
                console.log("checkSession fail!");
                that.wxLogin();
            }
        })
    },

    getSession: function (cb) {

        if (!this.globalData.rd_session) {
            this.globalData.rd_session = wx.getStorageSync('rd_session')
        }

        console.log('用户session is: ' + this.globalData.rd_session);
        return this.globalData.rd_session;
    },

    getToken:function (cb) {
        if (!this.globalData.token) {
            this.globalData.token = wx.getStorageSync('token')
        }

        console.log('用户token is: ' + this.globalData.token);
        return this.globalData.token;
    },

    wxLogin: function (cb) {
        var that = this
        wx.login({
            success: function (res) {
                console.info(res);
                if (res.code) {
                    syncOpenIdToServer(res.code);
                    console.log('获取用户登录态 code is:' + res.code)
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }

                wx.getUserInfo({
                    success: function (res) {
                        that.globalData.userInfo = res.userInfo
                        wx.setStorageSync('userInfo', res.userInfo);
                        typeof cb == "function" && cb(that.globalData.userInfo)
                    }
                })
            }
        })
    },

    // get memory, and storage , and server
    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            var userInfo = wx.getStorageSync('userInfo');
            if(userInfo){
                that.globalData.userInfo = userInfo;
                typeof cb == "function" && cb(that.globalData.userInfo);
            }else {
                //调用登录接口
                that.wxLogin(cb);
                // wx.login({
                //     success: function (res) {
                //         syncOpenIdToServer(res.code);
                //
                //         wx.getUserInfo({
                //             success: function (res) {
                //                 that.globalData.userInfo = res.userInfo
                //
                //                 wx.setStorageSync('userInfo', res.userInfo);
                //
                //                 typeof cb == "function" && cb(that.globalData.userInfo)
                //             }
                //         })
                //     }
                // })
            }
        }
    },

    globalData: {
        userInfo: null,
        rd_session: "",
        token:""
    }
})