/**
 * Created by uyoung on 04/06/2017.
 */
var app = getApp();

Page({
    data:{
        type:''
    }
    ,
    onLoad:function(options){
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            type: options.data
        })
    },

    onReady: function () {
        wx.setNavigationBarTitle({
            title: '帮助'
        })
    },
})