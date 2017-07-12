//index.js
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");
const tipUtil = require("../../utils/tipsUtil");
//获取应用实例
var app = getApp()
Page({
    data: {
        total: 0,
        message: '',
        message_len:0
    },

    onLoad: function () {
        var that = this
    },

    onReady: function () {
        wx.setNavigationBarTitle({
            title: '意见反馈'
        })
    },

    messageInput: function(e) {
        var l = e.detail.value.length;
        this.setData({
            message_len:l,
            message: e.detail.value
        })
    },

    onsubmit:function () {
        httpUtil.http_post(URL.SERVER.ADVICE_MESSAGE,{message:this.data.message},function () {
            tipUtil.showConfirm("提交成功", function () {
                wx.navigateBack({
                    delta: 1
                })
            });
        })
    }

})
