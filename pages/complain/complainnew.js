// pages/product/list.js
var app = getApp();
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");
const tipUtil = require("../../utils/tipsUtil");

var create = function (that,openId) {
    var param = {

    }
    httpUtil.http_post(URL.SERVER.COMPLAIN_TYPE_NEW, param, function (res) {
        if (res.data.code == 1 && res.data.data.length > 0) {
            that.setData({
                list: res.data.data,
                hidden: true
            });
        }
    });
}

Page({
    data: {
        hidden: true,
        page:0,
        list: [],
        to_open_id:'',
        complain_type:'0'

    },

    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this
        var data = JSON.parse(options.data);
        this.setData({
            to_open_id:data.to_user_id,
            complain_type: data.type,
        })

        httpUtil.http_get(URL.SERVER.AUTH_CHECKTOKEN_URL, null, function () {
        });
    },

    onReady: function () {
        // 页面渲染完成
        wx.setNavigationBarTitle({
            title: '投诉内容'
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
        var param = {
            complain_content:this.data.message,
            userOpenId:this.data.to_open_id,
            complain_type:this.data.complain_type,
        }
        httpUtil.http_post(URL.SERVER.COMPLAIN_TYPE_NEW,param,function (res) {
            if(res.data.code == 1){
                wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 3000
                });
                wx.navigateBack({
                    delta: 2
                })
            } else {
                wx.showToast({
                    title: '提交失败',
                    icon: 'success',
                    duration: 3000
                });
            }

        })
    },

    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    }
})