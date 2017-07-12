//index.js
//获取应用实例
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");
const tipUtil = require("../../utils/tipsUtil");
var app = getApp()
Page({
    data: {

        //source: 'github.com/wangmingjob/weapp-weipiao'
    },

    onLoad: function () {
        var that = this
        httpUtil.http_get(URL.SERVER.AUTH_CHECKTOKEN_URL, null, function () {
        });
    },

    onReady: function () {
        wx.setNavigationBarTitle({
            title: '设置'
        })
    },

    onLogout: function () {
        // http logout
        tipsUtil.showConfirmCancel("真的要退出？",function () {
            wx.clearStorageSync();
        });

    },

    onHelp:function () {
        //httpUtil.openOnlineDoc(URL.SERVER.QINIU_DOMAIN + 'push.pdf');
        wx.navigateTo({
            url: '../help/help'
        });
    },

    onAbout:function () {
        //httpUtil.openOnlineDoc(URL.SERVER.QINIU_DOMAIN + 'push.pdf');
        wx.navigateTo({
            url: '../help/about'
        });
    },

    onSettingTap: function () {
        // wx.openSetting(function (res) {
        //     console.log(res);
        // });
    },

    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();

    },

    onExportTap:function () {

    },

    onLogin:function () {
        wx.navigateTo({
            url: '../auth/bind'
        });

    }
})
