//index.js
//获取应用实例
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");
const tipUtil = require("../../utils/tipsUtil");
const viewRouter = require("../../utils/viewRouter");
var app = getApp()
Page({
    data: {
        userInfo: {},
        //source: 'github.com/wangmingjob/weapp-weipiao'
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    onLoad: function () {
        var that = this
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })

        httpUtil.http_get(URL.SERVER.AUTH_CHECKTOKEN_URL, null, function () {
        });
    },

    onReady: function () {
        wx.setNavigationBarTitle({
            title: '我的'
        })
    },

    onMyAccount: function () {
        wx.navigateTo({
            url: 'money'
        })
    },

    onFollowingList:function () {
      wx.navigateTo({
          url:'../user/followlist?data=' + 0
      });
    },
    onFollowedList:function () {
        wx.navigateTo({
            url:'../user/followlist?data=' + 1
        });
    },

    onSettingTap: function () {
        wx.navigateTo({
            url:'../mine/setting'
        });
    },

    onAdviceMessage: function () {
        wx.navigateTo({url: 'adviceMessage'});
    },

    onExportTap:function () {
        var url = wx.getStorageSync(URL.SERVER.QINIU_EXCEL_KEY);

        if (url.length <= 0) {
            wx.showToast({
                title: '还没有导出哦～',
                icon: 'success',
                duration: 2000
            });
            return;
        }

        //var timestamp = (new Date()).valueOf();

        tipUtil.showConfirmTitle('复制到剪贴板？', url, function () {
            wx.setClipboardData({
                data: url,
                success: function(res) {
                    wx.showToast({
                        title: '复制成功～',
                        icon: 'success',
                        duration: 2000
                    });
                    // wx.getClipboardData({
                    //     success: function(res) {
                    //         console.log(res.data) // data
                    //     }
                    // })
                }
            })
        });
    },

    onUserIconTap:function () {
        var user = this.data.userInfo;
        user.isMime = true;
        user.avatar = user.avatarUrl;
        user.displayName = user.nickName;
        viewRouter.switchToUserProfile(user);
    },

    onAuth:function () {
        wx.navigateTo({url: '../auth/bankCard'});
    },

    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();

    },

})
