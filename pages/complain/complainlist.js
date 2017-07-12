// pages/product/list.js
var app = getApp();
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");
const tipUtil = require("../../utils/tipsUtil");

var getList = function (that) {

    httpUtil.http_get(URL.SERVER.COMPLAIN_TYPE_LIST, null, function (res) {
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
        C:''
    },

    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this;

        this.setData({
            to_user_id : JSON.parse(options.data),
        });
        httpUtil.http_get(URL.SERVER.AUTH_CHECKTOKEN_URL, null, function () {
            getList(that);
        });
    },

    onReady: function () {
        // 页面渲染完成
        wx.setNavigationBarTitle({
            title: '投诉列表'
        })
    },

    switchToDetail: function (event) {
        console.log(event.currentTarget.dataset.index);
        var data = {
            type : this.data.list[event.currentTarget.dataset.index],
            to_user_id : this.data.to_user_id,
        }
        wx.navigateTo({
            url: '../complain/complainnew?data=' + JSON.stringify(data)
        })
    },

    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    }
})